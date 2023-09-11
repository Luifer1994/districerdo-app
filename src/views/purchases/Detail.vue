<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <v-card v-if="PurchaseStore.purchase.id">
    <v-card-text>
      <v-sheet>
        <h5 class="text-h5">
          Proveedor: {{ PurchaseStore.purchase.provider.full_name }}
        </h5>
        <h2 class="text-h5">Fecha de compra: {{ PurchaseStore.purchase.created_at }}</h2>
        <h2 class="text-h5">
          Estado de compra:
          <v-badge
            :color="PurchaseStore.purchase.status === 'PENDIENTE' ? 'error' : 'success'"
            :content="PurchaseStore.purchase.status"
            inline
          ></v-badge>
        </h2>

        <br />
        <v-divider></v-divider>
        <h2 class="text-h5">Listado de productos de la compra</h2>

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
              <div class="text-subtitle-1 font-weight-bold">
                SKU: {{ item.product.sku }}
              </div>
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

        <v-divider color="primary" class="mt-4 mb-4"></v-divider>

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
          v-if="PurchaseStore.purchase.status === 'PENDIENTE' && this.validatePermission(['purchases-update'])"
          @click="paidLocal(PurchaseStore.purchase.id)"
        >
          <v-tooltip activator="parent" location="top">MARCAR COMO PAGADA</v-tooltip>
          <v-icon>mdi-currency-usd</v-icon>
          MARCAR COMO PAGADA
        </v-btn>
      </v-sheet>
    </v-card-text>
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
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePurchaseStore } from "@/stores/purchases/purchaseStore";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
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
