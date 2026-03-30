import React ,{ useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserList from "./components/UserList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // login state

  return (
   <Routes>
      {/* Redirect / to /users if logged in, otherwise /login */}
      <Route path="/" element={<Navigate to={isLoggedIn ? "/users" : "/login"} />} />

      {/* Login page */}
      <Route
        path="/login"
        element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
      />

      {/* Signup page */}
      <Route path="/signup" element={<Signup />} />

      {/* Users page - protected */}
      <Route
        path="/users"
        element={isLoggedIn ? <UserList /> : <Navigate to="/login" />}
      />
    </Routes>

  );
}

export default App;