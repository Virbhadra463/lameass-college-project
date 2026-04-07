from pydantic import BaseModel
from typing import Optional, List

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

    class Config:
        from_attributes = True
