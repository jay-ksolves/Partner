import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface UiState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toasts: Toast[];
  isFullscreen: boolean;
  showScrollToTop: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  theme: 'light',
  toasts: [],
  isFullscreen: false,
  showScrollToTop: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast = { ...action.payload, id: Date.now().toString() };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
    setShowScrollToTop: (state, action: PayloadAction<boolean>) => {
      state.showScrollToTop = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleTheme,
  setTheme,
  addToast,
  removeToast,
  setFullscreen,
  setShowScrollToTop,
} = uiSlice.actions;
export default uiSlice.reducer;