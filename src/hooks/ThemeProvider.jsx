import {  createContext, useContext, useState } from "react";
import React from "react";
const ThemeContext = createContext()
const ThemeProvider = ({Children}) => {
  const [theme, setTheme] = useState("light");
  function setThemeColor(themes) {
    setTheme(themes);
    console.log(themes);
  }
  return (
    <ThemeContext.Provider value={{theme, setThemeColor}}>
        {Children}
    </ThemeContext.Provider>
  );
};

const useTheme = ()=>{
    return useContext(ThemeProvider);
}
export  {ThemeProvider,useTheme}