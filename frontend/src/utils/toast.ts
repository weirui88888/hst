import { ref } from 'vue';

export type ToastType = 'info' | 'success' | 'warn' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

const toasts = ref<Toast[]>([]);

export const addToast = (type: ToastType, message: string) => {
  const id = Math.random().toString(36).slice(2);
  const newToast: Toast = {
    id,
    type,
    message,
  };

  toasts.value.push(newToast);

  // 2秒后自动移除
  setTimeout(() => {
    removeToast(id);
  }, 2000);

  return id;
};

export const removeToast = (id: string) => {
  const index = toasts.value.findIndex((toast: Toast) => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

export const info = (message: string) => {
  return addToast('info', message);
};

export const success = (message: string) => {
  return addToast('success', message);
};

export const warn = (message: string) => {
  return addToast('warn', message);
};

export const error = (message: string) => {
  return addToast('error', message);
};

export const show = (message: string) => {
  return addToast('info', message);
};

export const useToast = () => {
  return {
    toasts,
    addToast,
    removeToast,
    info,
    success,
    warn,
    error,
    show,
  };
};

// 导出toasts以便组件使用
export { toasts };
