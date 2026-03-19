from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from database import SessionLocal, Order, Stock, init_db
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
# import asyncio  # 引入非同步工具

app = FastAPI()

# CORS 全開
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 啟動時自動初始化資料庫 (練習用，正式環境通常用 Alembic)
init_db()

class LoginRequest(BaseModel):
    username: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 確認健康度
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# 看庫存
@app.get("/stocks")
def get_stocks(db: Session = Depends(get_db)):
    return db.query(Stock).all()

# 送出訂單
@app.post("/orders")
def create_order(stock_id: int, amount: int, user_id: int, db: Session = Depends(get_db)):
    # 測試併發問題，故意加個延遲
    # await asyncio.sleep(2)

    # 1. 開啟交易 (Transaction)
    # 使用 with_for_update() 實作悲觀鎖，防止併發導致的庫存計算錯誤
    stock_item = db.query(Stock).filter(Stock.id == stock_id).with_for_update().first()
    
    if not stock_item:
        raise HTTPException(status_code=404, detail="商品不存在")
    
    if stock_item.quantity < amount:
        raise HTTPException(status_code=400, detail="庫存不足")
    
    # 2. 扣庫存
    stock_item.quantity -= amount
    
    # 3. 產生訂單紀錄
    new_order = Order(user_id=user_id, stock_id=stock_id, amount=amount)
    db.add(new_order)
    
    # 4. 提交交易 (這時才會真正釋放資料庫鎖)
    db.commit()
    return {"status": "success", "remaining_stock": stock_item.quantity}