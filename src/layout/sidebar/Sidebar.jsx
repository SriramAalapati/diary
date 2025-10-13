import React from "react";
import {links} from "./constants/sidebarLinks";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate()
  
  return (
    <div className="text-gray-100 bg-[#242346] hover:text-gray-50 w-full h-screen rounded-r-md shadow-md shadow-[#242346]">
      <div>
        <h1 className="text-center text-lg font-bold border-b uppercase select-none  ">DIARY</h1>
      </div>
      <div className="flex flex-col gap-0.5 ">
        {links.map((item, index) => (
          <button onClick={()=>navigate(item.link)} key={index} className="flex items-center gap-1 p-2 hover:bg-[#0f0f17] cursor-pointer  select-none" >
            <i className={item.icon}></i>
            <span className="text-lg capitalize " >{item.text}</span>
          </button>
        ))}
      </div>
    </div>  
  );
};

export default Sidebar;
