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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-6 w-full max-w-sm">

        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
          {user?.username?.charAt(0).toUpperCase()}
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">Welcome back</p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-1">
            Hello, {user?.username} 👋
          </h2>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-lg border border-red-400 text-red-500 font-medium hover:bg-red-500 hover:text-white transition-colors duration-200">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
