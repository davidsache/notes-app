import settingsB from '../assets/settings_b.svg';
import settingsW from '../assets/settings_w.svg';
import allNotesB from '../assets/home_b.svg';
import allNotesW from '../assets/home_w.svg';
import logoutB from '../assets/logout_b.svg';
import logoutW from '../assets/logout_w.svg';
import { type WindowState } from '../interfaces/WindowState';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Header = ({ currentDashboardWindow, onWindowChange }: WindowState) => {
  const { logout } = useAuth();
  const { darkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    }
    catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="h-16 border-b-2 border-slate-300 flex items-center px-6 flex-shrink-0 bg-gray-100 dark:bg-gray-900">
      <h1 className="font-bold text-xl">
        {currentDashboardWindow === 'notes' ? 'All Notes' : 'Settings'}
      </h1>
      <div className="ml-auto">
        {currentDashboardWindow === 'notes' &&
          <input 
            className="border-2 w-64 h-8 me-2 rounded-md border-slate-300 bg-white dark:bg-gray-500" 
            type="text" 
            placeholder="Search by title, content, or tags..."
          />
        }

        <button onClick={() => onWindowChange(currentDashboardWindow === 'notes' ? 'settings' : 'notes')}>
          <img 
            className="inline-block align-middle" 
            src={currentDashboardWindow === 'notes' ? darkMode ? settingsW : settingsB : darkMode ? allNotesW : allNotesB} 
            alt={currentDashboardWindow === 'notes' ? 'Notes' : 'Settings'}
          />
        </button>

        <button onClick={handleLogout} className='ms-2'>
          <img 
            className="inline-block align-middle" 
            src={darkMode ? logoutW : logoutB} 
            alt="Log out"
          />
        </button>
      </div>
    </header>
  );
}