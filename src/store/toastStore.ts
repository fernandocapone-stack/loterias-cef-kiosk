import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  message: string;
  show: (message: string, durationMs?: number) => void;
  hide: () => void;
}

let _timer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',

  show: (message, durationMs = 2000) => {
    if (_timer) clearTimeout(_timer);
    set({ visible: true, message });
    _timer = setTimeout(() => {
      set({ visible: false });
      _timer = null;
    }, durationMs);
  },

  hide: () => {
    if (_timer) { clearTimeout(_timer); _timer = null; }
    set({ visible: false });
  },
}));
