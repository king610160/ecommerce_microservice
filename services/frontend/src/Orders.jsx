import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Orders({ user }) {
  const [stocks, setStocks] = useState([]);
  const [amounts, setAmounts] = useState({}); // 紀錄每個商品想買的數量
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  // 取得庫存資料
  const fetchStocks = async () => {
    try {
      const res = await axios.get("/api/order/stocks");
      setStocks(res.data);
    } catch (err) {
      console.error("抓取庫存失敗", err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleAmountChange = (stockId, delta, maxQuantity) => {
    const currentAmount = amounts[stockId] || 0;
    const newAmount = Math.max(0, Math.min(maxQuantity, currentAmount + delta));
    setAmounts({ ...amounts, [stockId]: newAmount });
  };

  const handleOrder = async (stockId) => {
    const amount = amounts[stockId];
    if (!amount || amount <= 0) return;

    setIsProcessing(true);
    setMessage('');

    try {
      // 打後端下單 API
      await axios.post(`/api/order/orders?stock_id=${stockId}&amount=${amount}&user_id=${user.id}`);
      
      setMessage('交易成功！');
      setAmounts({ ...amounts, [stockId]: 0 }); // 重置該項目的輸入數量
      fetchStocks(); // 重新整理庫存
    } catch (err) {
      setMessage('交易失敗：' + (err.response?.data?.detail || '未知錯誤'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>商品庫存頁面</h2>
      
      {/* 交易成功或失敗的提示 */}
      {message && (
        <div style={{ padding: '10px', backgroundColor: '#e7f3ef', color: '#107c10', marginBottom: '10px' }}>
          {message}
        </div>
      )}

      {isProcessing && <p>交易處理中...</p>}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>商品</th>
            <th>價格</th>
            <th>剩餘庫存</th>
            <th>購買數量</th>
            <th>動作</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.name}</td>
              <td>${stock.price}</td>
              <td>{stock.quantity}</td>
              <td>
                <button onClick={() => handleAmountChange(stock.id, -1, stock.quantity)}>-</button>
                <span style={{ margin: '0 10px' }}>{amounts[stock.id] || 0}</span>
                <button onClick={() => handleAmountChange(stock.id, 1, stock.quantity)}>+</button>
              </td>
              <td>
                <button 
                  disabled={isProcessing || (amounts[stock.id] || 0) <= 0}
                  onClick={() => handleOrder(stock.id)}
                >
                  下單
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;