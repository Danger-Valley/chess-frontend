import { useUserStore } from "~/stores/user"
export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useUserStore()
  
  await store.obtainUser()
})