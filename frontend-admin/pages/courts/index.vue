<script setup>
import { columns } from '@/components/courts/components/columns'
import DataTable from '@/components/courts/components/DataTable.vue'

const { data, refresh } = await useFetchAPI('/courts');
provide('courtListRefresh', refresh);
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold pt-8">
          Courts
        </h2>
      </div>
      <div>
        <Button
        size="sm"
        class="ml-auto hidden h-8 lg:flex rounded-lg gap-2"
        @click="navigateTo('/courts/new')"
      >
      Add Court
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
