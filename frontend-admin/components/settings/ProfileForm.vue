<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const { $useAPI, $toast } = useNuxtApp();
const props = defineProps(['user']);
const profile = props.user;

const formSchema = toTypedSchema(z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.string(),
  phone: z.string(),
  name: z.string(),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username    : profile.username ? profile.username : undefined,
    email       : profile.email ? profile.email : undefined,
    role        : profile.role ? profile.role : undefined,
    phone       : profile.phone ? profile.phone : undefined,
    name        : profile.name ? profile.name : undefined,
  }
})

const onSubmit = handleSubmit(async (values) => {
  $toast.loading('Please wait...');

  try {
    const response = await $useAPI('/user/update', {
      method: 'PUT',
      body: {
        id: profile.id,
        username: values.username,
        email: values.email,
        role: values.role,
        phone: values.phone,
        name: values.name,
      }
    });

    $toast.dismiss();
    $toast.success('Profile has been updated.');
  }
  catch (error) {
    console.error('Profile update error:', error);
    $toast.dismiss();
    $toast.error('Profile update error!');
  }
})
</script>


<template>
  <div class="py-6">
    <h3 class="text-lg font-medium">
      Profile
    </h3>
    <Separator />
  </div>
  
  <form @submit="onSubmit" class="space-y-8">
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input disabled type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email address</FormLabel>
        <FormControl>
          <Input disabled type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Full name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="phone">
      <FormItem>
        <FormLabel>Contact no</FormLabel>
        <FormControl>
          <Input type="tel" placeholder="+60188888888" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-start gap-2">
      <Button type="submit">
        Update Profile
      </Button>
    </div>
  </form>
</template>