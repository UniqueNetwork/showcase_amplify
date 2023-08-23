<script lang="ts" setup> 
  import { useAccountStore } from '../stores/account'
  const { account } = useAccountStore();
</script>
<template>
  <header class="p-3 bg-dark text-white">
    <div class="container">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
      <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
        <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"></use></svg>
      </a>

      <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        <li><a href="#" class="nav-link px-2 text-secondary">Home</a></li>
        <li><a href="#" class="nav-link px-2 text-white">Features</a></li>
        <li><a href="#" class="nav-link px-2 text-white">Pricing</a></li>
        <li><a href="#" class="nav-link px-2 text-white">FAQs</a></li>
        <li><a href="#" class="nav-link px-2 text-white">About</a></li>
      </ul>

      <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
        <input type="search" class="form-control form-control-dark" placeholder="Search..." aria-label="Search">
      </form>

      <div class="text-end">
        <button v-if="!account" type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#loginModal">Sign-up</button>
        <div v-if="!!account" class="d-flex text-muted">
          <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007bff"></rect></svg>
          <div class="mb-0 small lh-sm text-white d-flex justify-content-start flex-column">
            <strong class="text-start">{{account?.email}}</strong>
            <div class="text-white-50"> {{account?.address}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="g_id_onload"
            data-client_id="317606739923-pmhhbtc50cp20qa11ql9o1ba4kmbopah.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-callback="onSignUpDone"
            data-auto_prompt="false">
        </div>
  </header>
</template>
