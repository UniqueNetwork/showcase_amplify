<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAccountStore } from '~/stores/account'
import { useFollowingsStore } from '~/stores/follow';
import { useTokensInfoStore } from '~/stores/tokens';
import { useUniqueSdk } from '~/composables/useUniqueSdk'
import { Address } from '@unique-nft/utils/address';

const runtimeConfig = useRuntimeConfig()


enum STATE {
  NOT_LOGGED_IN,
  NOT_FOLLOWING,
  FOLLOWING,
  FOLLOWING_AND_PAID,
}

const state = ref(STATE.NOT_LOGGED_IN)
const accountStore = useAccountStore()
const followingsStore = useFollowingsStore()
const tokensStore = useTokensInfoStore()

onMounted(() => {
  if (accountStore.account) {
    state.value = STATE.NOT_FOLLOWING;
  }
  if (accountStore.account && followingsStore.following) {
    state.value = STATE.FOLLOWING;
  }
})

watch(accountStore, () => {
  if(accountStore.account) {
    state.value = STATE.NOT_FOLLOWING
    return;
  }
  state.value = STATE.NOT_LOGGED_IN;
  tokensStore.tokensInfo = null;
})

watch(followingsStore, async () => {
  if(followingsStore.following && accountStore.account) {
    state.value = STATE.FOLLOWING
    return;
  }
  state.value = STATE.NOT_FOLLOWING;
})

const sdk = useUniqueSdk()
console.log('Unique SDK is connected to', sdk.options.baseUrl)

const followRequest = useAsyncData(async () => {
  if (!accountStore.account) return
  const response = await fetch(`/api/getArtistNft?address=${accountStore.account.address}`)
  const result = await response.json()
  followingsStore.following = {
    nftId: result.nft.tokenId,
  }
  await fetchBundle(result.nft.tokenId)
  return result
}, {
  immediate: false,
})

const donateRequest = useAsyncData(async () => {
  if (!accountStore.account) return
  const tokenId = followingsStore.following?.nftId
  if (!tokenId) return
  const response = await fetch(`/api/getSubscriptionRft?address=${accountStore.account.address}&tokenId=${tokenId}`)
  const result = await response.json()
  console.log(result)
  return result
}, {
  immediate: false,
})

const fetchBundle = async (tokenId: number) => {
  if (!accountStore.account) return
  const fetchFTBalance = async (address: string) => await sdk.fungible.getBalance({
    collectionId: runtimeConfig.public.ampxFtCollectionId,
    address
  })
  const bundle = await sdk.token.getBundle({
    collectionId: runtimeConfig.public.artistNftCollectionId,
    tokenId
  })
  const followerFTBalance = (await fetchFTBalance(accountStore.account.address)).formatted
  const nftBalance = (await fetchFTBalance(Address.nesting.idsToAddress(
    runtimeConfig.public.artistNftCollectionId,
    tokenId
  ))).formatted
  tokensStore.tokensInfo = {
    bundle,
    followerFTBalance,
    nftBalance,
  }
  return bundle
}

if (accountStore.account && followingsStore.following) {
  fetchBundle(followingsStore.following.nftId)
}

const tokenImageUrl = computed(() => {
  return ((tokensStore.tokensInfo?.bundle.image as any)?.fullUrl || '') as string
})

const ftAccountBalance = computed(() => {
  return `Account balance: ${tokensStore.tokensInfo?.followerFTBalance}`
})
const ftNestedBalance = computed(() => {
  return `Nested balance: ${tokensStore.tokensInfo?.nftBalance}`
})

</script>

<template>
  <Header />
  <section class="container px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-start g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">
        <img src="https://ipfs.uniquenetwork.dev/ipfs/Qmd8unFnubfYyUSHzPtSBD7SmYgqyaQ5DXSVA1ocCQ8HKw" class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy">
        <div v-if="!!tokensStore.tokensInfo" class="mt-5 d-flex flex-column gap-2" >
          <TokenCard
              :description="ftAccountBalance"
            />
          <TokenCard
            :token-id="tokensStore.tokensInfo.bundle.tokenId"
            :image-url="tokenImageUrl"
            description="Follower Badge NFT"
          />
          <div class="ms-4">
            <TokenCard
              :description="ftNestedBalance"
            />
          </div>
        </div>
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
            @click="followRequest.execute" :disabled="followRequest.status.value === 'pending'"
          >
            Follow
          </button>
          <button v-if="state === STATE.FOLLOWING"
            class="btn btn-warning btn-lg px-4 me-md-2" type="button"
            @click="donateRequest.execute" :disabled="donateRequest.status.value === 'pending'"
          >
            Donate for the month
          </button>
        </div>

      </div>
    </div>
  </section>
  <Login @sign-in="accountStore.signIn" />
</template>

<style scoped lang="scss">

</style>
