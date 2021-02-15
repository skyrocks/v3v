<template>
  <div>Design Report {{ router.params.id }}</div>
</template>
<script setup>
  import { useRoute } from 'vue-router'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRoute()
</script>
