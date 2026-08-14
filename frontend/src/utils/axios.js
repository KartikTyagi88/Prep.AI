import axios from "axios";

const instance = axios.create({
    baseURL: "https://prep-ai-1qnq.onrender.com",
    withCredentials: true, 
});

export default instance;