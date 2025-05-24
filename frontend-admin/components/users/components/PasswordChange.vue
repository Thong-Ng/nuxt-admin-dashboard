<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const { $useAPI, $toast } = useNuxtApp();
const props = defineProps(['id']);

const formSchema = toTypedSchema(z.object({
  passwordOld: z.string(),
  passwordNew: z.string(),
  passwordNewConfirm: z.string(),
}).refine(
  (values) => {
    return values.passwordNew === values.passwordNewConfirm;
  },
  {
    message: 'Passwords do not match!',
    path: ['passwordNewConfirm'],
  }
))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const handlePasswordChange = handleSubmit(async (values) => {
  // Show a loading toast notification
  $toast.loading('Please wait...');

  try {
    const response = await $useAPI('/user/update/password', {
      method: 'PUT',
      body: {
        id: props.id,
        // oldPassword: values.passwordOld,
        // newPassword: values.passwordNew,
        password: values.passwordNew,
      }
    });
    resetForm();

    $toast.dismiss();
    $toast.success('Password has been changed.');
  }
  catch (error) {
    console.error('Password change error:', error);
    $toast.dismiss();
    $toast.error('Password change error!');
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Change your password</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit="handlePasswordChange" id="formPasswordChange" class="space-y-4">
        <FormField v-slot="{ componentField }" name="passwordOld">
          <FormItem>
            <FormLabel>Old password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="passwordNew">
          <FormItem>
            <FormLabel>New password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="passwordNewConfirm">
          <FormItem>
            <FormLabel>Confirm password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </CardContent>
    <CardFooter class="border-t px-6 py-4">
      <Button type="submit" form="formPasswordChange">
        Change Password
      </Button>
    </CardFooter>
  </Card>
</template>