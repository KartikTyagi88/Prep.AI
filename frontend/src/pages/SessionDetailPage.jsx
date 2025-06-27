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
      <div className="p-6 text-center">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold">{session.topic}</h1>
      <p className="text-sm text-gray-500">
        Started on {new Date(session.createdAt).toLocaleString()}
      </p>

      <div className="space-y-4">
        {session.questions.map((question, idx) => {
          const answerObj = session.answers.find(a => a.question === question);
          const isOpen = openIndex === idx;

          return (
            <div key={idx} className="shadow-lg rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4 bg-linear-65 from-purple-300 to-pink-300 flex justify-between items-center"
              >
                <span className="font-semibold text-gray-600">
                  Q{idx + 1}. {question}
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="p-4 space-y-3 bg-teal-50">
                  {answerObj ? (
                    <>
                      <p className="bg-red-200 hover:bg-red-300 rounded-2xl p-3">
                        <span className="font-medium">Your answer:</span> {answerObj.answer}
                      </p>
                      <p className="bg-cyan-100 hover:bg-cyan-200 rounded-2xl p-3">
                        <span className="font-medium">Score:</span> {answerObj.score} / 10
                      </p>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Feedback:</span>
                          <p className="whitespace-pre-line mt-1 text-gray-700">{answerObj.feedback}</p>
                        </div>
                        <div>
                          <span className="font-medium">Ideal answer:</span>
                          <p className="whitespace-pre-line mt-1 text-gray-700 bg-lime-100 rounded-2xl p-5 hover:bg-lime-200">
                            {answerObj.ideal}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="italic text-gray-500">No answer recorded.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

