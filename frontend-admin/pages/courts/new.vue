<script setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h, ref } from 'vue'
import * as z from 'zod'

const { $useAPI, $toast } = useNuxtApp();
const selectedType = ref('');
const parentID = ref();

const profileFormSchema = toTypedSchema(z.object({
  name: z.string(),
  type: z.string(),
  parent_id: z.preprocess(
    (value) => parseInt(value, 10),
    z.number()
  ).optional(),
  status: z.string(),
}))

const { handleSubmit } = useForm({
  validationSchema: profileFormSchema,
})

const onSubmit = handleSubmit(async(values) => {
  $toast.loading('Please wait...');

  try {
    const response = await $useAPI('/courts', {
      method: 'POST',
      body: {
        name: values.name,
        type: values.type,
        parent_id: values.parent_id,
        status: values.status,
      }
    });
    
    // Replace loading toast with success toast
    $toast.dismiss();
    $toast.success('Court has been added.');
  }
  catch (error) {
    console.error('Court creation error:', error);

    // Replace loading toast with error toast
    $toast.dismiss();
    $toast.error('Court creation error!');
  }
})

async function getParentID() {
try {
  const response = await $useAPI('/parentCourts');
  return response;
}
catch (error) {
  console.error(error);
  return 0;
}
}
parentID.value = await getParentID();
</script>

<template>
  <div class="pb-4">
    <h3 class="text-2xl font-bold py-8">
      Add Court
    </h3>
  </div>
  <Separator />
  <form class="space-y-8 pt-4 max-w-md" @submit="onSubmit">

    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel class="text-lg">Name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField, field }" name="type" :value="selectedType" @update:value="selectedType = $event">
      <FormItem class="space-y-3">
        <FormLabel class="text-lg">Court Type</FormLabel>
        <FormControl>
          <RadioGroup
            class="flex flex-col space-y-1"
            v-bind="componentField"
            v-model="selectedType"
          >
            <FormItem class="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="full" />
              </FormControl>
              <FormLabel class="font-normal">
                Full
              </FormLabel>
            </FormItem>
            <FormItem class="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="half" />
              </FormControl>
              <FormLabel class="font-normal">
                Half
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="parent_id">
      <FormItem>
        <FormLabel class="text-lg">Parent Court ID</FormLabel>
        <Select v-bind="componentField" :disabled="selectedType === 'full'">
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in parentID" :key="item" :value="String(item.id)">{{ item.id }}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" type="radio" name="status">
      <FormItem class="space-y-3">
        <FormLabel class="text-lg">Court Status</FormLabel>
        <FormControl>
          <RadioGroup
            class="flex flex-col space-y-1"
            v-bind="componentField"
          >
            <FormItem class="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="available" />
              </FormControl>
              <FormLabel class="font-normal">
                Available
              </FormLabel>
            </FormItem>
            <FormItem class="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="blocked" />
              </FormControl>
              <FormLabel class="font-normal">
                Blocked
              </FormLabel>
            </FormItem>
            <FormItem class="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="draft" />
              </FormControl>
              <FormLabel class="font-normal">
                Draft
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    
    <div class="flex justify-start gap-2">
        <Button type="submit">
            Save
        </Button>
        <NuxtLink to="/courts">
        <Button type="button" variant="outline">
            Back
        </Button></NuxtLink>
    </div>
  </form>
</template>
