import { defineStore } from 'pinia'
import mixpanel from 'mixpanel-browser';

export const useMixpanelStore = defineStore('mixpanel', () => {
  const isInited = ref(false)

  function init() {
    if(!process.client) return;
    
    let env = useRuntimeConfig();
    mixpanel.init(env.public.MIXPANEL_TOKEN, { debug: true });
    isInited.value = true;
    mixpanel.track('Init');
    identify()
  }

  function identify() {
    if (isInited.value && process.client && localStorage.getItem("userId")) mixpanel.identify(localStorage.getItem("userId"));
  }

  return { init, identify }
})