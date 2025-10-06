import React from "react";
import Sidebar from "./sidebar/Sidebar";
const Layout = ({ children }) => {
  return (
    <div className="w-full h-screen flex ">
      <div className="w-50">
        <Sidebar />
      </div>
      <div className="flex-1 p-2 overflow-y-aut">
        {children}
      </div>
    </div>
  );
};

export default Layout;
