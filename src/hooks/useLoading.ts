// loading hooks

import { ref } from "vue";
import { useContainerStore } from "../pinia/useContainer";

export const useLoading = () => {
  const containerStore = useContainerStore();

  const message = ref("Wait for the web container to boot...");

  const bootedFlag = ref(false);

  // 10s后，如果containerStore.boot 仍为false，则提示失败
  function checkBooted() {
    const timer = setTimeout(() => {
      if (!containerStore.boot) {
        message.value = "Faid to boot,Reload to try again.";
        bootedFlag.value = true;
      }
      clearTimeout(timer);
    }, 10000);
  }

  return {
    message,
    bootedFlag,
    checkBooted,
  };
};
