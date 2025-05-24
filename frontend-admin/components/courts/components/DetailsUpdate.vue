<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h, ref } from 'vue'
import * as z from 'zod'

const { $useAPI, $toast } = useNuxtApp();
const parentID = ref();
const props = defineProps(['data']);
const profile = props.data;
const selectedType = ref(profile.type || undefined);
const router = useRouter();

const profileFormSchema = toTypedSchema(z.object({
  name: z.string(),
  type: z.string(),
  parent_id: z.string().optional().nullable(),
  status: z.string(),
}))

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: profileFormSchema,
  initialValues: {
    name: profile.name ? profile.name : undefined,
    type: profile.type ? profile.type : undefined,
    parent_id: profile.parent_id !== undefined ? String(profile.parent_id) : undefined,
    status: profile.status ? profile.status : undefined,
  }
})

const onSubmit = handleSubmit(async(values) => {
  $toast.loading('Please wait...');

  try {
    const response = await $useAPI('/courts/'+ encodeURIComponent(profile.id), {
      method: 'PUT',
      body: {
        name: values.name,
        type: values.type,
        parent_id: values.parent_id,
        status: values.status,
      }
    });
    // Replace loading toast with success toast
    $toast.dismiss();
    $toast.success('Court has been updated.');
  }
  catch (error) {
    console.error('Court creation error:', error);

    // Replace loading toast with error toast
    $toast.dismiss();
    $toast.error('Court update error!');
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
  <!-- <p>{{ profile }}</p> -->
  <form class="space-y-8" @submit="onSubmit">

    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="type" :value="selectedType" @update:value="selectedType = $event">
      <FormItem class="space-y-3">
        <FormLabel>Court Type</FormLabel>
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
        <FormLabel>Parent Court ID</FormLabel>
        <Select v-bind="componentField" :disabled="selectedType === 'full'" >
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in parentID" :key="item" :value="String(item.id)">{{ item.id }}</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectItem value={null}>N/A</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" type="radio" name="status">
      <FormItem class="space-y-3">
        <FormLabel>Court Status</FormLabel>
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
        <Button
            type="button"
            variant="outline"
        >
            Back
        </Button></NuxtLink>
        <!-- <Button type="button" @click="clearField('parent_id')">Clear Parent ID</Button> -->
    </div>
  </form>
</template>
