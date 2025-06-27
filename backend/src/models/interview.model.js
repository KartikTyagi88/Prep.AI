import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true 
    },
    
    answer: {
        type: String,
        required: true 
    },

    feedback: {
        type: String,
        required: true 
    },
    score: {
        type: Number
    },
    ideal: {
        type: String,
    }
}, {_id: false});

const SessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },

    topic: {
        type: String,
        require: true
    },

    questions: [
        {
            type: String,
            required: true 
        }
    ],

    answers: [AnswerSchema]
}, {timestamps: true});

export default mongoose.model("Session", SessionSchema);