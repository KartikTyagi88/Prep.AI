import { useState, useEffect } from "react";
import axios from "../utils/axios.js";
import { useAuth } from "../context/authContext.jsx";
import Navbar from "../components/Navbar.jsx";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // State for updating name
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // State for Theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // State for deleting sessions
  const [isDeleting, setIsDeleting] = useState(false);

  // Apply Dark Mode class to HTML document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- HANDLERS ---

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Name cannot be empty");
    if (fullName === user.fullName) return toast.error("No changes made");

    setIsUpdatingName(true);
    try {
      // Assumes you create a PUT route like /auth/update-name in your backend
      const res = await axios.put("/auth/update-name", { fullName });
      setUser({ ...user, fullName: res.data.fullName });
      toast.success("Name updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleDeleteAllSessions = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL your mock interview sessions? This cannot be undone."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      // Assumes you create a DELETE route like /interview/history in your backend
      await axios.delete("/interview/history");
      toast.success("All sessions deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete sessions");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- TAB RENDERERS ---

  const renderProfileTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your public identity and account details.</p>
      </div>

      <div className="flex items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
        <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold uppercase shadow-sm">
          {user?.fullName?.charAt(0) || "U"}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Account Email</p>
          <p className="text-slate-900 dark:text-white font-semibold">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleUpdateName} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isUpdatingName || fullName === user?.fullName}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdatingName ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance</h2>
        <p className="text-sm text-slate-500 mt-1">Customize how Prep.AI looks on your device.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        {/* Light Theme Option */}
        <button
          onClick={() => setTheme("light")}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
            theme === "light"
              ? "border-blue-600 bg-blue-50/50"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <svg className={`w-8 h-8 mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className={`font-semibold ${theme === 'light' ? 'text-blue-700' : 'text-slate-600'}`}>Light Mode</span>
        </button>

        {/* Dark Theme Option */}
        <button
          onClick={() => setTheme("dark")}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
            theme === "dark"
              ? "border-blue-600 bg-slate-900"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <svg className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>Dark Mode</span>
        </button>
      </div>
    </div>
  );

  const renderDangerTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
        <p className="text-sm text-slate-500 mt-1">Irreversible and destructive actions.</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 sm:p-6 max-w-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-red-800">Clear Interview History</h3>
          <p className="text-sm text-red-600 mt-1">
            Permanently delete all your mock interview sessions, questions, and feedback. This action cannot be undone.
          </p>
        </div>
        <button
          onClick={handleDeleteAllSessions}
          disabled={isDeleting}
          className="shrink-0 bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete All Sessions"}
        </button>
      </div>
    </div>
  );

  // --- MAIN LAYOUT ---

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-12 transition-colors duration-200">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 mt-4">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your account preferences and data.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === "profile" 
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400" 
                    : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>

              <button
                onClick={() => setActiveTab("appearance")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === "appearance" 
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400" 
                  : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Appearance
              </button>

              <button
                onClick={() => setActiveTab("danger")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === "danger" 
                  ? "bg-white text-red-600 shadow-sm border border-red-100" 
                  : "text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Danger Zone
              </button>

            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 min-h-[400px]">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "appearance" && renderAppearanceTab()}
            {activeTab === "danger" && renderDangerTab()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;