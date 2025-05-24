<script setup>
import { columns } from '@/components/bookings/components/columns'
import DataTable from '@/components/bookings/components/DataTable.vue'

const { data, refresh } = await useFetchAPI('/bookings');
provide('bookingListRefresh', refresh);
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold pt-8">
          Bookings
        </h2>
      </div>
      <div>
        <Button
        size="sm"
        class="ml-auto hidden h-8 lg:flex rounded-lg gap-2"
        @click="navigateTo('/bookings/new')"
      >
        Add Booking
        <Icon name="i-lucide-plus" class="h-3 w-3" />
      </Button>
      </div>
    </div>
    <div>
        <DataTable :data="data" :columns="columns" />
    </div>
  </div>
</template>

<style scoped>

</style>
