import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

import searchImgW from '../assets/search_w.svg';
import searchImgB from '../assets/search_b.svg';
import closeImgW from '../assets/close_w.svg';
import closeImgB from '../assets/close_b.svg';

interface SearchProps {
  makeSearch: (search: string) => void;
}

export const Search: React.FC<SearchProps> = ({ makeSearch }) => {
  const { darkMode } = useTheme();
  const [searchText, setSearchText] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');

  const eraseSearch = () => {
    setSearchText('');
    makeSearch('');
  }

  const handleOnChange = (text: string) => {
    if (searchError) setSearchError('');
    setSearchText(text);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const handleSearch = () => {
    if (!searchText) {
      setSearchError("Search field can't be empty!");
      return;
    }

    makeSearch(searchText);
  }

  return (
    <div className="flex items-center w-full md:w-auto gap-1.5">
      <input 
        className={`
          border-2 flex-1 md:w-64 h-9 md:h-8 px-2.5 text-sm rounded-md border-slate-300 bg-white dark:bg-gray-500 min-w-0
          ${searchError ? 'placeholder-red-400' : 'placeholder-slate-400'}
        `}
        type="text" 
        placeholder={searchError ? searchError : "Search by title, content, or tags..."}
        value={searchText}
        onChange={e => handleOnChange(e.target.value)}
        onKeyDown={e => handleKeyDown(e)}
      />
      {searchText && (
        <button 
          className="h-9 md:h-8 px-2 rounded-md border border-slate-500 hover:border-indigo-500 hover:bg-indigo-100 
          dark:hover:border-sky-500 dark:hover:bg-sky-700 flex items-center justify-center shrink-0"
          onClick={eraseSearch}
        >
          <img className="w-4 h-4" src={darkMode ? closeImgW : closeImgB}/>        
        </button>
      )}
      <button 
        className="h-9 md:h-8 px-2 rounded-md border border-slate-500 hover:border-indigo-500 hover:bg-indigo-100 
        dark:hover:border-sky-500 dark:hover:bg-sky-700 flex items-center justify-center shrink-0 md:me-2"
        onClick={handleSearch}
      >
        <img className="w-4 h-4" src={darkMode ? searchImgW : searchImgB}/>
      </button>
    </div>
  );
}