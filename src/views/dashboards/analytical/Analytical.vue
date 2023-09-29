<script setup lang="ts">
import { ref } from "vue";
import WelcomeCard from "../dashboardComponents/analytical/welcome-card/WelcomeCard.vue";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import TheEarnings from "@/views/dashboards/dashboardComponents/analytical/earnings/TheEarnings.vue";
import MonthlyRevenue from "@/views/dashboards/dashboardComponents/analytical/monthly-revenue/MonthlyRevenue.vue";
import TheSalesOverview from "@/views/dashboards/dashboardComponents/analytical/sales-overview/TheSalesOverview.vue";

const page = ref({ title: "Panel de control" });
const breadcrumbs = ref([
  {
    text: "Inicio",
    disabled: false,
    href: "#",
  }
]);
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" sm="12" lg="6">
      <WelcomeCard />
    </v-col>
    <v-col cols="12" sm="12" lg="3" xl="3" xxl="3">
      <TheEarnings></TheEarnings>
    </v-col>
    <v-col cols="12" sm="12" lg="3" xl="3" xxl="3">
      <MonthlyRevenue></MonthlyRevenue>
    </v-col>
  </v-row>
</template>
