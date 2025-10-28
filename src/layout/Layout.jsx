import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";

const Layout = ({ children }) => {
  return (
    <div className="w-full h-screen flex bg-gray-50 text-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-1">{children}</main>
      </div>
    </div>
  );
};

export default React.memo(Layout);
