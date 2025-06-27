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

  console.log(sessions);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Create and start your AI Mock Interview
            </p>
          </div>
          <Link to="/interview/start">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              + Add New
            </button>
          </Link>
        </div>

        {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Filter by keyword"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />

          </div>

        <div className="flex justify-between">
          {loading ? (
          <progress className="progress w-56"></progress>
        ) : filteredSessions.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {filteredSessions.map((session) => (
              <InterviewCard
                key={session._id}
                session={session}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No sessions found.</p>
        )}
          <calendar-date class="cally bg-base-100 border border-base-300 shadow-lg rounded-box">
            <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
            <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
            <calendar-month></calendar-month>
          </calendar-date>
        </div>
      </div>
    </div>
  );
};
 
export default DashboardPage;