import { useTheme } from '../context/ThemeContext';
import { useTags } from '../hooks/useTags';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Loading } from './Loading';
import { CreateTag } from './Tags/CreateTag';
import { SidebarTag } from './Tags/SidebarTag';
import type { SidebarProps } from '../interfaces/Sidebar';

import logoHeader from '../assets/logo_header.png';
import allNotesB from '../assets/home_b.svg';
import allNotesW from '../assets/home_w.svg';
import archivedNotesB from '../assets/archive_b.svg';
import archivedNotesW from '../assets/archive_w.svg';

interface SidebarHandle {
  refetchTags: () => void;
}

type ResponsiveSidebarProps = SidebarProps & {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = forwardRef<SidebarHandle, ResponsiveSidebarProps>((props, ref) => {
  const { darkMode } = useTheme();
  const { isLoading, tags, fetchAllTags } = useTags();

  useImperativeHandle(ref, () => ({
    refetchTags() {
      fetchAllTags();
    }
  }), []);

  useEffect(() => {
    fetchAllTags();
  }, [fetchAllTags]);

  return (
    <>
      {props.isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={props.onClose}
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 h-full border-r-2 border-slate-300 bg-gray-100 dark:bg-gray-900 
          flex flex-col overflow-y-auto transition-transform duration-200 ease-in-out
          md:static md:translate-x-0 md:flex-shrink-0
          ${props.isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 mt-4">
          <img src={logoHeader} className="w-28 md:w-32 mx-auto md:mx-0" alt="Notely"/>
          <button
            type="button"
            onClick={props.onClose}
            className="md:hidden p-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 mx-4 space-y-1">
          <button 
            className="w-full text-left hover:bg-slate-200 dark:hover:bg-slate-500 rounded p-2 flex items-center text-sm md:text-base"
            onClick={() => props.changeNotesView('allNotes')}
          >
            <img src={darkMode ? allNotesW : allNotesB} alt="All Notes" className="inline me-2 w-5 h-5"/>
            All Notes
          </button>
          <button 
            className="w-full text-left hover:bg-slate-200 dark:hover:bg-slate-500 rounded p-2 flex items-center text-sm md:text-base"
            onClick={() => props.changeNotesView('archivedNotes')}
          >
            <img src={darkMode ? archivedNotesW : archivedNotesB} alt="Archived Notes" className="inline me-2 w-5 h-5"/>
            Archived Notes
          </button>
        </div>

        <hr className="my-3 mx-2 border-t-2 border-slate-300"/>

        <div className="px-4 pb-4 flex-1">
          <h3 className="text-gray-500 font-bold text-sm md:text-base">Tags</h3>
          <CreateTag refetchTags={fetchAllTags}/>
          <div className="mt-2 space-y-1">
            {isLoading ? <Loading/> : 
              tags.map(tag => <SidebarTag key={tag.id} tag={tag} tagToFilterBy={props.filterByTag}/>)
            }
          </div>
        </div>
      </aside>
    </>
  );
});

export default Sidebar;