<script setup>
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ArrowUpRight } from 'lucide-vue-next'

const selectedEvent = ref(null);
const dialogOpen = ref(false);

const { $useAPI } = useNuxtApp();
const { data: events } = await useAsyncData('bookings', async () => {
  const response = await $useAPI('/bookings', {
    params: { start_time: new Date().toISOString() }
  });
  // console.log(response);
  return response.map(event => ({
    title: "#" + event.id,
    start: new Date(event.start_time).toISOString(),
    extendedProps: {
        id: event.id,
        description: `
        Time: ${new Date(event.start_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true})} - ${new Date(event.end_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true})} <br> 
        User ID: ${event.user_id} <br> 
        Court ID: ${event.court_id} <br> `
    }
  }));
});


const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  eventTimeFormat: { 
    hour: '2-digit',
    minute: '2-digit',
    meridiem: true 
  },
  events: events.value,
  eventColor: '#378006',
  headerToolbar: {
  start: 'prev',
  center: 'title',
  end: 'next'
},
  dayMaxEventRows: true,
  views: {
    dayGrid: {
      dayMaxEventRows: 3
    }
  },
  eventClick: function(info) {
    selectedEvent.value = info.event.extendedProps;
    dialogOpen.value = true;
  },
  height: 600,
  aspectRatio: 2,
});


const fullCalendar = ref(null);
const calendarContainer = ref(null);
let resizeObserver = null;

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    nextTick(() => {
      fullCalendar.value.getApi().updateSize();
    });
  });

  if (calendarContainer.value) {
    resizeObserver.observe(calendarContainer.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<template>
  <div ref="calendarContainer">
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
  </div>
  <Dialog v-model:open="dialogOpen">
  <DialogTrigger as="button"></DialogTrigger> <!-- Hidden trigger -->
  <DialogContent class="w-64 bg-white p-4 rounded-lg shadow-lg">
    <DialogHeader>
      <DialogTitle>Booking Details #{{selectedEvent.id}}</DialogTitle>
      <DialogDescription></DialogDescription>
    </DialogHeader>
    <p v-if="selectedEvent" v-html="selectedEvent.description"></p>
    <DialogFooter>
      <!-- <Button @click="dialogOpen = false">Close</Button> -->
      <NuxtLink :to="{ name: 'bookings-id', params: { id: selectedEvent.id } }">
        <Button size="sm" class="ml-auto gap-1">
        View
        <ArrowUpRight class="h-4 w-4" />
      </Button>
  </NuxtLink>
    </DialogFooter>
  </DialogContent>
</Dialog>

</template>

<style>
.fc .fc-daygrid-day.fc-day-today {
    background-color: #28548a;
    color: white;
}

.fc .fc-button-primary {
    background-color:  #28548a;
    border-color:  #28548a;
    color: var(--fc-button-text-color);
}

.fc .fc-button-primary:hover {
    background-color: rgba(4, 34, 68, 0.689);
    border-color:  transparent;
    color: var(--fc-button-text-color);
}
</style>