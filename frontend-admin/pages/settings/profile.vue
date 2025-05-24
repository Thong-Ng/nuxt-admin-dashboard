<script setup>
const { data } = useAuth();

const id = data.value.user_id;
const { data: user, error } = await useFetchAPI('/user/' + encodeURIComponent(id));
</script>

<template>
  <div class="flex flex-col gap-4">
    <SettingsProfileForm :user="user"/>
    <UsersComponentsPasswordChange :id="id"/>
  </div>
</template>

<style scoped>

</style>
