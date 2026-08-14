import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";

export const SessionDetailPage = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/interview/session/${sessionId}`)
      .then(res => setSession(res.data.session))
      .catch(() => {
        toast.error("Failed to load session");
        navigate(-1);
      });
  }, [sessionId, navigate]);

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner text-blue-600 loading-lg"></span>
          <p className="text-slate-500 font-medium">Loading session details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-6"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {session.topic}
              </h1>
              <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(session.createdAt).toLocaleString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Questions</span>
              <p className="text-lg font-bold text-slate-800 text-right">{session.questions.length}</p>
            </div>
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-4">
          {session.questions.map((question, idx) => {
            const answerObj = session.answers.find(a => a.question === question);
            const isOpen = openIndex === idx;

            // Optional: Dynamic score coloring
            const scoreColor = answerObj?.score >= 8 
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
              : answerObj?.score >= 5 
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-red-100 text-red-800 border-red-200';

            return (
              <div 
                key={idx} 
                className={`bg-white rounded-xl border transition-all duration-200 ${isOpen ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200 shadow-sm hover:shadow-md'}`}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors rounded-xl focus:outline-none"
                >
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 text-lg pt-0.5">
                      {question}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-slate-400 transform transition-transform duration-300 mt-1 sm:mt-0 ${isOpen ? "rotate-180 text-blue-500" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-slate-100 space-y-6">
                      {answerObj ? (
                        <>
                          {/* User Answer & Score */}
                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Your Answer</span>
                              <div className={`px-3 py-1 rounded-full border text-sm font-bold flex items-center gap-1.5 ${scoreColor}`}>
                                Score: {answerObj.score} / 10
                              </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-700 leading-relaxed">
                              {answerObj.answer}
                            </div>
                          </div>

                          {/* AI Feedback */}
                          <div>
                            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 block">Feedback</span>
                            <p className="whitespace-pre-line text-slate-600 leading-relaxed">
                              {answerObj.feedback}
                            </p>
                          </div>

                          {/* Ideal Answer */}
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Ideal Answer Outline</span>
                            </div>
                            <p className="whitespace-pre-line text-emerald-700 leading-relaxed">
                              {answerObj.ideal}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="italic">No answer recorded for this question.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
};