<script setup lang="ts">
import { RouterView } from "vue-router";
import VerticalSidebarVue from "./vertical-sidebar/VerticalSidebar.vue";
import VerticalHeaderVue from "./vertical-header/VerticalHeader.vue";
import Customizer from "./customizer/Customizer.vue";
import { useCustomizerStore } from "@/stores/customizer";
import Loading from "../../components/Loading.vue";
const customizer = useCustomizerStore();
</script>

<template>
  <v-app
    :theme="customizer.darktheme ? 'dark' : 'light'"
    :class="[
      customizer.mini_sidebar ? 'mini-sidebar' : '',
      customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
    ]"
  >
    <Customizer />
    <VerticalSidebarVue v-if="!customizer.setHorizontalLayout" />
    <VerticalHeaderVue v-if="!customizer.setHorizontalLayout" />
    <v-main>
      <v-container fluid>
        <Loading />
        <RouterView />
        <v-btn
          class="customizer-btn"
          icon="mdi-cog"
          size="small"
          flat
          @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
        >
        </v-btn>
      </v-container>
      <v-footer app inset>
        <v-spacer></v-spacer>
        <div class="overline">
          Construido con <v-icon small color="pink">mdi-heart</v-icon>
          <a
            class="text-decoration-none"
            style="color: #0096c7"
            href="https://www.facebook.com/luifer.almendrales"
            target="_blank"
            >Luifer Almendrales</a
          >
        </div>
      </v-footer>
    </v-main>
  </v-app>
</template>
