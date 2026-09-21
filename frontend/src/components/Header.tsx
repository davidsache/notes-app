import { type WindowState } from '../interfaces/WindowState';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Search } from './Search';

import settingsB from '../assets/settings_b.svg';
import settingsW from '../assets/settings_w.svg';
import homeB from '../assets/home_b.svg';
import homeW from '../assets/home_w.svg';
import logoutB from '../assets/logout_b.svg';
import logoutW from '../assets/logout_w.svg';

interface HeaderProps {
  windowState: WindowState;
  makeNotesSearch: (searchText: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ windowState, makeNotesSearch }) => {
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

  const headerText = (): string => {
    switch (windowState.currentDashboardWindow) {
      case 'allNotes': return 'All notes';
      case 'archivedNotes': return 'Archived Notes';
      case 'settings': return 'Settings';
      default: return 'All notes';
    }
  }

  const changeCurrentWindow = () => {
    if (windowState.currentDashboardWindow === 'allNotes' || windowState.currentDashboardWindow === 'archivedNotes') {
      windowState.onWindowChange('settings');
    }
    else {
      windowState.onWindowChange('allNotes');
    }
  }

  return (
    <header className="h-16 border-b-2 border-slate-300 flex items-center px-6 flex-shrink-0 bg-gray-100 dark:bg-gray-900">
      <h1 className="font-bold text-xl">
        {headerText()}
      </h1>
      <div className="ml-auto">
        {windowState.currentDashboardWindow !== 'settings' && (
          <Search makeSearch={text => makeNotesSearch(text)}/>
        )}
        <button onClick={changeCurrentWindow}>
          <img 
            className="inline-block align-middle" 
            src={
              windowState.currentDashboardWindow === 'allNotes' || windowState.currentDashboardWindow === 'archivedNotes' 
              ? darkMode ? settingsW : settingsB 
              : darkMode ? homeW : homeB
            } 
            alt={
              windowState.currentDashboardWindow === 'allNotes' || 
              windowState.currentDashboardWindow === 'archivedNotes' ? 'Notes' : 'Settings'
            }
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