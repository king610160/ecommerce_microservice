from database import SessionLocal, Stock, init_db

def seed_data():
    init_db()  # 確保表已建立
    db = SessionLocal()

    # 增加庫存數量
    if not db.query(Stock).first():
        iphone = Stock(name="iPhone 15", price=30000, quantity=10)
        macbook = Stock(name="MacBook Pro", price=60000, quantity=5)
        db.add_all([iphone, macbook])
        db.commit()
        print("Stock seed data inserted!")
    db.close()


if __name__ == "__main__":
    seed_data()