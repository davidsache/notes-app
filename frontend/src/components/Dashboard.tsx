import { Header } from "./Header";
import { useRef, useState } from "react";
import { Settings } from "./Settings";
import { Notes } from "./Notes/Notes";
import type { Tag } from "../interfaces/TagType";
import Sidebar from "./Sidebar";
import { type SidebarHandler } from "../interfaces/Sidebar";

export const Dashboard: React.FC = () => {
  const [activeWindow, setActiveWindow] = useState<'allNotes' | 'archivedNotes' | 'settings'>('allNotes');
  const [searchText, setSearchText] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<Tag | null>(null);
  const sidebarRef = useRef<SidebarHandler>(null);

  const handleTagFilter = (tag: Tag) => {
    if (activeWindow === 'settings') {
      setActiveWindow('allNotes');
    }
      
    setTagFilter(tag);
  }

  const handleSearch = (text: string) => {
    if (tagFilter) {
      setTagFilter(null);
    }

    setSearchText(text);
  }

  const handleClearTagFilter = (refetch: boolean) => {
    if (refetch && sidebarRef.current) {
      sidebarRef.current.refetchTags();
    }

    setTagFilter(null);
  }

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-800">
      <Sidebar 
        ref={sidebarRef}
        changeNotesView={setActiveWindow} 
        filterByTag={handleTagFilter} 
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          windowState={{ currentDashboardWindow: activeWindow, onWindowChange: setActiveWindow }} 
          makeNotesSearch={handleSearch}
        />
        <main>
          {activeWindow === 'allNotes' || activeWindow === 'archivedNotes' 
            ? <Notes 
                view={activeWindow} 
                search={searchText} 
                tagFilter={tagFilter} 
                clearTagFilter={handleClearTagFilter}
              /> 
            : <Settings/>
          }
        </main>
      </div>
    </div>
  );
};