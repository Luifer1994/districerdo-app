<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" sm="12">
      <List v-if="!InvoiceStore.newInvoice"></List>
      <CreateOrUpdate v-else></CreateOrUpdate>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import List from "@/components/Invoices/List.vue";
import CreateOrUpdate from "@/components/Invoices/CreateInvoice.vue";
import { useInvoiceStore } from "@/stores/invoices/invoiceStore";

const InvoiceStore = useInvoiceStore();
const page = ref({ title: "Facturación" });
const breadcrumbs = ref([
  {
    text: "Facturación",
    disabled: false,
    href: "#",
  },
  {
    text: "Listado de facturas",
    disabled: true,
    href: "#",
  },
]);

//mounted
onMounted(() => {
  console.log("mounted");
});
</script>
