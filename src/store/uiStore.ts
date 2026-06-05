import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface UIState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notificationCenterOpen: boolean;
  notifications: Notification[];
  
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleNotificationCenter: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Welcome to InterviewBuddy AI!',
    message: 'Start by uploading your resume and setting up your first interview.',
    timestamp: new Date(),
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'New Feature: Voice Mode',
    message: 'You can now answer interview questions using voice input with real-time transcription.',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
];

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  sidebarOpen: false,
  commandPaletteOpen: false,
  notificationCenterOpen: false,
  notifications: initialNotifications,

  toggleTheme: () => set(state => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    return { theme: newTheme };
  }),
  
  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
  
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  toggleCommandPalette: () => set(state => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  
  toggleNotificationCenter: () => set(state => ({ notificationCenterOpen: !state.notificationCenterOpen })),
  
  addNotification: (notification) => set(state => ({
    notifications: [
      {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      },
      ...state.notifications,
    ],
  })),
  
  markNotificationRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),
  
  clearNotifications: () => set({ notifications: [] }),
}));
