import { useCallback, useState } from "react"
import type { UserSettings } from "../interfaces/UserSettings"

const API_BASE = "http://localhost:8000/public";

export const useUsers = () => {
  const [userSettings, setUserSettings] = useState<UserSettings | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUserSettings = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(`${API_BASE}/user.php`, { credentials: 'include' });
    
    if (!res.ok) {
      setIsLoading(false);
      return;
    }

    const data = await res.json();
    setUserSettings(data.settings ?? undefined);
    setIsLoading(false);
  }, []);

  const addUserSettings = async (color: string, font: string) => {
    await fetch(`${API_BASE}/user.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ color_theme: color, font_theme: font })
    });

    await fetchUserSettings();
  }

  const updateUserSettings = async (newColor: string, newFont: string) => {
    await fetch(`${API_BASE}/user.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ color_theme: newColor, font_theme: newFont })
    });
  }

  return { isLoading, userSettings, fetchUserSettings, addUserSettings, updateUserSettings };
}