import type { ColumnDef } from '@tanstack/vue-table'
import type { Bookings } from '../data/schema'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns: ColumnDef<Bookings>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Booking ID' }),
    cell: ({ row }) => h('div', { class: 'w-10 flex justify-center' }, row.getValue('id')),
    enableHiding: false,
  },
  {
    accessorKey: 'court_id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Court ID' }),
  
    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('court_id')),
      ])
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Court Type' }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('type')),
      ])
    },
  },
  {
    accessorKey: 'user_id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'User ID' }),
  
    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('user_id')),
      ])
    },
  },
  {
    accessorKey: 'start_time',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Start Time' }),
  
    cell: ({ row }) => {
      const formattedStartTime = new Date(row.getValue('start_time')).toLocaleString('en-GB', {
        timeZone: 'Asia/Kuala_Lumpur',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate font-medium' }, formattedStartTime),
      ])
    },
  },
  {
    accessorKey: 'end_time',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'End Time' }),
  
    cell: ({ row }) => {
      const formattedEndTime = new Date(row.getValue('end_time')).toLocaleString('en-GB', {
        timeZone: 'Asia/Kuala_Lumpur',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate font-medium' }, formattedEndTime),
      ])
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Total' }),
  
    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('total')),
      ])
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [       
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('status')),
      ])
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
