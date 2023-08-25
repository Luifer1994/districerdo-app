<template>
  <RouterView></RouterView>
  <notifications position="bottom right" />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>
<style>
.vue-notification {
  margin: 0 5px 5px;
  padding: 10px;
  font-size: 16px;
  color: #ffffff;

  background: #44a4fc;
  border-left: 5px solid #187fe7;
}
</style>
