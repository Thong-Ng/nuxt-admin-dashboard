<script setup lang="ts">
import { Activity, ArrowUpRight, Ticket, DollarSign, Users, ArrowUp, ArrowDown } from 'lucide-vue-next'
import Preloader from '~/components/Preloader.vue';
import { useNuxtApp } from '#app';
const isLoading = ref(true);
const nuxtApp = useNuxtApp();
nuxtApp.hook('page:finish', () => {
  isLoading.value = false;
});

const thisRev = 17862;
const lastRev = 15433;
const thisBooking = 327;
const lastBooking = 331;
const activeUser = 187;
const totalUser = 233;

const upRev = ((thisRev - lastRev)/lastRev * 100).toFixed(1)
const downRev = ((lastRev - thisRev)/lastRev * 100).toFixed(1)
const upBooking = (( thisBooking - lastBooking) / lastBooking * 100).toFixed(1)
const downBooking = ((lastBooking - thisBooking) / lastBooking * 100).toFixed(1)
const activeUserPercent = ( activeUser / totalUser * 100).toFixed(1)
</script>

<template>
  <!-- <Preloader v-if="isLoading" /> -->
  <div class="w-full flex flex-col gap-8">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-3xl font-bold">
        Dashboard
      </h2>
      <!-- <div class="flex items-center space-x-2">
        <BaseDateRangePicker />
        <Button>Download</Button>
      </div> -->
    </div>
    <main class="flex flex-1 flex-col gap-4 md:gap-8">
      <div class="grid gap-4 md:gap-8">
        <Card>
          <CardContent class="flex flex-col lg:flex-row justify-center gap-10 items-center xl:gap-15">
            <div class="flex flex-row items-center gap-2">
              <div class="rounded-full p-4 bg-[#27548A]/30">
                <DollarSign class="h-8 w-8 text-[#27548A]" />
              </div>
              <div>
                <div class="text-sm">
                  Total Revenue
                </div>
                <div class="text-2xl font-bold">
                  ${{thisRev}}
                </div>
                <p class="flex gap-1 text-xs text-muted-foreground" v-if="thisRev > lastRev">
                  <span class="text-green flex"><ArrowUp class="h-4 w-4"/>{{ upRev }}% </span> this month
                </p>
                <p class="flex gap-1 text-xs text-muted-foreground" v-if="thisRev < lastRev">
                  <span class="text-red flex"><ArrowDown class="h-4 w-4"/>{{ downRev }}% </span>this month
                </p>
              </div>
            </div>
            <Separator orientation="vertical" class="h-20 max-lg:hidden"/>
            <div class="flex flex-row items-center gap-2">
              <div class="rounded-full p-4 bg-[#27548A]/30">
                <Ticket class="h-8 w-8 text-[#27548A]" />
              </div>
              <div>
                <div class="text-sm">
                  Total Booking
                </div>
                <div class="text-2xl font-bold">
                 {{thisBooking}}
                </div>
                <p class="flex gap-1 text-xs text-muted-foreground" v-if="thisBooking > lastBooking">
                  <span class="text-green flex"><ArrowUp class="h-4 w-4"/>{{ upBooking }}% </span> this month
                </p>
                <p class="flex gap-1 text-xs text-muted-foreground" v-if="thisBooking < lastRev">
                  <span class="text-red flex"><ArrowDown class="h-4 w-4"/>{{ downBooking }}%</span>this month
                </p>
              </div>
            </div>
            <Separator orientation="vertical" class="h-20 max-lg:hidden"/>
            <div class="flex flex-row items-center gap-2 min-w-[190px]">
              <div class="rounded-full p-4 bg-[#27548A]/30">
                <Users class="h-8 w-8 text-[#27548A]" />
              </div>
              <div>
                <div class="text-sm">
                  Active User
                </div>
                <div class="text-2xl font-bold">
                 {{ activeUser }}
                </div>
                <p class="flex gap-1 text-xs text-muted-foreground">
                 {{ activeUserPercent }}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-4 space-y-0">
            <CardTitle class="text-sm font-medium">
              Bookings Analytics
            </CardTitle>          
          </CardHeader>
          <CardContent>
            <DashboardBooking />
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
