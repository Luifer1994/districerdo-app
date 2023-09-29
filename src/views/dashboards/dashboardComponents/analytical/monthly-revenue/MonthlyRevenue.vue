<script setup lang="ts">
import { onMounted, ref } from "vue";

import { usePurchaseStore } from "@/stores/purchases/purchaseStore";
let total = ref<number>(0);

async function getTotal() {
  total.value = await usePurchaseStore().getTotalAmount();
}

onMounted(async () => {
  await getTotal();
});
</script>

<template>

  <v-card class="bg-error">
    <v-card-text>
      <div class="d-flex align-start">
        <h2 class="font-weight-medium title text-white mt-1">Compras del mes</h2>
        <v-spacer></v-spacer>
        <div class="ml-auto">
          <v-btn depressed color="white" class="btn-custom-sm" small icon>
            <vue-feather type="shopping-bag" class="white--text"></vue-feather>
          </v-btn>
        </div>
      </div>
      <div class="mt-4">
        <h2 class="text-white text-h5">
          {{ total.toLocaleString("es-CO", { style: "currency", currency: "COP" })
          .split(",")[0] }}
        </h2>
      </div>
    </v-card-text>
  </v-card>
</template>


