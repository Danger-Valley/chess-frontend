import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
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
    console.log(`User saved!`, user.value)
  }

  return { getUser, saveUser }
})