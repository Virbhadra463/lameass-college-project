from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="client") 
    
    manager_profile = relationship("ManagerProfile", back_populates="user", uselist=False)
    requests = relationship("EventRequest", foreign_keys="[EventRequest.client_id]", back_populates="client")

class ManagerProfile(Base):
    __tablename__ = "manager_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    business_name = Column(String, index=True)
    event_types = Column(String) 
    description = Column(String)
    min_price = Column(Float)
    image_url = Column(String)

    user = relationship("User", back_populates="manager_profile")

class EventRequest(Base):
    __tablename__ = "event_requests"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("users.id")) 
    event_type = Column(String)
    date = Column(String)
    budget = Column(Float)
    special_requirements = Column(String)
    status = Column(String, default="Pending")
    
    client = relationship("User", foreign_keys=[client_id], back_populates="requests")
