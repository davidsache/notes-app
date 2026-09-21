import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";
import { Settings } from "./Settings";
import { Notes } from "./Notes/Notes";

export const Dashboard: React.FC = () => {
  const [activeWindow, setActiveWindow] = useState<'allNotes' | 'archivedNotes' | 'settings'>('allNotes');
  const [searchText, setSearchText] = useState<string>('');

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-800">
      <Sidebar changeNotesView={setActiveWindow}/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          windowState={{
            currentDashboardWindow: activeWindow,
            onWindowChange: setActiveWindow
          }} 
          makeNotesSearch={text => setSearchText(text)}
        />
        <main>
          {activeWindow === 'allNotes' || activeWindow === 'archivedNotes' ? 
            <Notes view={activeWindow} search={searchText}/> : <Settings/>
          }
        </main>
      </div>
    </div>
  );
};