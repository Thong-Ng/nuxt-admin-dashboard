<script setup lang="ts">
import { BarChart } from '@/components/ui/chart-bar'

const data = [
  { name: 'Jan', POS: Math.floor(Math.random() * 1000), 'Online Checkout': Math.floor(Math.random() * 1000), 'Venue Manager': Math.floor(Math.random() * 1000) },
  { name: 'Feb', POS: Math.floor(Math.random() * 1000), 'Online Checkout': Math.floor(Math.random() * 1000), 'Venue Manager': Math.floor(Math.random() * 1000) },
  { name: 'Mar', POS: Math.floor(Math.random() * 1000), 'Online Checkout': Math.floor(Math.random() * 1000), 'Venue Manager': Math.floor(Math.random() * 1000) },
  { name: 'Apr', POS: Math.floor(Math.random() * 1000), 'Online Checkout': Math.floor(Math.random() * 1000), 'Venue Manager': Math.floor(Math.random() * 1000) },
  { name: 'May', POS: Math.floor(Math.random() * 1000), 'Online Checkout': Math.floor(Math.random() * 1000), 'Venue Manager': Math.floor(Math.random() * 1000) },
  { name: 'Jun', POS: Math.floor(Math.random() * 1000), 'Online Checkout': Math.floor(Math.random() * 1000), 'Venue Manager': Math.floor(Math.random() * 1000) },
  { name: 'Jul', POS: Math.floor(Math.random() * 1000), 'Online Checkout': Math.floor(Math.random() * 1000), 'Venue Manager': Math.floor(Math.random() * 1000) },
]
</script>

<template>
  <BarChart
    index="name"
    :data="data"
    :categories="['POS', 'Online Checkout', 'Venue Manager']"
    
    :colors="['#4A628A', '#7AB2D3', '#B9E5E8']"
    :y-formatter="(tick, i) => {
      return typeof tick === 'number'
        ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
        : ''
    }"
    :type="'stacked'"
  />
</template>