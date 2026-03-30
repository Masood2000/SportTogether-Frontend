// src/components/UserCard.jsx
import React from "react";

const UserCard = ({ user }) => {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "12px",
      maxWidth: "300px",
      boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h3>{user.name} ({user.username})</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <p><strong>Height:</strong> {user.height} cm</p>
      <p><strong>Weight:</strong> {user.weight} kg</p>
      <p><strong>Sex:</strong> {user.sex}</p>
      <p><strong>Fitness Level:</strong> {user.fitnessLevel}</p>
      <p><strong>Sports:</strong> {user.sportPreferences.join(", ")}</p>
      <p><strong>Goals:</strong> {user.personalGoals}</p>
    </div>
  );
};

export default UserCard;