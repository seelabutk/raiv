<template>
  <v-layout>
    <v-main class="align-center d-flex h-screen justify-center">
      <v-card width="640">
        <v-card-title>Sign up</v-card-title>
        <v-card-text>
          <v-form @submit.prevent>
            <v-text-field v-model="email" label="Email address" type="email" />
            <v-text-field
              v-model="password1"
              label="Password"
              type="password"
            />
            <v-text-field
              v-model="password2"
              label="Re-enter your password"
              type="password"
            />

            <v-alert v-if="error" :text="error" class="mb-4" color="warning" />
            <v-btn @click="submit">Sign Up</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password1 = ref('')
const password2 = ref('')
const error = ref('')

function submit() {
  if (password1.value !== password2.value) {
    error.value = "Passwords don't match"
    return
  }

  fetch('/auth/register', {
    body: JSON.stringify({
      email: email.value,
      password: password1.value,
    }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  }).then((response) => {
    if (response.status === 201) {
      router.push('/account/login')
    } else {
      error.value = 'Something went wrong, please try again'
    }
  })
}
</script>
