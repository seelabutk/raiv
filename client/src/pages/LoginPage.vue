<template>
  <v-layout>
    <v-main class="align-center d-flex h-screen justify-center">
      <v-card width="640">
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-form @submit.prevent>
            <v-text-field v-model="email" label="Email address" type="email" />
            <v-text-field v-model="password" label="Password" type="password" />

            <p class="mb-4">
              Don't have an account?
              <router-link
                to="/account/signup"
                class="text-decoration-underline text-blue-darken-4"
              >
                Sign up
              </router-link>
            </p>

            <v-alert v-if="error" :text="error" class="mb-4" color="warning" />
            <v-btn @click="submit">Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
  </v-layout>
</template>

<script setup>
// import Cookies from 'js-cookie'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

function submit() {
  const formData = new FormData()
  formData.append('username', email.value)
  formData.append('password', password.value)

  fetch('/auth/jwt/login', {
    body: formData,
    method: 'POST',
    credentials: 'include',
  }).then((response) => {
    if (response.status === 204) {
      router.push('/')
    } else {
      error.value = 'Unable to login, please check your email and password'
    }
  })
}
</script>
