<template>
  <v-app-bar
    :color="customizer.darktheme ? '' : customizer.navbarColor"
    elevation="0"
    :priority="priority"
    :class="['v-topbar', customizer.navbarColor == '#f6f6f6' ? '' : 'text-white']"
  >
    <v-btn
      class="hidden-sm-and-down"
      color="inherit"
      icon
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
    >
      <vue-feather type="menu" size="16"></vue-feather>
    </v-btn>

    <!-- <v-app-bar-nav-icon
      class="hidden-sm-and-down"
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
    /> -->
    <v-app-bar-nav-icon
      color="inherit"
      class="hidden-md-and-up"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
    />
    <v-spacer />
    <!-- ---------------------------------------------- -->
    <!---right part -->
    <!-- ---------------------------------------------- -->
    <!-- ---------------------------------------------- -->
    <!-- User Profile -->
    <!-- ---------------------------------------------- -->
    <v-menu anchor="bottom end" origin="auto" min-width="300">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          class="pa-0 px-1"
          elevation="0"
          color="transparent"
          plain
          :ripple="false"
        >
          <v-avatar size="35">
            <img src="@/assets/images/users/user2.jpg" alt="Julia" />
          </v-avatar>
        </v-btn>
      </template>

      <v-list class="pa-6" elevation="10" rounded="lg" >
        <h4 class="font-weight-medium fs-18">Perfil de usuario</h4>
        <div class="d-flex align-center my-4">
          <img
            src="@/assets/images/users/user2.jpg"
            alt="Julia"
            class="rounded-circle"
            width="90"
          />
          <div class="ml-4">
            <h4 class="font-weight-medium fs-18"> 
              {{ authStore.userLoged.name }}
            </h4>
            <span class="subtitle-2 font-weight-light">
              {{ this.userRole() }}
            </span>
            <div class="d-flex align-center">
              <vue-feather type="mail" size="16" class="d-flex grey--text"></vue-feather>
              <span class="subtitle-2 font-weight-light ml-1">
                {{ authStore.userLoged.email }}
              </span>
            </div>
          </div>
        </div>
        <v-list-item
          class="pa-3 mb-2"
          title="My perfil"
          subtitle="Configuración de perfil"
          rounded="lg"
        >
        </v-list-item>
        <v-btn
          block
          color="secondary"
          variant="flat"
          class="mt-4 py-4"
          @click="authStore.logout()"
        >
          Cerrar sesión
        </v-btn>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useCustomizerStore } from "@/stores/customizer";
import { useAuthStore } from "@/stores/auth/authStore";
const customizer = useCustomizerStore();
const authStore = useAuthStore();
const showSearch = ref(false);
const priority = ref(customizer.setHorizontalLayout ? 0 : 0);
function searchbox() {
  showSearch.value = !showSearch.value;
}
watch(priority, (newPriority) => {
  // yes, console.log() is a side effect
  priority.value = newPriority;
});
</script>
