from database import engine, SessionLocal
import models

def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(models.User).filter(models.User.role == "manager").first():
        print("Managers already seeded!")
        return

    sample_managers = [
        models.User(
            full_name="Alice Wonderland",
            email="alice@events.com",
            password="pass",
            role="manager"
        ),
        models.User(
            full_name="Bob Builder",
            email="bob@corporate.com",
            password="pass",
            role="manager"
        )
    ]
    
    for mgr in sample_managers:
        db.add(mgr)
    db.commit()
    
    # Refresh to get IDs
    alice = db.query(models.User).filter(models.User.email == "alice@events.com").first()
    bob = db.query(models.User).filter(models.User.email == "bob@corporate.com").first()
    
    profiles = [
        models.ManagerProfile(
            user_id=alice.id,
            business_name="Wonderland Weddings & Birthdays",
            event_types="Wedding, Birthday",
            description="Specializing in magical themed weddings and unforgettable birthday parties in exotic locations.",
            min_price=50000.0,
            image_url="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop"
        ),
        models.ManagerProfile(
            user_id=bob.id,
            business_name="Corporate Edge Events",
            event_types="Corporate, Office Event",
            description="Professional enterprise event managers covering everything from annual galas to team building retreats.",
            min_price=150000.0,
            image_url="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop"
        )
    ]
    
    db.bulk_save_objects(profiles)
    db.commit()
    db.close()
    print("Database seeded with managers successfully!")

if __name__ == "__main__":
    seed()
