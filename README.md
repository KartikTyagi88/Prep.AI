# AI Mock Interviewer

AI Mock Interviewer is a MERN stack web application that helps users prepare for interviews by simulating real-time mock sessions. It uses **Gemini 2.5 Flash** to generate intelligent, role-based questions and analyze user responses. With voice input via speech-to-text, users can experience a realistic interview environment and receive detailed feedback to improve their performance.

## 🚀 Features

- 🎤 **Real-Time Interview Simulation**: Enables camera and microphone for a real interview-like experience.
- 🧠 **AI-Generated Questions**: Gemini 2.5 Flash generates contextual questions based on selected topics.
- 📝 **Speech-to-Text**: Converts spoken responses into text during the session.
- 📊 **Performance Analysis**: Get AI-driven feedback and insights after each mock interview.
- 🗂️ **Session History**: Access and review past mock interview attempts.
- 🔒 **JWT Authentication**: Secure user login and registration system.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI**: Gemini 2.5 Flash API
- **Speech Recognition**: Web Speech API

## 📁 Project Structure
### ├── backend/
- │ ├── node_modules/
- │ ├── src/
- │ │ ├── controllers/
- │ │ ├── lib/
- │ │ ├── middlewares/
- │ │ ├── models/
- │ │ └── routes/
- │ │ └── index.js
- │ ├── .env
- │ ├── package.json
- │ └── package-lock.json
  
### ├── frontend/
 - │ ├── node_modules/
 - │ ├── public/
 - │ ├── src/
 - │ ├── eslint.config.js
 - │ ├── index.html
 - │ ├── package.json
 - │ ├── package-lock.json
 - │ └── vite.config.js
 - │
 - └── .gitignore

## .env FILE STRUCTURE
```js
MONGODB_URI=...
PORT=...
JWT_SECRET=...
GEMENI_API_KEY=...
```
