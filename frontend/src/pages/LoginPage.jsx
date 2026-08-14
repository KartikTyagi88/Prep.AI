import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios.js";
import { useAuth } from "../context/authContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    try {
      const res = await axios.post("/auth/login", formData);
      setUser(res.data);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      setError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
        
        {/* Header & Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
              Prep.AI
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-2">Please enter your details to sign in.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Styled Error Message Box */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoggingIn ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-500 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Login;