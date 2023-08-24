<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAccountStore } from '~/stores/account'
import { useFollowingsStore } from '~/stores/follow';
import { useTokensInfoStore } from '~/stores/tokens';
import { useAlertStore } from '~/stores/alert';
import { useUniqueSdk } from '~/composables/useUniqueSdk'
import { Address } from '@unique-nft/utils';

const runtimeConfig = useRuntimeConfig()

const {
  artistNftCollectionId,
  ampxFtCollectionId,
} = runtimeConfig.public;

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
const alertStore = useAlertStore()

onMounted(() => {
  if (accountStore.account) {
    state.value = STATE.NOT_FOLLOWING;
  }
  if (accountStore.account && followingsStore.following) {
    state.value = STATE.FOLLOWING;
  }
})

watch(accountStore, () => {
  if (accountStore.account) {
    state.value = STATE.NOT_FOLLOWING
    return;
  }
  state.value = STATE.NOT_LOGGED_IN;
  followingsStore.following = null;
  tokensStore.tokensInfo = null;
})

watch(tokensStore, () => {
  if (followingsStore.following &&
     accountStore.account &&
     tokensStore.tokensInfo &&
     tokensStore.tokensInfo?.bundle.nestingChildTokens.length > 1) {
    state.value = STATE.FOLLOWING_AND_PAID
    return;
  }
})

const sdk = useUniqueSdk()
console.log('Unique SDK is connected to', sdk.options.baseUrl)

const followRequest = useAsyncData(async () => {
  if (!accountStore.account) return
  const response = await fetch(`/api/getArtistNft?address=${accountStore.account.address}`)
  const result = await response.json()
  if(!response.ok) throw new Error(result.statusMessage || response.statusText)
  if(!result?.nft?.tokenId) return
  followingsStore.following = {
    nftId: result.nft.tokenId,
  }
  state.value = STATE.FOLLOWING
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
  if(!response.ok) throw new Error(result.statusMessage || response.statusText)
  await fetchBundle(tokenId)
  return result
}, {
  immediate: false,
})

watch(followRequest.status, () => {
  followRequest.status.value === 'error' && alertStore.showAlert({
    text: followRequest.error.value?.message || 'Unhandled error',
    severity: 'error',
  })
})

watch(donateRequest.status, () => {
  donateRequest.status.value === 'error' && alertStore.showAlert({
    text: donateRequest.error.value?.message || 'Unhandled error',
    severity: 'error',
  })
})

const fetchBundle = async (tokenId: number) => {
  if (!accountStore.account) return
  const fetchFTBalance = async (address: string) => await sdk.fungible.getBalance({
    collectionId: ampxFtCollectionId,
    address
  })
  const bundle = await sdk.token.getBundle({
    collectionId: artistNftCollectionId,
    tokenId
  })

  const bundleAddress = Address.nesting.idsToAddress(
    artistNftCollectionId,
    tokenId
  );
  const followerFTBalance = (await fetchFTBalance(accountStore.account.address)).formatted
  const nftBalance = (await fetchFTBalance(bundleAddress)).formatted

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

</script>

<template>
  <Header />
  <section class="container px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-start g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">
        <img src="https://ipfs.uniquenetwork.dev/ipfs/Qmd8unFnubfYyUSHzPtSBD7SmYgqyaQ5DXSVA1ocCQ8HKw" class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy">
        <div v-if="!!tokensStore.tokensInfo" class="mt-5 d-flex flex-column gap-2" >
          <h4>Own tokens</h4>
          <TokenCard
            v-if="tokensStore.tokensInfo?.followerFTBalance"
            :collectionId="ampxFtCollectionId"
            :balance="tokensStore.tokensInfo?.followerFTBalance"
          />
          <TokenCard
            :collectionId="artistNftCollectionId"
            :token-id="tokensStore.tokensInfo.bundle.tokenId"
            :image="tokensStore.tokensInfo?.bundle.image"
          />
          <div class="d-flex flex-column gap-2">
            <div v-for="item in tokensStore.tokensInfo.bundle.nestingChildTokens" class="child-token ms-4">
              <TokenCard
                :key="`${item.collectionId}-${item.tokenId}`"
                :collectionId="item.collectionId"
                :token-id="item.tokenId"
                :token="item"
                :image="item.image"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <h1 class="display-5 fw-bold lh-1 mb-3">Marco Brun</h1>
        <p class="lead">Marko Brun, a name that ignites curiosity and wonder, is an artist whose work resides at the intersection of abstract expressionism and surrealism. With an aura of mystery surrounding his identity, Bruno's captivating paintings invite viewers into a world where colors and shapes converse in a dance of emotion. Each canvas presents a puzzle, where vibrant hues coalesce with intricate details, prompting contemplation of the deeper narrative beneath. Bruno's artistry, though shrouded in enigma, leaves an indelible impression that challenges artistic conventions and invites us to explore the limitless realm of imagination.</p>
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
            <div v-if="followRequest.status.value === 'pending'" class="spinner-border spinner-border-sm" role="status"></div>
            Follow
          </button>
          <button v-if="state === STATE.FOLLOWING && tokensStore.tokensInfo"
            class="btn btn-warning btn-lg px-4 me-md-2" type="button"
            @click="donateRequest.execute" :disabled="donateRequest.status.value === 'pending'"
          >
            <div v-if="donateRequest.status.value === 'pending'" class="spinner-border spinner-border-sm" role="status"></div>
            Donate for the month
          </button>
        </div>
      </div>
    </div>
  </section>
  <Login @sign-in="accountStore.signIn" />
</template>

<style scoped lang="scss">
  .child-token{
    position: relative;
    &:before {
      content: "";
      display: block;
      width: 6px;
      height: 50%;
      margin-left: -12px;
      background: rgba(255, 255, 255, 0.1);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      border-left: 1px solid;
      border-bottom: 1px solid;
      border-bottom-left-radius: calc(var(--bs-border-radius-lg) / 2);
      border-color: var(--bs-gray-400);
    }
    &:not(:first-child) {
      &:before {
        height: 100%;
        top: -50%;
      }
    }
  }
</style>
