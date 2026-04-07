from database import engine, SessionLocal
import models

def seed_indian_planners():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ── Delete ALL existing managers and their profiles ──
    db.query(models.ManagerProfile).delete()
    db.query(models.User).filter(models.User.role == "manager").delete()
    db.commit()
    print("Cleared all existing event planners.")

    # ── Indian Event Planners Data ──
    planners = [
        # ─── Birthday Party Planners ───
        {
            "full_name": "Priya Sharma",
            "email": "priya.sharma@eventify.in",
            "business_name": "Celebration Station",
            "event_types": "Birthday, Kids Party",
            "description": "From themed kids' birthday bashes to milestone celebrations for adults — we bring the sparkle, confetti, and magic to every birthday in Delhi NCR.",
            "min_price": 15000.0,
            "image_url": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop"
        },
        {
            "full_name": "Arjun Mehta",
            "email": "arjun.mehta@eventify.in",
            "business_name": "Party Wallah",
            "event_types": "Birthday, Party",
            "description": "Mumbai's favourite party creators. We design immersive birthday experiences — balloons, DJ setups, photobooth, catering, and everything in between.",
            "min_price": 25000.0,
            "image_url": "https://images.unsplash.com/photo-1464349153159-c9fcbff93900?w=800&auto=format&fit=crop"
        },
        {
            "full_name": "Sneha Reddy",
            "email": "sneha.reddy@eventify.in",
            "business_name": "Little Star Events",
            "event_types": "Birthday, Kids Party",
            "description": "Hyderabad-based children's birthday specialists. From unicorn themes to superhero adventures — your child's dream party, perfectly executed.",
            "min_price": 12000.0,
            "image_url": "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?w=800&auto=format&fit=crop"
        },

        # ─── Wedding Planners ───
        {
            "full_name": "Rohit Kapoor",
            "email": "rohit.kapoor@eventify.in",
            "business_name": "Royal Shaadi Planners",
            "event_types": "Wedding, Reception",
            "description": "Crafting grand Indian weddings across Jaipur, Udaipur, and Goa. From intimate ceremonies to 1000+ guest celebrations with royal Rajasthani elegance.",
            "min_price": 200000.0,
            "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop"
        },
        {
            "full_name": "Ananya Iyer",
            "email": "ananya.iyer@eventify.in",
            "business_name": "Mangalya Weddings",
            "event_types": "Wedding, Reception",
            "description": "South Indian wedding specialists based in Chennai. We blend traditional rituals with contemporary décor — mandap design, florals, and complete coordination.",
            "min_price": 150000.0,
            "image_url": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop"
        },
        {
            "full_name": "Kavita Singh",
            "email": "kavita.singh@eventify.in",
            "business_name": "Dream Dulhan Events",
            "event_types": "Wedding, Engagement",
            "description": "Delhi's most sought-after wedding planners. We handle everything from mehndi and sangeet to the grand reception — making your big day absolutely seamless.",
            "min_price": 300000.0,
            "image_url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop"
        },

        # ─── Reception / Sangeet Planners ───
        {
            "full_name": "Vikram Desai",
            "email": "vikram.desai@eventify.in",
            "business_name": "Grand Gala Events",
            "event_types": "Reception, Sangeet, Party",
            "description": "Pune-based reception and sangeet experts. DJ nights, choreographed sangeet performances, luxury venue styling — we make your after-party legendary.",
            "min_price": 75000.0,
            "image_url": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop"
        },
        {
            "full_name": "Meera Joshi",
            "email": "meera.joshi@eventify.in",
            "business_name": "Jashn Celebrations",
            "event_types": "Reception, Wedding, Sangeet",
            "description": "From floral arches to LED dance floors — we create mesmerizing reception setups in Bangalore. Known for our attention to detail and stunning décor.",
            "min_price": 100000.0,
            "image_url": "https://images.unsplash.com/photo-1478146059778-acee2dc66787?w=800&auto=format&fit=crop"
        },

        # ─── Corporate / Office Event Planners ───
        {
            "full_name": "Aditya Nair",
            "email": "aditya.nair@eventify.in",
            "business_name": "Corporate Edge India",
            "event_types": "Corporate, Office Event, Conference",
            "description": "India's leading corporate event agency. Annual days, product launches, team building workshops, and executive retreats across Mumbai, Delhi & Bangalore.",
            "min_price": 50000.0,
            "image_url": "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop"
        },
        {
            "full_name": "Nisha Gupta",
            "email": "nisha.gupta@eventify.in",
            "business_name": "Officela Events",
            "event_types": "Corporate, Office Event",
            "description": "Gurgaon-based startup and corporate event specialists. From hackathons and town halls to annual awards nights — we keep your team culture thriving.",
            "min_price": 35000.0,
            "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop"
        },
        {
            "full_name": "Rahul Verma",
            "email": "rahul.verma@eventify.in",
            "business_name": "BizFest Planners",
            "event_types": "Corporate, Conference, Exhibition",
            "description": "Pan-India corporate event management — conferences, expos, product launches. Full AV production, staging, hospitality, and end-to-end logistics.",
            "min_price": 100000.0,
            "image_url": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop"
        },

        # ─── Multi-category / All-rounder Planners ───
        {
            "full_name": "Deepika Patel",
            "email": "deepika.patel@eventify.in",
            "business_name": "Utsav Events Co.",
            "event_types": "Wedding, Birthday, Corporate, Reception",
            "description": "Ahmedabad's all-in-one event house. Whether it's a Gujarati wedding, a 50th birthday, or a corporate gala — Utsav handles it all with warmth and flair.",
            "min_price": 40000.0,
            "image_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop"
        },
    ]

    for p in planners:
        user = models.User(
            full_name=p["full_name"],
            email=p["email"],
            password="pass",
            role="manager"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        profile = models.ManagerProfile(
            user_id=user.id,
            business_name=p["business_name"],
            event_types=p["event_types"],
            description=p["description"],
            min_price=p["min_price"],
            image_url=p["image_url"]
        )
        db.add(profile)

    db.commit()
    db.close()
    print(f"Successfully seeded {len(planners)} Indian event planners!")

if __name__ == "__main__":
    seed_indian_planners()
