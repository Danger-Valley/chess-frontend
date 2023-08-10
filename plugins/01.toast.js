import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      showToast: (msg, type = "success", dur = 3000) => {
        if(!process.client) return;
        return useToast().open({
          message: msg,
          type: type,
          duration: dur
        });
      }
    }
  }
})