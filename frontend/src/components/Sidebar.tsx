import logoHeader from '../assets/logo_header.png';
import allNotesB from '../assets/home_b.svg';
import allNotesW from '../assets/home_w.svg';
import archivedNotesB from '../assets/archive_b.svg';
import archivedNotesW from '../assets/archive_w.svg';
import { useTheme } from '../context/ThemeContext';

interface WindowView {
  changeNotesView: (newView: 'allNotes' | 'archivedNotes' | 'settings') => void;
}

export const Sidebar: React.FC<WindowView> = ({ changeNotesView }) => {
  const { darkMode } = useTheme();

  return (
    <aside className="w-64 h-full border-r-2 border-slate-300 bg-gray-100 dark:bg-gray-900">
      <img src={logoHeader} className="w-32 mt-4"/>
      <div className="mt-4 mx-4">
        <button 
          className="w-full text-left hover:bg-slate-200 dark:hover:bg-slate-500 rounded p-2"
          onClick={() => changeNotesView('allNotes')}
        >
          <img src={darkMode ? allNotesW : allNotesB} alt="All Notes" className="inline me-1"/>
          All Notes
        </button>
        <button 
          className="w-full text-left hover:bg-slate-200 dark:hover:bg-slate-500 rounded p-2"
          onClick={() => changeNotesView('archivedNotes')}
        >
          <img src={darkMode ? archivedNotesW : archivedNotesB} alt="Archived Notes" className="inline me-1"/>
          Archived Notes
        </button>
      </div>
      <hr className="m-2 border-t-2 border-slate-300"/>
      <div>
        <h3 className="ms-4 text-gray-500 font-bold">Tags</h3>
        
      </div>
    </aside>
  );
}