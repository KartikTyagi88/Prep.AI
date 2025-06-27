import {format, parseISO, isValid} from "date-fns";
import { FaTrash, FaRegCopy, FaCog } from "react-icons/fa";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../utils/axios.js";

const InterviewCard = ({session}) => {

    const dateObj = session.createdAt ? parseISO(session.createdAt) : null;
    const handleDelete = async(e) => {
      e.stopPropagation();
      e.preventDefault();

      try {
        const res = await axios.delete(`/interview/session/${session._id}`);
        if(res.status == 200){
          toast.success("Session Deleted!")
        }
      } catch (error) {
        toast.error("Deletion Failed")
      }
    };
    
    return(
      <Link to={`/session/${session._id}`} className="block">
      <div className="rounded-b-2xl shadow-sm p-4 bg-slate-200 w-auto space-y-2 hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-black">{session.topic || "Interview"}</h3>
      <p className="text-sm text-violet-500">
        {session.answers?.length ?? 0} / {session.questions?.length ?? 0} answered
      </p>
      <p className="text-xs text-gray-500">
        {dateObj && isValid(dateObj) ? format(dateObj, "PPP p") : "-"}
      </p>
      <div className="flex justify-center ">
        <button onClick={handleDelete}><FaTrash className="text-red-500" /></button>
      </div>
    </div>
    </Link>
    );
};

export default InterviewCard;