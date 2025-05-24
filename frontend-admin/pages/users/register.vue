<script setup lang="ts">

</script>

<template>
    <div class="grid">
      <div class="flex flex-col text-left space-y-2 sticky top-0 z-10">
        <h3 class="text-2xl font-bold py-8">
          Add New Customer
        </h3>
      </div>
      <Separator />

      <div class="overflow-y-auto max-h-[calc(100vh-100px)] p-8">
        <AuthSignUp />
      </div>
      
    </div>
</template>

<style scoped>

</style>
