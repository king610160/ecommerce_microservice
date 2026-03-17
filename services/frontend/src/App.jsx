import React, { useState } from 'react';
import Login from './Login';
import Orders from './Orders';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    
    <div className="App">
      {/* 如果登入了，在頁面頂端顯示一個簡單的登出按鈕 */}
      {isLoggedIn && (
        <div style={{ textAlign: 'right', padding: '10px', borderBottom: '1px solid #ccc' }}>
          <span>當前使用者: {user?.username} </span>
          <button onClick={handleLogout}>登出</button>
        </div>
      )}

      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Orders user={user} />
      )}
    </div>
  );
}

export default App;