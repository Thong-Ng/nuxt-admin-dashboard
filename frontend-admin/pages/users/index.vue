<script setup>
import { columns } from '@/components/users/components/columns'
import DataTable from '@/components/users/components/DataTable.vue'

const { data, refresh } = await useFetchAPI('/users');
provide('userListRefresh', refresh);
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold pt-8">
          Users
        </h2>
      </div>
    </div>
    <div>
        <DataTable :data="data" :columns="columns" />
    </div>
  </div>
</template>

<style scoped>

</style>
