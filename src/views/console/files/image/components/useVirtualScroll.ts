// composables/useVirtualScroll.ts
import { ref } from "vue";
export function useVirtualScroll() {
  const observer = ref<IntersectionObserver>();

  const startObserver = (callback: () => void) => {
    const sentinel = document.createElement("div");
    observer.value = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    });
    observer.value.observe(sentinel);
  };

  const stopObserver = () => {
    observer.value?.disconnect();
  };

  return { startObserver, stopObserver };
}
