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
  onOpenSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ windowState, makeNotesSearch, onOpenSidebar }) => {
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
    <header className="border-b-2 border-slate-300 bg-gray-100 dark:bg-gray-900 px-3 py-2.5 sm:px-6 md:h-16 md:py-0 flex flex-col md:flex-row md:items-center justify-between gap-2.5 flex-shrink-0">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="md:hidden p-1.5 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold leading-none"
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className="font-bold text-lg sm:text-xl truncate">
            {headerText()}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={changeCurrentWindow} className="p-1">
            <img 
              className="w-6 h-6" 
              src={
                windowState.currentDashboardWindow === 'allNotes' || windowState.currentDashboardWindow === 'archivedNotes' 
                ? darkMode ? settingsW : settingsB 
                : darkMode ? homeW : homeB
              } 
              alt="Settings"
            />
          </button>
          <button onClick={handleLogout} className="p-1">
            <img className="w-6 h-6" src={darkMode ? logoutW : logoutB} alt="Log out"/>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 w-full md:w-auto md:ml-auto">
        {windowState.currentDashboardWindow !== 'settings' && (
          <Search makeSearch={text => makeNotesSearch(text)}/>
        )}

        {/* Iconos en escritorio */}
        <div className="hidden md:flex items-center gap-2">
          <button onClick={changeCurrentWindow} className="p-1">
            <img 
              className="inline-block align-middle w-6 h-6" 
              src={
                windowState.currentDashboardWindow === 'allNotes' || windowState.currentDashboardWindow === 'archivedNotes' 
                ? darkMode ? settingsW : settingsB 
                : darkMode ? homeW : homeB
              } 
              alt="Settings"
            />
          </button>
          <button onClick={handleLogout} className="p-1">
            <img 
              className="inline-block align-middle w-6 h-6" 
              src={darkMode ? logoutW : logoutB} 
              alt="Log out"
            />
          </button>
        </div>
      </div>
    </header>
  );
}