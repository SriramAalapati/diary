import React from "react";
import { useUser } from "../../hooks/UserContext";
import { useNavigate } from "react-router-dom";
import apiCaller from "/src/utils/apiCaller";

const Topbar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
       
        setUser(null);
        navigate("/login");
      
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left - App Title */}
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-tight select-none">
          {/* Personal Diary */}
        </h1>

        {/* Right - User Info */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-800">{user?.name || "User"}</span>
            <span className="text-xs text-gray-500">{user?.email || "user@email.com"}</span>
          </div>

          <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold shadow-sm">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          <button
            onClick={handleLogout}
            className="text-sm font-medium px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Topbar);
