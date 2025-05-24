<script setup>
import { ref, computed } from 'vue';
import { startOfWeek, format, parseISO } from 'date-fns';

const rawData = ref([
  { date: '2024-10-01', Bookings: 50 },
  { date: '2024-10-02', Bookings: 40 },
  { date: '2024-10-03', Bookings: 50 },
  { date: '2024-10-04', Bookings: 40 },
  { date: '2024-10-05', Bookings: 50 },
  { date: '2024-10-06', Bookings: 40 },
  { date: '2024-10-07', Bookings: 50 },
  { date: '2024-10-08', Bookings: 40 },
  { date: '2024-10-09', Bookings: 60 },
  { date: '2024-10-10', Bookings: 30 },
  { date: '2024-12-05', Bookings: 20 },
  { date: '2024-11-05', Bookings: 50 },
  { date: '2024-11-06', Bookings: 40 },
  { date: '2024-11-07', Bookings: 50 },
  { date: '2024-11-08', Bookings: 40 },
  { date: '2024-12-09', Bookings: 60 },
  { date: '2024-12-10', Bookings: 30 },
  { date: '2024-12-05', Bookings: 20 },
  
]);

const selectedGranularity = ref('day');

function processData(granularity) {
  const data = rawData.value;
  if (granularity === 'day') {
    return data.map((item) => ({
      date: format(parseISO(item.date), 'MMM dd'),
      Bookings: item.Bookings,
    }));
  } else if (granularity === 'month') {
    const groupedByMonth = data.reduce((acc, item) => {
      const month = format(parseISO(item.date), 'MMM yyyy'); 
      acc[month] = (acc[month] || 0) + item.Bookings;
      return acc;
    }, {});
    return Object.entries(groupedByMonth).map(([date, Bookings]) => ({
      date,
      Bookings,
    }));
  } else if (granularity === 'week') {
    const groupedByWeek = data.reduce((acc, item) => {
      const weekStart = format(startOfWeek(parseISO(item.date)), 'MMM dd, yyyy'); // Get the start of the week
      acc[weekStart] = (acc[weekStart] || 0) + item.Bookings;
      return acc;
    }, {});
    return Object.entries(groupedByWeek).map(([date, Bookings]) => ({
      date,
      Bookings,
    }));
  }
}

const chartData = computed(() => processData(selectedGranularity.value));
</script>

<template>
  <div>
    <div class="grid controls justify-items-end pb-2">
      <select class=" border rounded-lg p-1" v-model="selectedGranularity">
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
    </div>
    <AreaChart
      :data="chartData"
      index="date"
      :categories="['Bookings']"
      :colors="['#27548A']"
    />
  </div>
</template>
