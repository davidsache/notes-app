import archiveW from '../../assets/archive_w.svg';
import archiveB from '../../assets/archive_b.svg';

import deleteW from '../../assets/delete_w.svg';
import deleteB from '../../assets/delete_b.svg';
import { useTheme } from '../../context/ThemeContext';

export const NoteActions = () => {
  const { darkMode } = useTheme();

  return (
    <div className="">
      <button className="border-2 rounded border-slate-200 p-2 hover:bg-slate-200 dark:hover:bg-slate-500">
        <img className="inline" src={darkMode ? archiveW : archiveB} alt="Archive note"/> Archive Note
      </button>
      <button className="border-2 rounded border-slate-200 p-2 my-2 hover:bg-slate-200 dark:hover:bg-slate-500">
        <img className="inline" src={darkMode ? deleteW : deleteB} alt="Delete note"/> Delete Note
      </button>
    </div>
  );
}