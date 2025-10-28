import React, {  createContext, useContext, useEffect, useMemo, useState } from "react";
import apiCaller from "/src/utils/apiCaller";
const UserContext = createContext();
const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true)

  async function fetchUser() {
    try {
      const response = await apiCaller("/auth/verifyToken");
      if (response.status == "Success") {
        setUser(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchUser()
  },[])
  console.log("UserContext rerendering")
  const value = useMemo(()=>({user,loading,setUser}),[user,loading])
  return <UserContext.Provider value={value}>
    {children}
  </UserContext.Provider>;
};

export default UserProvider
export const useUser =()=> useContext(UserContext)
