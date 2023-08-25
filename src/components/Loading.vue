<template>
  <div class="text-center">
    <v-dialog v-model="LoadingStore.dialog" hide-overlay persistent width="300" height="300">
      <v-card color="primary" height="100">
        <div class="d-flex justify-center mt-2">
          <h5 class="headline">Cargando...</h5>
        </div>
        <div class="d-flex justify-center">
          <v-progress-circular
            :size="60"
            :width="10"
            color="white"
            indeterminate
          ></v-progress-circular>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from "@/stores/loadingStore";
const LoadingStore = useLoadingStore();
</script>
