import { useTheme } from '../context/ThemeContext';
import { useTags } from '../hooks/useTags';
import { useEffect } from 'react';
import { Loading } from './Loading';
import type { Tag } from '../interfaces/TagType';
import { CreateTag } from './Tags/CreateTag';

import logoHeader from '../assets/logo_header.png';
import allNotesB from '../assets/home_b.svg';
import allNotesW from '../assets/home_w.svg';
import archivedNotesB from '../assets/archive_b.svg';
import archivedNotesW from '../assets/archive_w.svg';
import deleteB from '../assets/delete_b.svg';
import deleteW from '../assets/delete_w.svg';

interface SidebarProps {
  changeNotesView: (newView: 'allNotes' | 'archivedNotes' | 'settings') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ changeNotesView }) => {
  const { darkMode } = useTheme();
  const { isLoading, tags, fetchAllTags, deleteTag } = useTags();

  useEffect(() => {
    fetchAllTags();
  }, [fetchAllTags]);

  const handleDeleteTag = (tag: Tag) => {
    if (confirm(`Do you wish to delete the tag '${tag.name}'? It will be removed from all associated notes as well.`)) {
      deleteTag(tag.id);
    }
  }

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
      <div className="ms-4">
        <h3 className="text-gray-500 font-bold">Tags</h3>
        <CreateTag/>
        {isLoading ? <Loading/> : 
          tags.map(tag => (
            <div key={tag.id}>
              <button className="align-middle" onClick={() => handleDeleteTag(tag)}>
                <img src={darkMode ? deleteW : deleteB} alt="Delete tag"/>
              </button>
              {tag.name}
            </div>
          ))
        }
      </div>
    </aside>
  );
}