import { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import { useAuth } from "../context/authContext.jsx";
import Navbar from "../components/Navbar.jsx";
import InterviewCard from "../components/InterviewCard.jsx";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { parseISO, isAfter, isBefore, isEqual } from "date-fns";
import "cally";

const DashboardPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios.get("/interview/history")
      .then(res => setSessions(res.data.session))
      .catch(() => {
        toast.error("Failed to fetch sessions");
        setSessions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!user) return <Navigate to="/login" />;

  //Filtering:
  const filteredSessions = sessions.filter((session) => {
    const keyword = filterText.toLowerCase();
    const questionMatch = session.topic.toLowerCase().includes(keyword) || session.questions.some(q => q.toLowerCase().includes(keyword));

    const createdAt = parseISO(session.createdAt);

    const dateMatch =
      (!startDate || isAfter(createdAt, parseISO(startDate)) || isEqual(createdAt, parseISO(startDate))) &&
      (!endDate || isBefore(createdAt, parseISO(endDate)) || isEqual(createdAt, parseISO(endDate)));

    return questionMatch && dateMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <Navbar />
      
      <div className="p-4 sm:p-6 max-w-7xl mx-auto mt-4">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-1 font-medium">
              Review past sessions or start a new mock interview.
            </p>
          </div>
          <Link to="/interview/start">
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Interview
            </button>
          </Link>
        </div>

        {/* Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Filters & Cards */}
          <div className="flex-1 space-y-6">
            
            {/* Filter Control Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Filter by keyword or topic..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 hidden md:block">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 hidden md:block">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="min-h-[300px]">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <span className="loading loading-spinner text-blue-600 loading-lg"></span>
                </div>
              ) : filteredSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredSessions.map((session) => (
                    <InterviewCard
                      key={session._id}
                      session={session}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-300 text-center">
                  <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-slate-900">No sessions found</h3>
                  <p className="text-slate-500 mt-1">Try adjusting your filters or start a new interview.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar (Calendar) */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 sticky top-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Your Activity</h3>
              <calendar-date class="cally w-full bg-white rounded-lg">
                <svg aria-label="Previous" className="fill-current size-5 text-slate-600 hover:text-blue-600 transition-colors" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                </svg>
                <svg aria-label="Next" className="fill-current size-5 text-slate-600 hover:text-blue-600 transition-colors" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                </svg>
                <calendar-month className="text-slate-700"></calendar-month>
              </calendar-date>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;