import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  let { $API } = useNuxtApp()
  const user = ref()

  const getUser = computed(() => user)

  async function saveUser(accessToken) {
    localStorage.setItem('accessToken', accessToken)
    await obtainUser();
    console.log(`User saved!`, user.value)
  }

  async function obtainUser(){
    if(!process.client) return
    
    let accessToken = localStorage.getItem('accessToken')
    console.log(accessToken, user.value)
    if(accessToken && !user.value) {
      let resp = await $API().User.get(accessToken)
      let body = await resp.json()
      user.value = body;
    }
    else return false
  }

  return { getUser, saveUser, obtainUser }
})