import React from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Api.post("/auth/logout");
    setUser(null);
    navigate("/");
  };

  return (
    <div>
      <h2>Hello {user.username}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;