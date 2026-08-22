export interface WindowState {
  currentDashboardWindow: 'notes' | 'settings';
  onWindowChange: (newWindow: 'notes' | 'settings') => void;
}