import { useTheme } from "../context/ThemeContext";

export const Settings: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="p-2">
      <div>
        <label className="inline-flex items-center me-5 cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" onChange={toggleTheme} checked={darkMode}/>
          <div className="relative w-9 h-5 bg-slate-500 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600 dark:peer-checked:bg-teal-600"></div>
          <span className="select-none ms-3 text-sm text-lg">Dark Mode</span>
        </label>
      </div>

    </div>
  );
}