<script lang="ts" setup>
import {useAccountStore} from '~/stores/account'

const accountStore = useAccountStore()
</script>

<template>
  <Header/>
  <slot/>
  <Login @sign-in="accountStore.signIn"/>
</template>
<style scoped lang="scss"></style>
