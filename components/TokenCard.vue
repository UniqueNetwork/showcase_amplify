<script lang="ts" setup>
  import { DecodedAttributeDto, NestedToken } from '@unique-nft/sdk';
import { useTokensInfoStore } from '~/stores/tokens';

  const runtimeConfig = useRuntimeConfig()

  const props = defineProps({
    collectionId: Number,
    tokenId: Number,
    token: Object as PropType<NestedToken>,
    image: Object,
    balance: String,
  })

  const {
    artistNftCollectionId,
    followingRftCollectionId,
    ampxFtCollectionId,
  } = runtimeConfig.public;

  const tokensStore = useTokensInfoStore()

  const tokenName = computed(() => {
    switch (props.collectionId) {
      case artistNftCollectionId:
        return `Artist NFT`
      case followingRftCollectionId:
        return `Following RFT`
      case ampxFtCollectionId:
        return 'AMPX FT Collection'
      default:
        return ''
    }
  })

  const description = computed(() => {
    if (props.collectionId === followingRftCollectionId && props.token) {
      const attribute = (props.token.attributes as Record<number, DecodedAttributeDto>)[0];
      return `${attribute.name?._}: ${(attribute.value as { _: string })._}`;
    }
    if (props.collectionId === ampxFtCollectionId && props.balance) {
      return `Account balance: ${props.balance}`
    }
    if (props.collectionId === ampxFtCollectionId && !props.balance) {
      return `Nested balance: ${tokensStore.tokensInfo?.nftBalance}`
    }
    return "Following Badge NFT"
  })

  const imageUrl = computed(() => {
    if (!props.image) return
    // @ts-ignore
    return props.image.fullUrl
  })
</script>
<template>
  <div class="d-flex text-muted gap-2">
    <img v-if="imageUrl" :src="imageUrl" class="d-block rounded mx-lg-auto img-fluid" alt="token" width="30" height="30" loading="lazy">
    <svg v-if="!imageUrl" class="bd-placeholder-img flex-shrink-0 rounded" width="32" height="32" 
              xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" 
              preserveAspectRatio="xMidYMid slice" focusable="false">
              <rect width="100%" height="100%" fill="#DDDDDD"></rect>
            </svg>
    <div class="me-2 mb-0 small lh-sm d-flex justify-content-start flex-column flex-grow-1">
      <strong class="text-start">{{ tokenName }}</strong>
      <div class="text-black-50"> {{ description }}</div>
    </div>
  </div>
</template>