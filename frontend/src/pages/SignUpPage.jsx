import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js"
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const Signup = () => {
    const {setUser} = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password:""
    });

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleChange = e =>{
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if(formData.password.length < 6){
            toast.error("Password must be at least 6 characters long");
            return;
        }
        setIsLoggingIn(true);
        try {
            const res = await axios.post("/auth/signup", formData);
            setUser(res.data);
            toast.success("Signup successful!");
            navigate("/dashboard");
        } catch (error) {
            const msg = error.response?.data?.message || "Signup failed";
            toast.error(msg);
        } finally{
          setIsLoggingIn(false);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

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
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {isLoggingIn ? (
              <span className="loading loading-spinner loading-md"></span>
            ): (
              "Signup"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
        </div>
        </div>
    );
};

export default Signup;