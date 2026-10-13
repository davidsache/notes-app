import type { UserSettings } from "../interfaces/UserSettings";

const webSafeFonts = [
  { name: 'Arial', tailwindClass: "font-['Arial']" },
  { name: 'Verdana', tailwindClass: "font-['Verdana']" },
  { name: 'Tahoma', tailwindClass: "font-['Tahoma']" },
  { name: 'Trebuchet MS', tailwindClass: "font-['Trebuchet_MS']" },
  { name: 'Times New Roman', tailwindClass: "font-['Times_New_Roman']" },
  { name: 'Georgia', tailwindClass: "font-['Georgia']" },
  { name: 'Garamond', tailwindClass: "font-['Garamond']" },
  { name: 'Courier New', tailwindClass: "font-['Courier_New']" },
  { name: 'Brush Script MT', tailwindClass: "font-['Brush_Script_MT']" }
];

export const mainStyles = (baseStyles: string, userSettings: UserSettings | undefined): string => {
  let newStyles = baseStyles;

  if (userSettings) {
    switch (userSettings.color_theme) {
      case "Auto":
        newStyles += ' bg-white dark:bg-gray-800 ';
        break;
      case "Black":
        newStyles += ' bg-black dark:bg-black text-white ';
        break;
      case "White":
        newStyles += ' bg-white dark:bg-white text-black ';
        break;
      case "Blue":
        newStyles += ' bg-gradient-to-r from-blue-500 to-blue-400 dark:bg-gradient-to-r from-blue-500 to-blue-400 ';
        break;
      case "Red":
        newStyles += ' bg-gradient-to-r from-red-500 to-red-400 dark:bg-gradient-to-r from-red-500 to-red-400 ';
        break;
      case "Green":
        newStyles += ' bg-gradient-to-r from-green-500 to-green-400 dark:bg-gradient-to-r from-green-500 to-green-400 ';
        break;
    }

    const selectedFont = webSafeFonts.find(font => font.name === userSettings.font_theme);
    const fontClass = selectedFont ? selectedFont.tailwindClass : webSafeFonts[0].tailwindClass;
    newStyles += ` ${fontClass}`;
  }

  return newStyles;
}