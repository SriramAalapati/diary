import React, { useState } from "react";
import apiCaller from "../../utils/apiCaller";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setUser} = useUser()
  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Enter valid email";
    if (!formData.password.trim())
      newErrors.password = "Enter valid password";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }
  async function handleSubmit() {
    setErrors({});
    if (!validate()) return;
    try {
      setLoading(true);
      const response = await apiCaller("/auth/login", formData, "POST");
      if (response.status == "Success") {
        setUser(response.data);
        console.log("User foud successfully")
        navigate('/dashboard')
      }
    } catch (error) {
      setUser(null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-sm border px-2 py-8 rounded-xl ">
        <div>
          <h1 className="font-bold tracking-wider font-serif text-center text-xl mb-2 ">
            Login
          </h1>
        </div>
        <div className="flex flex-col space-y-2 p-2">
          <label htmlFor="email" className="text-md">
            Enter your email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="border text-md p-2 rounded-lg"
            placeholder="Enter your mail"
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2 p-2">
          <label htmlFor="password" className="text-md">
            Enter your password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            className="border text-md p-2 rounded-lg"
            placeholder="Enter your password"
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password}</p>
          )}
        </div>
        <div className="px-3  flex items-center space-x-1">
          <input
            type="checkbox"
            name="showpwd"
            id="showpwd"
            className="  border  "
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showpwd" className=" pb-1">
            show password
          </label>
        </div>
        <div className="p-2">
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-indigo-500 rounded-md text-white text-lg font-bold cursor-pointer hover:bg-indigo-400"
          >
            {loading ? " Logging in " : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
