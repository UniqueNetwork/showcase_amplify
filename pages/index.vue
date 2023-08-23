<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAccountStore } from '../stores/account'
import { useUniqueSdk } from '~/composables/useUniqueSdk'

enum STATE {
  NOT_LOGGED_IN,
  NOT_FOLLOWING,
  FOLLOWING,
  FOLLOWING_AND_PAID,
}

const state = ref(STATE.NOT_LOGGED_IN)
const accountStore = useAccountStore()

onMounted(() => {
  if (accountStore.account) state.value = STATE.NOT_FOLLOWING;
})

watch(accountStore, () => {
  if(accountStore.account) {
    state.value = STATE.NOT_FOLLOWING
    return;
  }
  state.value = STATE.NOT_LOGGED_IN;
})

const sdk = useUniqueSdk()
console.log('Unique SDK is connected to', sdk.options.baseUrl)

const requestMain = async () => {
  const res = await (await fetch('/api/main?address=123')).json()
  console.log(res)
}

</script>

<template>
  <Header />
  <section class="container px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-start g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">
        <img src="https://ipfs.uniquenetwork.dev/ipfs/Qmd8unFnubfYyUSHzPtSBD7SmYgqyaQ5DXSVA1ocCQ8HKw" class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy">
      </div>
      <div class="col-lg-6">
        <h1 class="display-5 fw-bold lh-1 mb-3">Marco Brun</h1>
        <p class="lead">Marko Bruno, a name that ignites curiosity and wonder, is an artist whose work resides at the intersection of abstract expressionism and surrealism. With an aura of mystery surrounding his identity, Bruno's captivating paintings invite viewers into a world where colors and shapes converse in a dance of emotion. Each canvas presents a puzzle, where vibrant hues coalesce with intricate details, prompting contemplation of the deeper narrative beneath. Bruno's artistry, though shrouded in enigma, leaves an indelible impression that challenges artistic conventions and invites us to explore the limitless realm of imagination.</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
          <button v-if="state === STATE.NOT_LOGGED_IN" 
            class="btn btn-warning btn-lg px-4 me-md-2" type="button" 
            data-bs-toggle="modal" data-bs-target="#loginModal"
          >
            Sign-up for follow
          </button>
          <button v-if="state === STATE.NOT_FOLLOWING" 
            class="btn btn-warning btn-lg px-4 me-md-2" type="button" 
          >
            Follow
          </button>
        </div>
      </div>
    </div>
  </section>
  <Login @sign-in="accountStore.signIn" />
</template>

<style scoped lang="scss">

</style>
