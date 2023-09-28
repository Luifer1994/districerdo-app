<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <div v-if="PurchaseStore.purchase.id">
    <v-card>
      <v-card-text>
        <v-sheet>
          <h6 class="text-h6">
            Proveedor: {{ PurchaseStore.purchase.provider.full_name }}
          </h6>
          <h2 class="text-h6">
            Fecha de compra: {{ PurchaseStore.purchase.created_at }}
          </h2>
          <h2 class="text-h6">
            Estado de compra:
            <v-badge
              :color="PurchaseStore.purchase.status === 'PENDIENTE' ? 'error' : 'success'"
              :content="PurchaseStore.purchase.status"
              inline
            ></v-badge>
          </h2>
          <h2 class="text-h6">
            Lote:
            <span class="text-h6 font-weight-bold">
              {{ PurchaseStore.purchase.purchase_lines[0].entrance.batch.code }}
            </span>
          </h2>
        </v-sheet>
      </v-card-text>
    </v-card>
    <h2 class="text-h5 font-weight-bold mx-2 my-4">Listado de productos de la compra</h2>
    <v-card
      class="mt-2"
      v-for="(item, index) in PurchaseStore.purchase.purchase_lines"
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
                PurchaseStore.purchase.total
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
            PurchaseStore.purchase.status === 'PENDIENTE' &&
            validatePermission(['purchases-update'])
          "
          @click="paidLocal(PurchaseStore.purchase.id)"
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
            :to="{ name: 'purchase-list' }"
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
import { usePurchaseStore } from "@/stores/purchases/purchaseStore";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { validatePermission } from "@/utils/validatePermission";
const page = ref({ title: "Detalle de compra" });

const PurchaseStore = usePurchaseStore();
const route = useRoute();

async function paidLocal(id: Number) {
  await PurchaseStore.paidPurchase(id);
}

onMounted(async () => {
  const id = route.params.id;
  if (typeof id === "string") {
    const numericId = parseInt(id);
    await PurchaseStore.findPurchase(numericId);
  }
});
</script>

<style scoped>
/* Estilos personalizados aquí */
</style>
