import { useToast } from '../components/Toast.vue';

declare global {
  interface Window {
    $toast: ReturnType<typeof useToast>;
  }
}

export {};
