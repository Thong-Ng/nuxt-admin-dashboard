<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Bookings } from '../data/schema'
import { computed } from 'vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

interface DataTableToolbarProps {
  table: Table<Bookings>
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>

<template>
  <div class="flex items-center justify-between">
    <DataTableViewOptions :table="table" />
  </div>
</template>
