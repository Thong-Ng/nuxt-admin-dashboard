<script setup>
import { useForm } from 'vee-validate'
import { ref, reactive, watch } from 'vue'
import { ChevronsUpDown } from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'

const router = useRouter();
const { $useAPI, $toast } = useNuxtApp();
const props = defineProps(['data']);
const booking = props.data;
const isOpen = ref(false);
const userObject = ref();
const courtObject = ref();
const isDialogOpen = ref(false);
const cancellation_reason = ref("");

onMounted(async () => {
  try {
    cancellation_reason.value = booking.cancellation_reason;
  } catch (error) {
    console.error('Error fetching cancellation_reason:', error);
  }
});

async function getUsername() {
try {
  const response = await $useAPI('/user/'+ encodeURIComponent(booking.user_id));
  return response;
}
catch (error) {
  console.error(error);
  return 0;
}
}
userObject.value = await getUsername();
const user = userObject.value;

async function getCourtName() {
try {
  const response = await $useAPI('/courts/'+ encodeURIComponent(booking.court_id));
  return response.name;
}
catch (error) {
  console.error(error);
  return 0;
}
}
courtObject.value = await getCourtName();
const courtName = courtObject.value;

const { handleSubmit, resetForm, values, setFieldValue } = useForm({
  // validationSchema: bookingFormSchema,
  initialValues: {
    name: user.name ? user.name : undefined,
    phone: user.phone ? user.phone  : undefined,
    email: user.email ? user.email : undefined,
    status: booking.status ? booking.status : undefined,
    notes: booking.notes ? booking.notes : undefined,
  }
})

const onSubmit = handleSubmit(async(values) => {
  $toast.loading('Please wait...');

  try {

    const response = await $useAPI('/bookings/'+ encodeURIComponent(booking.id), {
      method: 'PUT',
      body: {
        id: booking.id,
        notes: values.notes,
        user_phone: values.phone,
        user_email: values.email,
        status: values.status,
      }
    });
    resetForm();
    $toast.dismiss();
    $toast.success('Booking has been updated.');
    router.push('/bookings');
  }
  catch (error) {
    console.error('Booking update error:', error);
    $toast.dismiss();
    $toast.error('Booking update error!');
  }
})

const onOpenCancel = async() =>{
  isDialogOpen.value = true;
}

const onCloseCancel = async() =>{
  isDialogOpen.value = false;
}

const onConfirmCancel = async() =>{
  try {

  const response = await $useAPI('/bookings/'+ encodeURIComponent(booking.id), {
    method: 'PUT',
    body: {
      id: booking.id,
      cancellation_reason: cancellation_reason.value,
      status: "cancelled",
    }
  });
  $toast.dismiss();
  $toast.success('Cancellation reason has been updated.');
  router.push("/bookings");
  }
  catch (error) {
  console.error('Reason update error:', error);
  $toast.dismiss();
  $toast.error('Reason update error!');
  }
}

const downloadPDF = async () => {
  const container = document.getElementById('pdf-content')
  container.style.paddingBottom = '60px'

  const pdfHeader = document.createElement('div')
  pdfHeader.id = 'pdf-header'
  pdfHeader.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2>Invoice #${booking.id}</h2>
    </div>
  `
  const footer = document.createElement('div')
  footer.id = 'pdf-footer'
  footer.innerHTML = `
    <hr style="margin-top: 40px;" />
    <p style="text-align: center; font-size: 12px; margin-top: 10px;">
      © 2025 Casey Booking – All rights reserved.
    </p>
  `

  // Insert the title before the table
  container.insertBefore(pdfHeader, container.firstChild)
  container.appendChild(footer)

  // Wait for DOM update
  await nextTick()
    const inputs = document.querySelectorAll('#pdf-content input')
  inputs.forEach((input) => {
    input.style.height = '40px'
    input.style.paddingBottom = '4px'
    input.style.fontSize = '14px'
  })

  await html2pdf().from(container).set({
    margin: 1,
    filename: 'invoice.pdf',
    html2canvas: { scale: 2, windowWidth: container.scrollWidth, windowHeight: container.scrollHeight },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
  }).save()

  pdfHeader.remove()
  footer.remove()
   container.style.paddingBottom = ''
}
</script>

<template>

<form class="flex flex-row gap-4" @submit="onSubmit">
  <div class="flex flex-col gap-4 md:basis-2/3" id="pdf-content">
    <Card>
      <CardContent class="grid grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel class="text-base">Customer  
              <NuxtLink :to="`/users/${booking.user_id}`" target="_blank" rel="noopener noreferrer">
                <i class="underline">(view)</i>
              </NuxtLink>
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" disabled/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel class="text-base">Phone Number</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel class="text-base">Email Address</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
      </CardContent>
    </Card>

    <Card>
      <CardContent>
        <p><strong>Date: </strong> {{ new Date(booking.start_time).toLocaleDateString('en-GB', { timeZone: 'UTC' }) }}</p>
        <p><strong>Time:</strong> {{ new Date(booking.start_time).toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            hour12: true 
        }).toUpperCase() }} -  {{ new Date(booking.end_time).toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            hour12: true 
        }).toUpperCase() }}</p>
        <p><strong>Court:</strong> {{ courtName }}</p>

        <Separator class="!mt-4 mb-4"/>

        <p class="flex justify-between w-4/5">
          <strong>Sub Total</strong> <span>RM{{ booking.sub_total ?? "N/A" }}</span>
        </p>               
        <p class="flex justify-between w-4/5">
          <strong>Tax</strong> <span>RM{{ booking.tax ?? "N/A" }}</span>
        </p>   
        <p class="flex justify-between w-4/5">
          <strong>Discount</strong> <span>-RM{{ booking.discount ?? "N/A" }}</span>
        </p>     
        
        <Separator class="!mt-4 mb-4"/>

        <p class="flex justify-between w-4/5">
          <strong>Total</strong> <span>RM{{ booking.total ?? "N/A" }}</span>
        </p> 
      
      </CardContent>
    </Card>

    <Card>
      <CardContent class="space-y-2">
      <FormField v-slot="{ componentField }" name="notes">
        <FormItem>
          <FormLabel class="text-base">Customer Notes</FormLabel>
          <FormControl>
            <Textarea placeholder="Type your notes here." v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      </CardContent>
    </Card>
  </div>
  <div class="md:basis-1/3">
    <Card>
      <CardContent class="space-y-4">
      <p><strong>Created At:</strong> <br><client-only>{{ new Date(booking.created_at).toLocaleString('en-GB', { timeZone: 'UTC', hour12: true }) }}</client-only></p>

      <FormField v-slot="{ componentField }" name="status">
        <FormItem>
          <FormLabel class="font-bold text-base">Status</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="pending">
                  Pending
                </SelectItem>
                <SelectItem value="confirmed">
                  Confirmed
                </SelectItem>
                <SelectItem value="cancelled" disabled>
                  Cancel
                </SelectItem>
                <SelectItem value="completed">
                  Complete
                </SelectItem>
                <SelectItem value="failed">
                  Failed
                </SelectItem>
                <SelectItem value="trash">
                  Trash
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
        <div class="flex flex-row justify-between">
          <Button type="submit" >
            Update
          </Button>
          <Dialog :open="isDialogOpen">
            <DialogTrigger as-child>
              <Button variant="destructive" @click="onOpenCancel">
                Cancel Booking
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh] [&>button]:hidden"  
            @interact-outside="event => {event.preventDefault()}">
              <DialogHeader class="p-6 pb-0">
                <DialogTitle>Cancel</DialogTitle>
                <DialogDescription class="flex flex-row gap-2 justify-start text-sm"></DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4 overflow-y-auto px-6">
                <Label for="message">Reason</Label>
                <Textarea v-model="cancellation_reason" placeholder="Type the reason here." />
              </div>
              <DialogFooter class="p-6 pt-0">
                <Button @click="onConfirmCancel">
                  Confirm
                </Button>
                <DialogClose aria-label="Close">
                  <Button variant="destructive" @click="onCloseCancel">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Collapsible
          v-model:open="isOpen"
          class="space-y-2"
        >
          <div class="flex items-center justify-start text-muted-foreground">
            <h4 class="text-sm font-semibold">
              More Actions
            </h4>
            <CollapsibleTrigger as-child>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown class="h-4 w-4" />
                <span class="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent class=" flex flex-col space-y-2">
              <Dialog>
                <DialogTrigger as-child>
                  <Button>
                    Payment Link
                    </Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Payment Link</DialogTitle>
                    <DialogDescription>
                      Payment System not yet integrated
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>          
            <Button type="button" @click="downloadPDF">
              Download Invoice
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  </div>
</form>

</template>