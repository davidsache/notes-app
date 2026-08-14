import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";
import { Settings } from "./Settings";

export const Dashboard: React.FC = () => {
  const [activeWindow, setActiveWindow] = useState<'notes' | 'settings'>('notes');

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-800">
      <Sidebar/>
      <div className="flex flex-col flex-1">
        <Header currentWindow={activeWindow} onWindowChange={setActiveWindow}/>
        <main className="flex-1 p-2">
          {activeWindow === 'notes' ? ( <h1>Notes</h1> ) : ( <Settings/> )}
        </main>
      </div>
    </div>
  );
};