<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Courts } from '../data/schema'
import { computed } from 'vue'

interface DataTableRowActionsProps {
  row: Row<Courts>
}
const props = defineProps<DataTableRowActionsProps>()

const court = computed(() => props.row.original)

const { $useAPI, $toast } = useNuxtApp();

const listRefresh = inject('courtListRefresh');

const actionEdit = async (id: number) => {
  await navigateTo('/courts/' + id);
};

const actionDelete = async (id: number) => {
  $toast.loading('Please wait...');

  try {
    await $useAPI('/courts/' + encodeURIComponent(id), {
      method: 'DELETE',
    });
    listRefresh();

    $toast.dismiss();
    $toast.success('Court has been deleted.');
  }
  catch (error) {
    console.error(error);
    $toast.dismiss();
    $toast.error('Court deletion error!');
  }
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="h-8 w-8 flex p-0 data-[state=open]:bg-muted"
      >
        <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem @click="actionEdit(court.id)" >Edit</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="actionDelete(court.id)">
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
