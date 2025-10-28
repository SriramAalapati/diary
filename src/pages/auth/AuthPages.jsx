import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import apiCaller from "../../utils/apiCaller";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";

const AuthPages = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // ⬅️ For backend errors
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setApiError(""); // clear backend error on change
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!isLogin && !formData.name.trim()) newErrors.name = "Full name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setApiError("");
    try {
      setLoading(true);
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await apiCaller(endpoint, formData, "POST");
      if (response.status === "Success") {
        console.log(response.data.user," -------In Login------------")
        setUser(response.data.user);
        navigate("/dashboard");
      } else {
        // Backend returned failure
        setApiError(response.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      console.error(err);
      setApiError(
        err.response?.data?.message ||
        err.message ||
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) return;
    try {
      setLoading(true);
      const response = await apiCaller("/auth/forgot-password", { email: resetEmail }, "POST");
      if (response.status === "Success") {
        alert("Reset link sent to your email!");
        setForgotPassword(false);
      } else {
        setApiError(response.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        {forgotPassword ? (
          // ==================== FORGOT PASSWORD =====================
          <div>
            <button
              onClick={() => setForgotPassword(false)}
              className="flex items-center text-gray-600 dark:text-gray-400 mb-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>

            <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-2">
              Reset Password
            </h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Enter your registered email to receive a reset link
            </p>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-transparent text-gray-900 dark:text-gray-100"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <button
              onClick={handleForgotPassword}
              className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-500 transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <AnimatePresence>
              {apiError && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-center text-sm text-rose-500 flex items-center justify-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" /> {apiError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // ==================== LOGIN / REGISTER =====================
          <>
            <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-2">
              {isLogin ? "Sign In to Continue" : "Create Your Account"}
            </h1>
            <p className="text-center text-gray-500 text-sm mb-8">
              {isLogin
                ? "Access your dashboard, notes, and financial insights"
                : "Join us and start organizing your productivity"}
            </p>

            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      className="pl-10 p-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-transparent text-gray-900 dark:text-gray-100"
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-rose-500 mt-1">{errors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="pl-10 p-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-transparent text-gray-900 dark:text-gray-100"
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-rose-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="pl-10 p-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-transparent text-gray-900 dark:text-gray-100"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-rose-500 mt-1">{errors.password}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg font-medium 
                hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
              >
                {loading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating..."
                  : isLogin
                  ? "Sign In"
                  : "Register"}
              </button>

              {/* 🔥 Backend error message */}
              <AnimatePresence>
                {apiError && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-center text-sm text-rose-500 flex items-center justify-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" /> {apiError}
                  </motion.p>
                )}
              </AnimatePresence>

              {isLogin && (
                <div className="text-right mt-2">
                  <button
                    onClick={() => setForgotPassword(true)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <p className="text-center text-sm text-gray-500 mt-6">
                {isLogin ? (
                  <>
                    Don’t have an account?{" "}
                    <span
                      className="text-indigo-600 cursor-pointer hover:underline"
                      onClick={() => navigate("/register")}
                    >
                      Register
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <span
                      className="text-indigo-600 cursor-pointer hover:underline"
                      onClick={() => navigate("/login")}
                    >
                      Sign In
                    </span>
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPages;
