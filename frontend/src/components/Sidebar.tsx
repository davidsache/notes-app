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

const Sidebar = forwardRef<SidebarHandle, SidebarProps>((props, ref) => {
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
    <aside className="w-64 h-full border-r-2 border-slate-300 bg-gray-100 dark:bg-gray-900">
      <img src={logoHeader} className="w-32 mt-4"/>
      <div className="mt-4 mx-4">
        <button 
          className="w-full text-left hover:bg-slate-200 dark:hover:bg-slate-500 rounded p-2"
          onClick={() => props.changeNotesView('allNotes')}
        >
          <img src={darkMode ? allNotesW : allNotesB} alt="All Notes" className="inline me-1"/>
          All Notes
        </button>
        <button 
          className="w-full text-left hover:bg-slate-200 dark:hover:bg-slate-500 rounded p-2"
          onClick={() => props.changeNotesView('archivedNotes')}
        >
          <img src={darkMode ? archivedNotesW : archivedNotesB} alt="Archived Notes" className="inline me-1"/>
          Archived Notes
        </button>
      </div>
      <hr className="m-2 border-t-2 border-slate-300"/>
      <div className="ms-4">
        <h3 className="text-gray-500 font-bold">Tags</h3>
        <CreateTag refetchTags={fetchAllTags}/>
        {isLoading ? <Loading/> : 
          tags.map(tag => (
            <SidebarTag 
              key={tag.id} 
              tag={tag} 
              tagToFilterBy={props.filterByTag}
            />
          ))
        }
      </div>
    </aside>
  );
});

export default Sidebar;