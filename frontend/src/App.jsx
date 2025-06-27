import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import { SessionDetailPage } from "./pages/SessionDetailPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import InterviewStartPage from "./pages/InterviewStartPage";
import { useAuth } from "./context/authContext";

const App = () => {

  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/interview/start" element={user ? <InterviewStartPage /> : <Navigate to="/login" />} />
        <Route path="/session/:sessionId" element={user ? <SessionDetailPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;