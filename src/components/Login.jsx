// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * 
   * testing in the login files
   */
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/auth/login?username=${username}&password=${password}`, {
        method: "POST",
        credentials: "include"
      });

      if (res.ok) {
        onLoginSuccess()
        navigate("/users"); // redirect after login
        console.log("result is ok")
      } else {
        const msg = await res.text();
        setError(msg);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label><br/>
          <input value={username} onChange={e => setUsername(e.target.value)} required/>
        </div>
        <div>
          <label>Password:</label><br/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ marginTop: "10px" }}>Login</button>
      </form>
    </div>
  );
};

export default Login;

