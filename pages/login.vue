<template>
  <button @click="signInWith('google')">Google</button>
  <button @click="signInWith('twitter')">Twitter</button>
  <button @click="signInWith('discord')">Discord</button>
</template>

<script setup>
let {
  signIn
} = useAuth()

const signInWith = async (provider) => {
  await signIn(provider, {callbackUrl: '/ok'} )
}
</script>