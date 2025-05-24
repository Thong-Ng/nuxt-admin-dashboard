<script setup lang="ts">
import { cn } from '@/lib/utils'
import PasswordInput from '~/components/PasswordInput.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const router = useRouter()
const { $useAPI, $toast } = useNuxtApp();

const profileFormSchema = toTypedSchema(z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
}).refine(
  (values) => {
    return values.password === values.confirmPassword;
  },
  {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  }
))

const { handleSubmit, resetForm } = useForm({
  validationSchema: profileFormSchema,
})

const onSubmit = handleSubmit(async(values) => {
  $toast.loading('Please wait...');

  try {
    const response = await $useAPI('/auth/register', {
      method: 'POST',
      body: {
        username: values.username,
        password: values.password,
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: "customer",        
      }
    });
    resetForm();

    $toast.dismiss();
    $toast.success('Registered successfully.');
  }
  catch (error) {
    console.error('Registration error:', error);
    $toast.dismiss();
    $toast.error('Registration error!');
  }
})
</script>

<template>
  <div>
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div class="grid gap-2">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="grid gap-2">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type="email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="grid gap-2">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="grid gap-2">
          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="grid gap-2">
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="grid gap-2">
          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>
      <Button class="mt-6" type="submit">
         Save
        </Button>
    </form>
  </div>
</template>
