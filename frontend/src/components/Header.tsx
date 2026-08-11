import logoHeader from '../assets/logo_header.png';

import allNotesB from '../assets/home_b.svg';
import allNotesW from '../assets/home_w.svg';

import archivedNotesB from '../assets/archive_b.svg';
import archivedNotesW from '../assets/archive_w.svg';

export const Header: React.FC = () => {
  return (
    <header>
      <div className="w-48">
        <img src={logoHeader} className="w-32 mt-4"/>
        <div className="mt-4 ms-4">
          <button className="block pb-2">
            <img src={allNotesB} alt="All Notes" className="inline me-1"/>
            All Notes
          </button>
          <button className="block">
            <img src={archivedNotesB} alt="Archived Notes" className="inline me-1"/>
            Archived Notes
          </button>
        </div>
        <hr className="m-2 bg-slate-100"/>
        <div>
          <h3 className="ms-4 text-gray-500 font-bold">Tags</h3>
          
        </div>
      </div>
    </header>
  );
}