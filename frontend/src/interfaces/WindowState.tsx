export interface WindowState {
  currentWindow: 'notes' | 'settings';
  onWindowChange: (newWindow: 'notes' | 'settings') => void;
}