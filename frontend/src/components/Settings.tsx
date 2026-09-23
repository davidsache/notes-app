import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useUsers } from "../hooks/useUsers";
import { Loading } from "./Loading";

export const Settings: React.FC = () => {
  const FONTS: string[] = ['Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'Brush Script MT'];
  const COLORS: string[] = ['Auto', 'White', 'Black', 'Blue', 'Red', 'Green'];

  const { darkMode, toggleTheme } = useTheme();
  const { isLoading, userSettings, fetchUserSettings, addUserSettings, updateUserSettings } = useUsers();

  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [selectedFont, setSelectedFont] = useState<string>(FONTS[0]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  useEffect(() => {
    if (userSettings) {
      setSelectedColor(userSettings.color_theme);
      setSelectedFont(userSettings.font_theme);
    }
  }, [userSettings]);

  const onFontChange = async (font: string) => {
    setSelectedFont(font);
    setSubmitting(true);

    if (!userSettings) {
      await addUserSettings(selectedColor, font);
    }
    else {
      await updateUserSettings(selectedColor, font);
    }

    setSubmitting(false);
  }

  const onColorChange = async (color: string) => {
    setSelectedColor(color);
    setSubmitting(true);

    if (!userSettings) {
      await addUserSettings(color, selectedFont);
    }
    else {
      await updateUserSettings(color, selectedFont);
    }

    setSubmitting(false);
  }

  if (isLoading) {
    return (
      <div className="p-2"><Loading/></div>
    );
  }

  return (
    <div className="p-2">
      <div className="mb-2">
        <label className="inline-flex items-center cursor-pointer">
          <span className="select-none me-4">Dark Mode</span>
          <input type="checkbox" value="" className="sr-only peer" onChange={toggleTheme} checked={darkMode}/>
          <div className="relative w-9 h-5 bg-slate-500 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600 dark:peer-checked:bg-teal-600"></div>
        </label>
      </div>

      <div className="mb-2">
        <span className="select-none me-3">Theme Font</span>
        <select 
          className="bg-neutral-secondary-medium border border-default-medium text-sm rounded-md focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs text-fg-disabled disabled:bg-slate-200 dark:disabled:bg-slate-500"
          onChange={(e) => onFontChange(e.target.value)}
          value={selectedFont}
          disabled={submitting}
        >
          {FONTS.map((font, index) => (
            <option key={index} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <span className="me-2">Theme Color</span>
        <select 
          className="bg-neutral-secondary-medium border border-default-medium text-sm rounded-md focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs text-fg-disabled disabled:bg-slate-200 dark:disabled:bg-slate-500"
          onChange={(e) => onColorChange(e.target.value)}
          value={selectedColor}
          disabled={submitting}
        >
          {COLORS.map((color, index) => (
            <option key={index} value={color}>{color}</option>
          ))}
        </select>
      </div>
    </div>
  );
}