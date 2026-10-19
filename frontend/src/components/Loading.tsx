import { useTheme } from "../context/ThemeContext";
import loadingImgW from '../assets/loading-w.gif';
import loadingImgB from '../assets/loading-b.gif';

export const Loading: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <img className="w-6 sm:w-7 md:w-8 mt-1" src={darkMode ? loadingImgW : loadingImgB} alt="Loading"/>  
  );
}