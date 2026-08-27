import { useNavigate } from "react-router-dom";
import { useNotes } from "../hooks/useNotes";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import loadingImgW from '../assets/loading-w.gif';
import loadingImgB from '../assets/loading-b.gif';

export const Notes: React.FC = () => {
  const { fetchNotes, notes, isLoading } = useNotes();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes])
  
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
        {isLoading ? <img className="w-8 mt-1" src={darkMode ? loadingImgW : loadingImgB} alt="Loading"/> :
          notes.map((note) => (
            <div key={note.id}>
              <h2>{note.title}</h2>
            </div>
          ))
        }
      </div>
      <div className="p-2 basis-64">

      </div>
    </div>
  );
}