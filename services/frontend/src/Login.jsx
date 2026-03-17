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
      // 這裡先寫死 localhost，之後上雲可以透過環境變數注入
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

  // console.log("目前的 API URL:", import.meta.env.VITE_LOGIN_URL);

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <h2>電商系統登入</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="帳號 (admin)" 
          value={username}
          onChange={e => setUsername(e.target.value)} 
        />
        <br/><br/>
        <input 
          type="password" 
          placeholder="密碼 (password123)" 
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