import { useEffect, useState, useRef } from "react";
import WebCam from "react-webcam";
import axios from "../utils/axios.js";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx"

const InterviewStartPage = () => {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [answer, setAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  // --- NATIVE SPEECH RECOGNITION STATE ---
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) {
      toast.error("Your browser does not support speech recognition");
      return;
    }

    const recognition = new Speech();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);


  // Fetching questions:
  const startInterview = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    // Clearing the prior runs:
    setSessionId(null);
    setResults([]);
    setCurrentIndex(0);
    setAnswer("");
    setTranscript(""); // Replaced resetTranscript()
    try {
      setGenerating(true);
      const res = await axios.post("/interview/start", { topic });
      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions);
    } catch (error) {
      toast.error("Failed to load questions");
      return;
    } finally {
      setGenerating(false);
    }
  };

  // --- NATIVE HANDLERS ---
  const handleStart = () => {
    setTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (err) {
        console.error("Mic already started", err);
      }
    }
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
    setAnswer(transcript);
  };

  // Sending answer to backend for evaluation:
  const submitAnswer = async () => {
    const questionText = questions[currentIndex];
    // Allow submission if there's either typed text or a pending transcript
    if (!answer.trim() && !transcript.trim()) {
      toast.error("Please speak or type your answer");
      return;
    }
    
    // Auto-stop listening if they hit submit while mic is still hot
    if (listening) {
      handleStop();
    }

    // Use transcript directly if answer is empty but they were speaking
    const finalAnswer = answer.trim() || transcript.trim();

    setEvaluating(true);
    try {
      const res = await axios.post("/interview/submit-answer", {
        sessionId,
        question: questionText,
        answer: finalAnswer
      });

      setResults(prev => [...prev, { question: questionText, answer: finalAnswer, ...res.data }]);
      toast.success("Answer evaluated!");

      // Prepare next question
      setAnswer("");
      setTranscript("");
      setCurrentIndex(i => i + 1);
    } catch (error) {
      toast.error("Evaluation failed.");
    } finally {
      setEvaluating(false);
    }
  };

  // --- RENDER HELPERS ---

  // 1. Completion View
  const renderCompletion = () => (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-slate-100">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
          <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Interview Completed!</h2>
        <p className="text-slate-500 mb-8">Thank you for participating. Your responses have been recorded and evaluated.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(`/session/${sessionId}`)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
          >
            View Summary
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // 2. Setup/Start View
  const renderSetup = () => (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Start New Interview</h1>
        <p className="text-sm text-slate-500 mb-6">Enter a topic below and our AI will generate targeted questions for you.</p>

        <div className="text-left space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="topic">
              Interview Topic
            </label>
            <input
              id="topic"
              type="text"
              placeholder="e.g. Data Structures, React.js"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button
            onClick={startInterview}
            disabled={generating}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 shadow-md transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {generating ? <span className="loading loading-spinner loading-md"></span> : "Generate Questions"}
          </button>
        </div>
      </div>
    </div>
  );

  // 3. Active Interview View
  const renderActiveInterview = () => {
    const currentQuestion = questions[currentIndex];
    const progressPercentage = ((currentIndex) / questions.length) * 100;

    return (
      <div className="flex-grow max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col">
        
        {/* Header & Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                Prep.AI
              </h1>
              <p className="text-slate-500 font-medium">Mock Interview in progress</p>
            </div>
            <span className="text-sm font-bold text-slate-700">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 leading-relaxed">
            {currentQuestion}
          </h2>
        </div>

        {/* Camera & Controls Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Main Answer Area (Spans 2 cols on large screens) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-700">Your Answer</h3>
              
              {/* Mic Controls */}
              <div className="flex space-x-2">
                {!listening ? (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Start Speaking
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-full text-sm font-medium animate-pulse"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    Listening... (Click to Stop)
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={listening ? transcript : answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Speak your answer, or type it here..."
              className="w-full flex-grow min-h-[150px] p-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            />
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={submitAnswer}
                disabled={evaluating || (!answer.trim() && !transcript.trim())}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 flex items-center"
              >
                {evaluating ? <span className="loading loading-spinner loading-md"></span> : "Submit Answer"}
              </button>
            </div>
          </div>

          {/* Webcam Panel */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <span className="font-semibold text-slate-700 text-sm">Webcam Setup</span>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={cameraEnabled} onChange={() => setCameraEnabled(!cameraEnabled)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${cameraEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${cameraEnabled ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="w-full aspect-video bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
              {cameraEnabled ? (
                <WebCam className="w-full h-full object-cover" mirrored={true} />
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium">Camera Disabled</span>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      {/* State Machine for Views */}
      {questions.length > 0 && currentIndex >= questions.length 
        ? renderCompletion() 
        : !questions.length 
          ? renderSetup() 
          : renderActiveInterview()
      }
    </div>
  );
};

export default InterviewStartPage;