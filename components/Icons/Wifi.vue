<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      :opacity="props.ms < 50 ? 1 : 0.2"
      d="M2 8.35961C8.06 3.67961 15.94 3.67961 22 8.35961"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      :opacity="props.ms < 100 ? 1 : 0.2"
      d="M4.91016 11.8396C9.21016 8.51961 14.8002 8.51961 19.1002 11.8396"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      :opacity="props.ms < 150 ? 1 : 0.2"
      d="M6.78906 15.4902C9.93906 13.0502 14.0491 13.0502 17.1991 15.4902"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      opacity="1"
      d="M9.40039 19.1494C10.9804 17.9294 13.0304 17.9294 14.6104 19.1494"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
let props = defineProps(['ms'])
</script>