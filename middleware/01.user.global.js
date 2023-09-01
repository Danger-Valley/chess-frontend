import { useUserStore } from "~/stores/user"
export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useUserStore()
  
  await store.obtainUser()

  if(process.client && !store?.getUser?.value && to?.name == 'profile') return navigateTo('/')
})