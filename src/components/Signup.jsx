// src/components/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async e => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include"
      });

      if (res.ok) {
        navigate("/login");
      } else {
        const msg = await res.text();
        setError(msg);
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Username:</label><br/>
          <input name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label><br/>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label><br/>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Name:</label><br/>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ marginTop: "10px" }}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;