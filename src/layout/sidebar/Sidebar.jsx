import React from "react";
import {links} from "./constants/sidebarLinks";

const Sidebar = () => {
  
  return (
    <div className="text-gray-100 bg-[#242346] hover:text-gray-50 w-full h-screen rounded-r-md shadow-md shadow-[#242346]">
      <div>
        <h1 className="text-center text-lg font-bold border-b uppercase select-none  ">DIARY</h1>
      </div>
      <div className="flex flex-col gap-1 ">
        {links.map((item, index) => (
          <div key={index} className="flex items-center gap-1 p-2 hover:bg-[#0f0f17] cursor-pointer  select-none" >
            <i className={item.icon}></i>
            <span className="text-lg capitalize ">{item.text}</span>
          </div>
        ))}
      </div>
    </div>  
  );
};

export default Sidebar;
