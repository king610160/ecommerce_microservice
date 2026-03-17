from database import SessionLocal, User, init_db

def seed_data():
    init_db()  # 確保表已建立
    db = SessionLocal()
    # 檢查是否已有資料，避免重複插入
    if not db.query(User).filter(User.username == "cathy").first():
        cathy_user = User(
            username="cathy", 
            password="cathy123", 
            email="cathy@gmail.com"
        )
        db.add(cathy_user)
        db.commit()
        print("Seed data inserted successfully!")
    else:
        print("Seed data already exists.")

    db.close()


if __name__ == "__main__":
    seed_data()