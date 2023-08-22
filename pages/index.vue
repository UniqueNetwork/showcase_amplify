<script lang="ts" setup>
enum STATE {
  NOT_LOGGED_IN,
  NOT_FOLLOWING,
  FOLLOWING,
  FOLLOWING_AND_PAID,
}

const state = ref(STATE.NOT_LOGGED_IN)

const requestMain = async () => {
  const res = await (await fetch('/api/main?address=123')).json()
  console.log(res)
}
</script>

<template>
  <div>
    Page: index
    <div v-if="state === STATE.NOT_LOGGED_IN">
      Not logged in

      <button @click="requestMain">Request Main API route</button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
