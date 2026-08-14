import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  darkMode: true,
  toggleTheme: () => {}
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  } 
  return context;
};