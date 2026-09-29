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
    <>
      <input 
        className={`
          border-2 w-64 h-8 me-2 rounded-md border-slate-300 bg-white dark:bg-gray-500 
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
          className="p-1 rounded-sm border border-slate-500 hover:border-indigo-500 hover:bg-indigo-100 dark:hover:border-sky-500 dark:hover:bg-sky-700 align-middle me-2"
          onClick={eraseSearch}
        >
          <img src={darkMode ? closeImgW : closeImgB}/>
        </button>
      )}
      <button 
        className="p-1 rounded-sm border border-slate-500 hover:border-indigo-500 hover:bg-indigo-100 dark:hover:border-sky-500 dark:hover:bg-sky-700 align-middle me-4"
        onClick={handleSearch}
      >
        <img src={darkMode ? searchImgW : searchImgB}/>
      </button>
    </>
  );
}