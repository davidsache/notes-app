import { useNavigate } from "react-router-dom";

export const Notes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row h-screen justify-center">
      <div className="border-r-2 border-slate-300 p-2 basis-64">
        <button 
          onClick={() => navigate('/newNote')} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          + Create New note
        </button>
      </div>
      <div className="border-r-2 border-slate-300 p-2 basis-64">

      </div>
      <div className="p-2 basis-64">

      </div>
    </div>
  );
}