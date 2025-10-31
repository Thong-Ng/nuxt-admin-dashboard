<script setup lang="ts">
import Preloader from '~/components/Preloader.vue';
const isLoading = ref(false);
onMounted(() => {
  const router = useRouter();
  router.beforeEach((to, from, next) => {
    isLoading.value = true; 
    next();
  });
  router.afterEach(async () => {
    await nextTick();
    setTimeout(() => {
      isLoading.value = false;
    }, 2000);
  });
});
</script>

<template>
  <!-- <Preloader v-if="isLoading" /> -->
  <SidebarProvider>
    <LayoutAppSidebar />
    <SidebarInset>
      <LayoutHeader />
      <div class="min-w-0 w-full flex-1 overflow-x-auto p-4 lg:p-6  light:bg-[#FFFDF6] dark:bg-[#0C2B4E]">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>

</style>
