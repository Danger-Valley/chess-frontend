<template>
  <button @click="signInWith('google')">Google</button>
  <button>Twitter</button>
  <button>Discord</button>
</template>

<script setup>
let {
  signIn
} = useAuth()

const signInWith = async (provider) => {
  await signIn(provider)
}
</script>