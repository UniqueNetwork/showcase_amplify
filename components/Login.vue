<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'signIn', email: string): void
}>()

const email = ref('')
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
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="emit('signIn', email)" data-bs-dismiss="modal">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>
