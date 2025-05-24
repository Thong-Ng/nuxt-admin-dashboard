<script setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, reactive, watch } from 'vue'
import * as z from 'zod'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toDate } from 'radix-vue/date'

const router = useRouter();
const { data } = useAuth();
const id = data.value.user_id;
const { $useAPI, $toast } = useNuxtApp();
const placeholder = ref(); 

const times = ["8:00AM","9:00AM","10:00AM","11:00AM","4:00PM","5:00PM","6:00PM","7:00PM"];
const durations = ["1hr", "2hrs", "3hrs"];
const maxDate = today(getLocalTimeZone()).add({ days: 14 });

const value = computed({
  get: () => values.date ? parseDate(values.date) : undefined,
  set: val => val,
})

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const convertTo24HourFormat = (time) => {
    const [hours, minutes, modifier] = time.match(/(\d+):(\d+)(AM|PM)/).slice(1);
    let hours24 = parseInt(hours, 10);
    if (modifier === 'PM' && hours24 < 12) hours24 += 12;
    if (modifier === 'AM' && hours24 === 12) hours24 = 0;

    hours24 = (hours24 + 24) % 24; 

    return `${hours24.toString().padStart(2, '0')}:${minutes}`;
  };

const parseDuration = (duration) => {
  if (duration.includes('hr')) {
    const hours = parseInt(duration, 10); 
    return isNaN(hours) ? 0 : hours; 
  }
  return 0; 
};

const valuesForm = reactive({
  type: '',
  date: '', 
  time: '', 
  duration: '', 
  start_time: '',
  end_time: '',
  court: '',
  total:'',
  tax:'',
});

const courtID = ref([]);
const users = ref([]);

onMounted(async () => {
  try {
    const response = await $useAPI('/users?role=customer');
    users.value = response; 
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
});

async function getCourt() {
try {

  const queryParams = new URLSearchParams();
    if (valuesForm.type) queryParams.append('type', valuesForm.type);
    if (valuesForm.start_time) queryParams.append('start_time', valuesForm.start_time);
    if (valuesForm.end_time) queryParams.append('end_time', valuesForm.end_time);

  const response = await $useAPI(`/bookings/check?${queryParams.toString()}`);
  return response;
}
catch (error) {
  console.error(error);
  return 0;
}
}

watch(valuesForm, async (newValues) => {
  if (newValues.date && newValues.time && newValues.duration && newValues.type) {
    try {
      const time24 = convertTo24HourFormat(newValues.time);
      const start_time_calc = `${newValues.date} ${time24}`;
      const startISO = new Date(start_time_calc);
      // const start = new Date(startISO.getTime() + 8 * 60 * 60 * 1000);
      const durationInHours = parseDuration(newValues.duration);
      const end = new Date(startISO.getTime() + durationInHours * 60 * 60 * 1000 + 8 * 60 * 60 * 1000); 
      const end_time_calc = end.toISOString().slice(0, 16).replace('T', ' ');

      if(newValues.type == "full"){
        newValues.total = 100 * durationInHours;
      }
      else if(newValues.type == "half"){
        newValues.total = 50 * durationInHours;
      }

      newValues.start_time = start_time_calc;
      newValues.end_time = end_time_calc;

      valuesForm.tax = newValues.total * 0.06;

      const result = await getCourt(newValues);
      courtID.value = result;
    } catch (error) {
      console.error('Error in processing values:', error);
    }
  }
});


const profileFormSchema = toTypedSchema(z.object({
  court_id: z.string(),
  time: z.string(),
  duration: z.string(),
  date: z.string(),
  type: z.string(),
  user_id: z.string(),
}))

const { handleSubmit, resetForm, values, setFieldValue } = useForm({
  validationSchema: profileFormSchema,
})

const onSubmit = handleSubmit(async(values) => {
  $toast.loading('Please wait...');
  const taxCalculate = valuesForm.total * 0.06;

  try {

    const response = await $useAPI('/bookings', {
      method: 'POST',
      body: {
        court_id: values.court_id,
        user_id: values.user_id,
        start_time: valuesForm.start_time,
        end_time: valuesForm.end_time,
        type: values.type,
        total: valuesForm.total + taxCalculate,
        status: "pending",
        sub_total: valuesForm.total,
        tax: taxCalculate,
      }
    });
    resetForm();
    $toast.dismiss();
    $toast.success('Booking has been added.');
    router.push('/bookings');
  }
  catch (error) {
    console.error('Booking creation error:', error);

    // Replace loading toast with error toast
    $toast.dismiss();
    $toast.error('Booking creation error!');
  }
})
</script>

<template>
  <div class="pb-4">
    <h3 class="text-2xl font-bold py-8">
      Regular Booking
    </h3>
  </div>
  <Separator />
  <div class="flex flex-col md:flex-row gap-4">
    <form class="space-y-8 pt-4 md:basis-1/2 md:m-8" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="user_id">
        <FormItem>
          <FormLabel>User</FormLabel>
          <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger >
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="item in users" :key="item" :value="String(item.id)">{{ item.name }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="date">
        <FormItem class="flex flex-col">
          <FormLabel>Date</FormLabel>
          <Popover>
            <PopoverTrigger as-child>
              <FormControl>
                <Button
                  variant="outline" :class="cn(
                    'ps-3 text-start font-normal justify-start',
                    !value && 'text-muted-foreground',
                  )"
                >
                  <span>{{ value ? df.format(toDate(value)) : "Pick a date" }}</span>
                </Button>
                <input hidden>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar
                v-model:placeholder="placeholder"
               
                v-model = "valuesForm.date"
                calendar-label="Date"
                initial-focus
                :min-value="today(getLocalTimeZone())"
                :max-value="maxDate"
                @update:model-value="(v) => {
                  if (v) {
                    setFieldValue('date', v.toString())
                  }
                  else {
                    setFieldValue('date', undefined)
                  }

                }"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Time Field -->
      <FormField v-slot="{ componentField }" name="time">
        <FormItem>
          <FormLabel>Time</FormLabel>
            <Select v-bind="componentField" v-model = "valuesForm.time">
              <FormControl>
                <SelectTrigger >
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                    <SelectItem
                    v-for="item in times"
                    :key="item"
                    :value="item"
                  >
                    {{ item }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="duration">
        <FormItem>
          <FormLabel>Duration</FormLabel>
          <Select v-bind="componentField" v-model = "valuesForm.duration">
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                  <SelectItem
                  v-for="item in durations"
                  :key="item"
                  :value="item"
                >
                  {{ item }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="type">
        <FormItem class="space-y-3">
          <FormLabel>Court Type</FormLabel>
          <FormControl>
            <RadioGroup
              class="flex flex-col space-y-1"
              v-bind="componentField"
              v-model = "valuesForm.type"
            >
              <FormItem class="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="full" />
                </FormControl>
                <FormLabel class="font-normal">
                  Full Court
                </FormLabel>
              </FormItem>
              <FormItem class="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="half" />
                </FormControl>
                <FormLabel class="font-normal">
                  Half Court
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="court_id">
        <FormItem>
          <FormLabel>Available Court</FormLabel>
          <Select v-bind="componentField" v-model="valuesForm.court">
              <FormControl>
                <SelectTrigger >
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="item in courtID" :key="item" :value="String(item.id)">{{ item.name }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          <FormMessage />
        </FormItem>
      </FormField>
      
      <div class="flex justify-start gap-2">
          <Button type="submit">
              Submit
          </Button>
          <NuxtLink to="/bookings">
          <Button type="button" variant="outline">
              Back
          </Button></NuxtLink>
      </div>
    </form>
    <div class="md:basis-1/2 pt-4 md:m-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-xl font-bold">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-show="valuesForm.court">
            <div class="py-4">
              <p class="text-s underline">
               Booking Details
              </p>
              <p class="text-s">
              Start Time: {{ valuesForm.start_time}}
              </p>
              <p class="text-s">
              End Time: {{ valuesForm.end_time }}
              </p>
              <p class="text-s">
              Court: {{ valuesForm.court }}
              </p>
            </div>
            <div class="py-4">
              <p class="text-s underline">
                Payment Details
              </p>
              <div class="text-s text-muted-foreground">
              Subtotal: RM{{ valuesForm.total}}
              </div>
              <div class="text-s text-muted-foreground">
              Tax: RM{{ valuesForm.tax }}
              </div>
              <div class="text-xl font-bold pt-2">
              Total: RM{{ valuesForm.total + valuesForm.tax }}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
