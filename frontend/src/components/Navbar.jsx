import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

const Navbar = () =>{

    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async() => {
        await logout();
        navigate("/login");
    }

    return(
        <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <div className="font-bold text-2xl text-violet-700"><span className="text-transparent bg-clip-text bg-gradient-to-b from-pink-500 from 30% to-indigo-400 to-70%">Prep.AI</span></div>
        <ul className="flex space-x-4 text-sm">
        <li><Link to="/dashboard" className="font-semibold text-blue-600">Dashboard</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><button
            onClick={handleLogout}
            className="hover:underline focus:outline-none"
          >
            Logout
          </button></li>
        </ul>
        </nav>
    );
};

export default Navbar;