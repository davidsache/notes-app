export interface WindowState {
  currentDashboardWindow: 'allNotes' | 'archivedNotes' | 'settings';
  onWindowChange: (newWindow: 'allNotes' | 'archivedNotes' | 'settings') => void;
}