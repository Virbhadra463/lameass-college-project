from database import engine, SessionLocal
import models
import random

def add_ten_planners():
    first_names = ["Sarah", "Michael", "Emma", "David", "Jessica", "James", "Laura", "John", "Sophia", "Robert", "Olivia", "Daniel", "Chloe", "Matthew", "Grace"]
    last_names = ["Johnson", "Smith", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Lee", "Walker", "Hall", "Allen", "Young"]
    themes = ["Elegant", "Royal", "Urban", "Vintage", "Modern", "Classic", "Rustic", "Luxury", "Creative", "Bespoke", "Elite", "Grand"]
    event_focus = ["Weddings", "Corporate Events", "Birthdays", "Concerts", "Galas", "Festivals", "Exhibitions", "Parties", "Conferences", "Retreats"]
    images = [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop", # events
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop", # weddings
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop", # corporate
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop", # generic event
        "https://images.unsplash.com/photo-1533174000273-fa341dc1c251?w=800&auto=format&fit=crop"  # party style
    ]

    db = SessionLocal()
    
    users = []
    profiles = []
    
    for i in range(10):
        first = random.choice(first_names)
        last = random.choice(last_names)
        full_name = f"{first} {last}"
        email = f"{first.lower()}.{last.lower()}{random.randint(1000,9999)}@example.com"
        
        user = models.User(
            full_name=full_name,
            email=email,
            password="pass",
            role="manager"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        theme = random.choice(themes)
        focus = random.choice(event_focus)
        
        # Pick 1 to 3 event types
        possible_types = ["Wedding", "Birthday", "Corporate", "Concert", "Party", "Exhibition", "Retreat"]
        num_types = random.randint(1, 3)
        event_types = ", ".join(random.sample(possible_types, k=num_types))
        
        profile = models.ManagerProfile(
            user_id=user.id,
            business_name=f"{theme} {focus} Planners",
            event_types=event_types,
            description=f"Welcome to {theme} {focus} Planners. We specialize in creating unforgettable {focus.lower()}. Let us make your next event truly {theme.lower()}!",
            min_price=float(random.choice([5000, 10000, 20000, 50000, 75000, 100000, 150000])),
            image_url=random.choice(images)
        )
        profiles.append(profile)
        
    db.bulk_save_objects(profiles)
    db.commit()
    db.close()
    print("10 random event planners successfully added!")

if __name__ == "__main__":
    add_ten_planners()
