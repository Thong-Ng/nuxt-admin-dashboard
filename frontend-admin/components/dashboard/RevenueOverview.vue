<script setup lang="ts">
import { AreaChart } from '@/components/ui/chart-area'
import { CurveType } from '@unovis/ts'

const data = [
  {
    'day': "Monday",
    'revenue': Math.floor(Math.random() * 500),
  },
  {
    'day': "Tuesday",
    'revenue': Math.floor(Math.random() * 500),
  },
  {
    'day': "Wednesday",
    'revenue': Math.floor(Math.random() * 500),
  },
  {
    'day': "Thursday",
    'revenue': Math.floor(Math.random() * 500),
  },
  {
    'day': "Friday",
    'revenue': Math.floor(Math.random() * 500),
  },
  {
    'day': "Saturday",
    'revenue': Math.floor(Math.random() * 500),
  },
  {
    'day': "Sunday",
    'revenue': Math.floor(Math.random() * 500),
  },
]
</script>

<template>
  <AreaChart
    :data="data"
    index="day"
    :categories="['revenue']"
    :colors="['#4A628A']"
    :show-legend="false"
    :curve-type="CurveType.Linear"
  />
</template>