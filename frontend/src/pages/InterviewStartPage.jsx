import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
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

  //Speech to text hooks:
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser does not support speech recognition");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [listening]);


  //Fetching questions:
  const startInterview = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    //Clearing the prior runs:
    setSessionId(null);
    setResults([]);
    setCurrentIndex(0);
    setAnswer("");
    resetTranscript();
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

  //Handlers to start and stop speech recognition:
  const handleStart = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };
  const handleStop = () => {
    SpeechRecognition.stopListening();
    setAnswer(transcript);
  };

  //Sending answer to backend for evaluation:
  const submitAnswer = async () => {
    const questionText = questions[currentIndex];
    if (!answer.trim()) {
      toast.error("Please speak or type your answer");
      return;
    }

    setEvaluating(true);
    try {
      const res = await axios.post("/interview/submit-answer", {
        sessionId,
        question: questionText,
        answer
      });

      setResults(prev => [...prev, { question: questionText, answer, ...res.data }]);
      toast.success("Answer evaluated!");

      //Prepare next question
      setAnswer("");
      resetTranscript();
      setCurrentIndex(i => i + 1);
    } catch (error) {
      toast.error("Evaluation failed.");
    } finally {
      setEvaluating(false);
    }
  };


  //After finishing all questions, show summary:
  if (questions.length && currentIndex >= questions.length) {
    return (
      <div className="bg-slate-800 h-screen">
        <Navbar />
        <div className="bg-linear-to-r/longer from-indigo-500 to-teal-400 h-2 mt-2"></div>
        <div className="bg-linear-to-r/longer from-indigo-500 to-teal-400 h-2 mt-2"></div>
        <div className="bg-linear-to-r/longer from-indigo-500 to-teal-400 h-2 mt-2"></div>
        <div className="p-6 text-center mt-30 ">
          <h2 className="text-4xl text-gray-200 font-bold mb-4">Interview Completed! Thankyou For Participating...</h2>
          <div className="flex justify-evenly">
            <button
              onClick={() => navigate(`/session/${sessionId}`)}
              className="font-bold mt-6 bg-linear-to-bl from-violet-500 to-fuchsia-500 text-white px-4 py-2 rounded"
            >
              View Summary
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="font-bold mt-6 bg-linear-to-t from-sky-500 to-indigo-500 text-white px-4 py-2 rounded"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      
        <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Start New Interview</h1>

          <input
            type="text"
            placeholder="Enter topic (e.g. Data Structures)"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="mb-4 w-full max-w-md p-2 border rounded"
          />
          <button
            onClick={startInterview}
            disabled={generating}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            {generating ? (<span className="loading loading-bars loading-md"></span>) : "Generate Questions"}

          </button>
        </div>
    );
  }

  //Question answering view:
  const currentQuestion = questions[currentIndex];
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-0.5">Mock Interview</h1>
      <h1 className="mb-4 text-transparent text-3xl font-semibold bg-clip-text bg-gradient-to-b from-pink-500 from 30% to-indigo-400 to-70%">Prep.AI</h1>
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg shadow-xl bg-cyan-50 p-2 rounded-2xl ">
          Question {currentIndex + 1}/{questions.length}: {currentQuestion}
        </p>
        <div className="ml-3">
          <button
            onClick={() => setCameraEnabled(c => !c)}
            className="text-xs bg-indigo-600 text-white font-semibold p-1 hover:bg-indigo-700 rounded-lg max-w-20"
          >
            {cameraEnabled ? "Hide Camera" : "Show Camera"}
          </button>
        </div>
      </div>

      {cameraEnabled && (
        <div className="mb-4 w-64 mx-auto">
          <WebCam className="rounded" />
        </div>
      )}

      <div className="mb-4 space-x-2">
        <button
          onClick={handleStart}
          disabled={listening}
          className="bg-green-600 text-white px-4 py-1 rounded-2xl"
        >
          {listening ? "Listening…" : "Start Speaking"}
        </button>
        <button
          onClick={handleStop}
          className="bg-red-600 text-white px-4 py-1 rounded-2xl"
        >
          Stop
        </button>
      </div>

      <textarea
        value={listening ? transcript : answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Your answer will appear here..."
        rows="4"
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={submitAnswer}
        disabled={evaluating}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        {evaluating ? (<span className="loading loading-bars loading-md"></span>) : "Submit Answer"}
      </button>
    </div>
  );
};

export default InterviewStartPage;