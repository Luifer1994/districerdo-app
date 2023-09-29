<script setup lang="ts">
import { useAuthStore } from "@/stores/auth/authStore";
</script>
<template>
  <v-card>
    <div class="d-flex flex-no-wrap justify-space-between">
      <div class="ml-5">
        <h3 class="h3 title overlay-title font-weight-medium mb-1 mt-4">
          Bienvenido, {{ useAuthStore().userLoged.name }}
        </h3>
        <span class="subtitle-1 font-weight-light grey--text">
          Espero tengas un día excelente y bendecido
        </span>

        
      </div>

      <v-avatar class="ma-3" size="125" rounded="0">
        <img
          src="@/assets/images/background/welcome-bg2-2x-svg.svg"
          style="justify-content: right; align-items: right; width: 100px; height: 100px"
        />
      </v-avatar>
    </div>
  </v-card>
</template>

<style scoped>
.overlay-title {
  position: relative;
  z-index: 1;
}
</style>
