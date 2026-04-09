from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, database
from typing import List

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Event Managers API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = models.User(email=user.email, full_name=user.full_name, password=user.password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if user.role == 'manager' and user.manager_profile:
        new_profile = models.ManagerProfile(
            user_id=new_user.id,
            business_name=user.manager_profile.business_name,
            event_types=user.manager_profile.event_types,
            description=user.manager_profile.description,
            min_price=user.manager_profile.min_price,
            image_url=user.manager_profile.image_url
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_user)
        
    return new_user

@app.post("/login", response_model=schemas.UserResponse)
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email, models.User.password == user.password).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return db_user

@app.get("/managers", response_model=List[schemas.UserResponse])
def get_managers(db: Session = Depends(database.get_db)):
    return db.query(models.User).filter(models.User.role == 'manager').all()

@app.get("/managers/match", response_model=List[schemas.UserResponse])
def match_managers(
    event_type: str = Query(""),
    budget: float = Query(0),
    db: Session = Depends(database.get_db)
):
    """Find managers matching event type and budget."""
    managers = db.query(models.User).filter(models.User.role == 'manager').all()
    results = []
    for mgr in managers:
        if not mgr.manager_profile:
            continue
        profile = mgr.manager_profile
        # Budget filter: manager's min_price must be <= user's budget
        if budget > 0 and profile.min_price > budget:
            continue
        # Event type filter (case-insensitive substring match)
        if event_type:
            mgr_types = [t.strip().lower() for t in profile.event_types.split(',')]
            if not any(event_type.lower() in t for t in mgr_types):
                continue
        results.append(mgr)
    # Sort by price ascending (best value first)
    results.sort(key=lambda m: m.manager_profile.min_price)
    return results

@app.post("/event-requests", response_model=schemas.EventRequestResponse)
def create_request(req: schemas.EventRequestCreate, client_id: int = Query(...), db: Session = Depends(database.get_db)):
    new_req = models.EventRequest(
        client_id=client_id,
        manager_id=req.manager_id,
        event_type=req.event_type,
        date=req.date,
        budget=req.budget,
        special_requirements=req.special_requirements,
        status="Pending"
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

@app.get("/event-requests", response_model=List[schemas.EventRequestResponse])
def get_requests(user_id: int, role: str, db: Session = Depends(database.get_db)):
    if role == 'client':
        return db.query(models.EventRequest).filter(models.EventRequest.client_id == user_id).all()
    else:
        return db.query(models.EventRequest).filter(models.EventRequest.manager_id == user_id).all()

@app.patch("/event-requests/{request_id}", response_model=schemas.EventRequestResponse)
def update_request_status(request_id: int, status: str = Query(...), db: Session = Depends(database.get_db)):
    """Update an event request's status (Accept/Reject)."""
    req = db.query(models.EventRequest).filter(models.EventRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if status not in ["Accepted", "Rejected", "Pending"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    req.status = status
    db.commit()
    db.refresh(req)
    return req

# ── Chat Messages ──

@app.post("/messages", response_model=schemas.MessageResponse)
def send_message(msg: schemas.MessageCreate, db: Session = Depends(database.get_db)):
    """Send a chat message within an event request conversation."""
    # Verify the event request exists
    req = db.query(models.EventRequest).filter(models.EventRequest.id == msg.event_request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Event request not found")
    # Verify sender is part of this conversation
    if msg.sender_id not in [req.client_id, req.manager_id]:
        raise HTTPException(status_code=403, detail="Not authorized for this conversation")
    
    new_msg = models.Message(
        event_request_id=msg.event_request_id,
        sender_id=msg.sender_id,
        content=msg.content
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg

@app.get("/messages", response_model=List[schemas.MessageResponse])
def get_messages(event_request_id: int, db: Session = Depends(database.get_db)):
    """Get all messages for a specific event request conversation."""
    messages = db.query(models.Message).filter(
        models.Message.event_request_id == event_request_id
    ).order_by(models.Message.timestamp.asc()).all()
    return messages
