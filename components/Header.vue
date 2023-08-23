<script lang="ts" setup> 
import { useAccountStore } from '../stores/account'
  const accountStore = useAccountStore()
</script>
<template>
  <header class="p-3 bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <svg class="bd-placeholder-img flex-shrink-0 rounded me-4" width="32" height="32" 
            xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" 
            preserveAspectRatio="xMidYMid slice" focusable="false">
            <circle cx="50%" cy="50%" r="50%" width="100%" height="100%" fill="#FFCA2B"></circle>
          </svg>
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">

        </ul>

        <div class="text-end">
          <button v-if="!accountStore.account" 
            type="button" class="btn btn-warning" 
            data-bs-toggle="modal" data-bs-target="#loginModal"
          >
            Sign-up
          </button>
          <div v-if="!!accountStore.account" class="d-flex text-muted gap-2">
            <svg class="bd-placeholder-img flex-shrink-0 rounded" width="32" height="32" 
              xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" 
              preserveAspectRatio="xMidYMid slice" focusable="false">
              <rect width="100%" height="100%" fill="#007bff"></rect>
            </svg>
            <div class="me-2 mb-0 small lh-sm text-white d-flex justify-content-start flex-column">
              <strong class="text-start">{{accountStore.account?.email}}</strong>
              <div class="text-white-50"> {{accountStore.account.address}}</div>
            </div>
            <button
              type="button" class="btn btn-secondary" 
              @click="accountStore.signOut"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
