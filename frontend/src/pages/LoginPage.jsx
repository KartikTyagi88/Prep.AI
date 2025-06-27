import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import {useAuth} from "../context/authContext.jsx";
import toast from "react-hot-toast";

const Login = () =>{
    const {setUser} = useAuth();
    const navigate = useNavigate();

    const [formData , setFormData] = useState({
        email: "",
        password: "" 
    });

    const [error, setError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleChange = e => {
        setFormData(prev => ({...prev , [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setIsLoggingIn(true);
        try {
            const res = await axios.post("/auth/login" , formData);
            setUser(res.data);
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            const msg = error.response?.data?.message || "Login failed";
            toast.error(msg);
            setError(msg);
        } finally{
          setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
        />

        <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            {isLoggingIn ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 underline">
            Signup
          </a>
        </p>
        </div>
        </div>
    );
};

export default Login;