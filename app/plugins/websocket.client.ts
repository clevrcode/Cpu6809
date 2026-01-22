// plugins/websocket.client.ts
import { useCpuStore } from '~/stores/cpu';

export default defineNuxtPlugin((nuxtApp) => {
    const store = useCpuStore();
    // const runtimeConfig = useRuntimeConfig();
    // Example: Connect to a WebSocket URL from runtime config
    // const url: string = <string>(useRuntimeConfig().public.ws_url)
    store.connect();
});
