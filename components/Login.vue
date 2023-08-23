<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const emit = defineEmits<{
  (e: 'sign-in', email: string): void
}>()

const email = ref('')

const handleCredentialResponse = () => {
  //TODO: sign-in with google
}

onMounted(() => {
  // @ts-ignore
  window.google.accounts.id.initialize({
        client_id: '317606739923-pmhhbtc50cp20qa11ql9o1ba4kmbopah.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        context: 'signin'
      })
  // @ts-ignore
  google.accounts.id.renderButton(
    document.getElementById('googleButton'),
    { 
      type: 'standard',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'center',
      width: 250
    }
  )
})
</script>
<template>
  <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">Sign-up</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex flex-wrap align-items-center mb-4 form-signin container" >
            <label for="floatingInput" class="form-label">Email address</label>
            <input type="email" class="form-control" id="floatingInput" v-model="email"  placeholder="name@example.com"/>
          </div>
          <div class="d-flex flex-wrap align-items-center justify-content-center" >
            <div id="g_id_onload"
              data-client_id="317606739923-pmhhbtc50cp20qa11ql9o1ba4kmbopah.apps.googleusercontent.com"
              data-context="signin"
              data-ux_mode="popup"
              data-callback="onSignUpDone"
              data-auto_prompt="false">
            </div>
            <div id="googleButton" class="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="emit('signIn', email)" data-bs-dismiss="modal">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>
