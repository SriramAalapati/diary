import React, { Children, createContext, useContext, useState } from "react";
import apiCaller from "/src/utils/apiCaller";

const UserContext = createContext();
const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(false)

  async function fetchUser() {
    setLoading(true)
    try {
      const response = await apiCaller("/auth/verifyToken", "POST");
      if (response.status == "Success") {
        setUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }

  return <UserContext.Provider value={{user,setUser}}>
    {children}
  </UserContext.Provider>;
};

export default UserProvider
export const useUser =()=> useContext(UserContext)
