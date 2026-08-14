import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios.js"
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const Signup = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (formData.password.length < 6) {
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
                    <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
                    <p className="text-sm text-slate-500 mt-2">Start your mock interview journey today.</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

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
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
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
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        />
                        <p className="text-xs text-slate-500 mt-1.5 ml-1">Must be at least 6 characters.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-2"
                    >
                        {isLoggingIn ? (
                            <span className="loading loading-spinner loading-md"></span>
                        ) : (
                            "Sign up"
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Signup;