<script lang="ts" setup>
  const props = defineProps({
    imageUrl: String,
    tokenId: Number,
    description: String,
  })
</script>
<template>
  <div class="d-flex text-muted gap-2">
    <img v-if="props.imageUrl" :src="props.imageUrl" class="d-block mx-lg-auto img-fluid" alt="token" width="30" height="30" loading="lazy">
    <svg v-if="!props.imageUrl" class="bd-placeholder-img flex-shrink-0 rounded" width="32" height="32" 
              xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" 
              preserveAspectRatio="xMidYMid slice" focusable="false">
              <rect width="100%" height="100%" fill="#DDDDDD"></rect>
            </svg>
    <div class="me-2 mb-0 small lh-sm d-flex justify-content-start flex-column flex-grow-1">
      <strong v-if="props.tokenId" class="text-start">ID {{ props.tokenId || 0 }}</strong>
      <strong v-if="!props.tokenId" class="text-start">AMPX FT Collection</strong>
      <div class="text-black-50"> {{ props.description }}</div>
    </div>
  </div>
</template>