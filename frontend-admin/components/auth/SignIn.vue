<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import PasswordInput from '~/components/PasswordInput.vue'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const { signIn } = useAuth();
const { $toast } = useNuxtApp()

async function onSubmit(event: Event) {
  event.preventDefault()
  $toast.loading('Please wait...');
  try {
    const credentials = { email: email.value, password: password.value };
    await signIn(credentials, { callbackUrl: '/' });

    // Replace loading toast with success toast
    $toast.dismiss();
    $toast.success('Login successful.');
  }
  catch (error) {
    // console.error('Frontend Login error:', error);
    // Replace loading toast with error toast
    $toast.dismiss();
    $toast.error('Invalid credentials, please try again.');
  }
  }
</script>

<template>
  <form class="grid gap-6" @submit="onSubmit">
    <div class="grid gap-2">
      <Label for="email">
        Email
      </Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        placeholder="name@example.com"
        :disabled="isLoading"
        auto-capitalize="none"
        auto-complete="email"
        auto-correct="off"
      />
    </div>
    <div class="grid gap-2">
      <div class="flex items-center">
        <Label for="password">
          Password
        </Label>
        <NuxtLink
          to="/forgot-password"
          class="ml-auto inline-block text-sm underline"
        >
          Forgot your password?
        </NuxtLink>
      </div>
      <PasswordInput id="password" v-model="password" />
    </div>
    <Button type="submit" class="w-full" :disabled="isLoading">
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      Login
    </Button>
  </form>
</template>

<style scoped>

</style>
