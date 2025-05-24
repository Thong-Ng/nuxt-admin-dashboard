<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Bookings } from '../data/schema'
import { computed } from 'vue'

interface DataTableRowActionsProps {
  row: Row<Bookings>
}
const props = defineProps<DataTableRowActionsProps>()

const court = computed(() => props.row.original)

const { $useAPI, $toast } = useNuxtApp();

const listRefresh = inject('bookingListRefresh');

const actionEdit = async (id: number) => {
  await navigateTo('/bookings/' + id);
};

const actionDelete = async (id: number) => {
  $toast.loading('Please wait...');

  try {
    await $useAPI('/bookings/' + encodeURIComponent(id), {
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
      <DropdownMenuItem @click="actionEdit(court.id)">Edit</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="actionDelete(court.id)">
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
