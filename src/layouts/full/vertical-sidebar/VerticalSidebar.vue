<script setup lang="ts">
import { ref, watch } from "vue";
import { useCustomizerStore } from "@/stores/customizer";
import sidebarItems from "./sidebarItem";
import LogoLight from "../logo/LogoLight.vue";
import LogoDark from "../logo/LogoDark.vue";

const customizer = useCustomizerStore();
const sidebarMenu = ref(sidebarItems);
</script>

<template>
  <v-navigation-drawer
    left
    :permanent="$vuetify.display.mdAndUp"
    v-model="customizer.Sidebar_drawer"
    elevation="10"
    :class="customizer.SidebarColor == 'white' ? '' : 'text-white'"
    :color="customizer.darktheme ? '' : customizer.SidebarColor"
    rail-width="75"
    mobile-breakpoint="960"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <!-- ---------------------------------------------- -->
    <!---Logo part -->
    <!-- ---------------------------------------------- -->
    <div class="pa-4">
      <LogoDark v-if="!customizer.darktheme && customizer.SidebarColor == 'white'" />
      <LogoLight v-else />
    </div>
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4" color="transparent">
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <div v-if="validatePermission([item.permission])">
            <v-list-subheader v-if="item.header">{{ item.header }}</v-list-subheader>
            <v-list-group v-else-if="item.children" class="">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :value="item.title" rounded="lg" class="mb-1">
                  <template v-slot:prepend>
                    <vue-feather
                      :type="item.icon"
                      class="feather-sm v-icon"
                    ></vue-feather>
                  </template>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item>
              </template>
              <template v-for="subitem in item.children" :key="subitem">
                <v-list-item
                  :value="subitem.to"
                  :to="subitem.to"
                  rounded="lg"
                  class="first-level-item mb-1"
                  v-if="validatePermission([subitem.permission])"
                >
                  <template v-slot:prepend>
                    <vue-feather
                      :type="subitem.icon"
                      class="feather-sm v-icon v-icon--size-default"
                    ></vue-feather>
                  </template>
                  <v-list-item-title v-text="subitem.title"></v-list-item-title>
                </v-list-item>
              </template>
            </v-list-group>
            <v-list-item v-else :key="i" :to="item.to" rounded="lg" class="mb-1">
              <template v-slot:prepend>
                <vue-feather
                  :type="item.icon"
                  class="feather-sm v-icon v-icon--size-default"
                ></vue-feather>
              </template>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item>
          </div>
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
<style scoped>
.v-list-item--density-default.v-list-item--one-line {
  min-height: 30px;
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
