<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <div v-if="invoiceStore.invoice.id">
    <v-card>
      <v-card-text>
        <v-sheet>
          <h6 class="text-h6">
            Cliente: {{ invoiceStore.invoice.client.full_name }}
          </h6>
          <h2 class="text-h6">
            Fecha de factura: {{ invoiceStore.invoice.created_at }}
          </h2>
          <h2 class="text-h6">
            Estado de factura:
            <v-badge
              :color="invoiceStore.invoice.state === 'Pendiente' ? 'error' : 'success'"
              :content="invoiceStore.invoice.state"
              inline
            ></v-badge>
          </h2>
        </v-sheet>
      </v-card-text>
    </v-card>
    <h2 class="text-h5 font-weight-bold mx-2 my-4">Listado de productos de la factura</h2>
    <v-card
      class="mt-2"
      v-for="(item, index) in invoiceStore.invoice.invoice_lines"
      :key="index"
    >
      <v-card-item>
        <div>
          <div class="text-h5 font-weight-bold">
            {{ item.product.name }}
          </div>
          <div class="text-subtitle-1 font-weight-bold">SKU: {{ item.product.sku }}</div>
          <div class="text-subtitle-1" v-if="item.product.description">
            {{ item.product.description }}
          </div>
          <div class="text-subtitle-1">
            CANTIDAD: {{ item.quantity }} Kg
            <br />
            COSTO UNITARIO:
            {{
              item.price
                .toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })
                .split(",")[0]
            }}

            <br />
            COSTO TOTAL:
            {{
              (item.price * item.quantity)
                .toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })
                .split(",")[0]
            }}
          </div>
        </div>
      </v-card-item>
    </v-card>

    <v-card class="mt-2">
      <v-card-item>
        <v-sheet>
          <p>
            <span class="text-h5 font-weight-bold">Total:</span>
            <span class="text-h5 font-weight-bold">
              {{
                invoiceStore.invoice.total
                  .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                  .split(",")[0]
              }}
            </span>
          </p>
        </v-sheet>
        <v-btn
          class="mr-1 mt-2"
          color="primary"
          v-if="
            invoiceStore.invoice.state === 'Pendiente' &&
            this.$validatePermissions(['invoices-update'])
          "
          @click="invoiceStore.paidInvoice(invoiceStore.invoice.id)"
        >
          <v-tooltip activator="parent" location="top">MARCAR COMO PAGADA</v-tooltip>
          <v-icon>mdi-currency-usd</v-icon>
          MARCAR COMO PAGADA
        </v-btn>
        <div class="d-flex flex-row-reverse">
          <v-btn
            class="mx-4 my-4"
            density="compact"
            color="primary"
            :to="{ name: 'invoices-list' }"
          >
            <v-icon>mdi-arrow-left-bold </v-icon>
          </v-btn>
        </div>
      </v-card-item>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useInvoiceStore } from "@/stores/invoices/invoiceStore";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
const page = ref({ title: "Detalle de factura" });

const invoiceStore = useInvoiceStore();
const route = useRoute();

onMounted(async () => {
  const id = route.params.id;
  if (typeof id === "string") {
    const numericId = parseInt(id);
    await invoiceStore.getInvoice(numericId);
  }
});
</script>

<style scoped>
/* Estilos personalizados aquí */
</style>
