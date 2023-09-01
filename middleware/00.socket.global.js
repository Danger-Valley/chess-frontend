import { useSocketStore } from "~/stores/socket"
export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useSocketStore()
  
  store.init()
})