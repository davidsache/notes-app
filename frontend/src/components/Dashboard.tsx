import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";
import { Settings } from "./Settings";
import { Notes } from "./Notes/Notes";

export const Dashboard: React.FC = () => {
  const [activeWindow, setActiveWindow] = useState<'notes' | 'settings'>('notes');

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-800">
      <Sidebar/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header currentDashboardWindow={activeWindow} onWindowChange={setActiveWindow}/>
        <main>
          {activeWindow === 'notes' ? <Notes/> : <Settings/>}
        </main>
      </div>
    </div>
  );
};