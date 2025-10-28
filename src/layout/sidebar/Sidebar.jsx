import React from "react";
import { links } from "./constants/sidebarLinks";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="h-screen w-64 bg-white/60 backdrop-blur-lg border-r border-gray-200 flex flex-col justify-between shadow-md">
      {/* Logo / Header */}
      <div>
        <h1 className="text-center text-xl font-semibold text-gray-800 py-4 border-b border-gray-200 select-none tracking-tight">
          Diary
        </h1>

        {/* Navigation Links */}
        <nav className="mt-2 flex flex-col gap-0.5 px-2 overflow-y-auto h-[calc(100vh-112px)]">
          {links.map((item, index) => {
            const isActive = location.pathname === item.link;
            return (
              <button
                key={index}
                onClick={() => navigate(item.link)}
                className={`relative flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 text-md font-medium transition-all duration-200 
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-r-lg"></span>
                )}
                <i className={`fa-solid ${item.icon}  opacity-70`}></i>
                <span>{item.text}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="text-center py-3 text-sm text-gray-700 border-t border-gray-300">
        &copy; {new Date().getFullYear()} Personal Diary  
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
