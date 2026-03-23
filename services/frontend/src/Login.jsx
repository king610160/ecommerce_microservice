import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 用 nginx 的方式導出至對應路由
      const response = await axios.post("/api/auth/login", {
        username: username,
        password: password
      });

      if (response.data.status === 'success') {
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || '登入失敗，請檢查網路或帳密');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <h2>系統登入頁面</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="帳號 (account)" 
          value={username}
          onChange={e => setUsername(e.target.value)} 
        />
        <br/><br/>
        <input 
          type="password" 
          placeholder="密碼 (password)" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
        />
        <br/><br/>
        <button type="submit">登入</button>
      </form>
    </div>
  );
}

export default Login;