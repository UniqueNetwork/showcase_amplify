<script lang="ts" setup>
  import { useAccountStore } from '~/stores/account'
  import { useAlertStore } from '~/stores/alert'
  const accountStore = useAccountStore()
  const alertStore = useAlertStore()

  const copyPrivateKey = () => {
    if (!accountStore.account) return;
    navigator.clipboard.writeText(accountStore.account.private)
    alertStore.showAlert({
      text: 'Private key copied successfully',
      severity: 'success'
    })
  }

  const alertClass = computed(() => {
    if (!alertStore.alert) return ''
    const background = alertStore.alert.severity === 'success' ? 'bg-primary' : 'bg-danger'
    return `${background} show`
  })

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

        <div class="col-12 col-lg-auto">
          <button v-if="!accountStore.account"
            type="button" class="btn btn-warning"
            data-bs-toggle="modal" data-bs-target="#loginModal"
          >
            Sign-up
          </button>
          <div v-if="!!accountStore.account" class="dropdown">
            <div
              class="dropdown-toggle d-flex text-muted gap-2 align-items-center justify-content-start"
              data-bs-toggle="dropdown" aria-expanded="false"
            >
              <svg class="bd-placeholder-img flex-shrink-0 rounded" width="32" height="32"
                xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
                preserveAspectRatio="xMidYMid slice" focusable="false">
                <rect width="100%" height="100%" fill="#007bff"></rect>
              </svg>
              <div class="me-2 mb-0 small lh-sm text-white d-flex justify-content-start flex-column">
                <strong class="text-start">{{accountStore.account?.email}}</strong>
                <div class="row vw-sm-100">
                  <div class="text-muted text-white-50 text-truncate ">
                    {{accountStore.account.address}}
                  </div>
                </div>
              </div>
              <div>
                <a class="dropdown-toggle " />
              </div>
            </div>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
              <li><a class="dropdown-item" href="#" @click="copyPrivateKey">Copy private key</a></li>
              <li><a class="dropdown-item" href="#" @click="accountStore.signOut">Log out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="alert-container" >
    <div :class="alertClass" class="toast align-items-center text-white border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          {{ alertStore.alert?.text}}
        </div>
        <!-- <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button> -->
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.vw-sm-100 {
  @media screen and (max-width: 578px) {
    width: calc(100vw - 76px);
  }
}
.dropdown {
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  a.dropdown-toggle:after {
    color: var(--bs-light);
  }
  .dropdown-menu {
    z-index: 9999;
  }
}
.alert-container {
  position: fixed;
  margin-top: 8px;
  right: 8px;
  z-index: 999;
}
.toast-body {
  white-space: pre-line;
}
</style>
