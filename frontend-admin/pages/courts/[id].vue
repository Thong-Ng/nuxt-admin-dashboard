<script setup>
const { $useAPI } = useNuxtApp();
const { id } = useRoute().params;
const data = await $useAPI('/courts/' + encodeURIComponent(id));
</script>

<template>
  <div class="flex flex-col gap-4 lg:gap-6 max-w-4xl">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">
        Court Details
      </h1>
    </div>
    <CourtsComponentsDetailsUpdate :data="data" />
  </div>
</template>