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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<SidebarHandler>(null);

  const handleTagFilter = (tag: Tag) => {
    if (activeWindow === 'settings') {
      setActiveWindow('allNotes');
    }
      
    setTagFilter(tag);
    setSidebarOpen(false);
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
    <div className="flex h-screen w-full bg-white dark:bg-gray-800 overflow-hidden">
      <Sidebar 
        ref={sidebarRef}
        changeNotesView={(view) => {
          setActiveWindow(view);
          setSidebarOpen(false);
        }} 
        filterByTag={handleTagFilter}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header 
          windowState={{ currentDashboardWindow: activeWindow, onWindowChange: setActiveWindow }} 
          makeNotesSearch={handleSearch}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
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