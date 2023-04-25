import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  let { $API } = useNuxtApp()
  const user = ref()

  const getUser = computed(() => user)

  function saveUser({ accessToken, id, username, avatar, createdAt }) {
    user.value = {
      accessToken,
      id,
      username,
      avatar,
      createdAt
    }
    localStorage.setItem('accessToken', accessToken)
    console.log(`User saved!`, user.value)
  }

  async function obtainUser(){
    user.value = localStorage.getItem('accessToken')
    if(user.value) await $API().User.get()
    else return false
  }

  return { getUser, saveUser, obtainUser }
})