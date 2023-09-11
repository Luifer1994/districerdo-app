<template>
  <div class="">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
const page = ref({ title: "Compras" });
</script>
