from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ManagerProfileBase(BaseModel):
    business_name: str
    event_types: str
    description: str
    min_price: float
    image_url: str

class ManagerProfileResponse(ManagerProfileBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "client"
    manager_profile: Optional[ManagerProfileBase] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    manager_profile: Optional[ManagerProfileResponse] = None

    class Config:
        from_attributes = True

# Minimal user info embedded in event request responses
class UserBrief(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    manager_profile: Optional[ManagerProfileResponse] = None

    class Config:
        from_attributes = True

class EventRequestCreate(BaseModel):
    manager_id: int
    event_type: str
    date: str
    budget: float
    special_requirements: Optional[str] = None

class EventRequestResponse(BaseModel):
    id: int
    client_id: int
    manager_id: int
    event_type: str
    date: str
    budget: float
    special_requirements: Optional[str] = None
    status: str
    client: Optional[UserBrief] = None
    manager: Optional[UserBrief] = None

    class Config:
        from_attributes = True

# ── Chat Messages ──

class MessageCreate(BaseModel):
    event_request_id: int
    sender_id: int
    content: str

class MessageResponse(BaseModel):
    id: int
    event_request_id: int
    sender_id: int
    content: str
    timestamp: datetime
    sender: Optional[UserBrief] = None

    class Config:
        from_attributes = True
