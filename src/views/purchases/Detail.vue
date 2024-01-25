<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <v-app-bar color="white" dense flat>
    <v-btn color="primary" @click="$router.push({ name: 'purchase-list' })">
      <v-icon left>mdi-arrow-left</v-icon>
      Atras
    </v-btn>

    <v-spacer></v-spacer>

    <v-btn
      color="green"
      dark
      variant="flat"
      density="compact"
      class="mx-1"
      @click="PurchaseStore.paidPurchase(PurchaseStore.purchase.id)"
      v-if="
        PurchaseStore.purchase.status === 'PENDIENTE' &&
        validatePermission(['purchases-update'])
      "
    >
      <v-icon left>mdi-currency-usd</v-icon>
      <v-tooltip activator="parent" location="bottom"> Marcar como pagada </v-tooltip>
    </v-btn>

    <v-btn
      color="primary"
      dark
      variant="flat"
      density="compact"
      class="mx-1"
      @click="PurchaseStore.addPartialPayment(PurchaseStore.purchase.id)"
      v-if="
        PurchaseStore.purchase.status === 'PENDIENTE' &&
        validatePermission(['purchases-partial-payment']) &&
        PurchaseStore.purchase.total_for_pay > 0
      "
    >
      <v-icon left>mdi mdi-cash-multiple</v-icon>
      <v-tooltip activator="parent" location="bottom"> Registrar abono </v-tooltip>
    </v-btn>
  </v-app-bar>
  <div v-if="PurchaseStore.purchase.id">
    <div
      class="v-card v-theme--light v-card--density-default v-card--variant-elevated invoice-preview-wrapper pa-12"
    >
      <div
        class="invoice-header-preview d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row bg-var-theme-background gap-6 rounded mb-6"
      >
        <div>
          <div class="d-flex align-center mb-6">
            <div
              class="me-3"
              style="line-height: 0; color: rgb(var(--v-global-theme-primary))"
            >
              <img :width="150" src="@/assets/images/logos/logo-login.png" />
            </div>
          </div>
          <h6 class="text-h6 font-weight-regular">NIT. 1102872831-6</h6>
          <h6 class="text-h6 font-weight-regular">Carrera 21. Corozal - Sucre</h6>

          <h6 class="text-h6 font-weight-regular">Contacto: 3002729614 - 3244732691</h6>
        </div>
      </div>
      <div class="v-row print-row mb-6">
        <div class="v-col text-no-wrap">
          <h6 class="text-h6 mb-4">Proveedor:</h6>
          <p class="mb-0">
            {{ PurchaseStore.purchase.provider.full_name }}
          </p>
          <p class="mb-0">
            {{ PurchaseStore.purchase.provider.document_type.code }}:
            {{ PurchaseStore.purchase.provider.document_number }}
          </p>
          <p class="mb-0">
            {{ PurchaseStore.purchase.provider.phone }}
          </p>
          <p class="mb-0">
            {{ PurchaseStore.purchase.provider.email }}
          </p>
          <p class="mb-0">
            {{ PurchaseStore.purchase.provider.address }}
          </p>
        </div>
        <div class="v-col text-no-wrap">
          <div>
            <h6 class="text-h6 font-weight-regular">
              Compra #{{ PurchaseStore.purchase.code }}
            </h6>
            <!-- budge for state -->
            <div class="d-flex align-center mb-6">
              <div class="me-3" style="line-height: 0">
                <v-icon x-large :color="purchaseColor(PurchaseStore.purchase.status)"
                  >mdi-circle</v-icon
                >
              </div>
              <h6 class="text-h6 font-weight-regular">
                <span>Estado: </span>
                <span :style="{ color: purchaseColor(PurchaseStore.purchase.status) }">{{
                  PurchaseStore.purchase.status
                }}</span>
              </h6>
            </div>

            <h6 class="text-h6 font-weight-regular">
              <span>Fecha de compra: </span
              ><span>
                {{ PurchaseStore.purchase.created_at }}
              </span>
            </h6>
          </div>
        </div>
      </div>

      <v-divider color="primary" class="mt-4 mb-4"></v-divider>

      <v-expansion-panels
        color="primary"
        v-if="PurchaseStore.purchase.partial_payments_of_purchase.length"
      >
        <v-expansion-panel title="Historial de abonos">
          <v-expansion-panel-text>
            <div
              class="v-table v-theme--light v-table--density-default invoice-preview-table border text-high-emphasis overflow-hidden mb-6"
            >
              <!---->
              <div class="v-table__wrapper">
                <table>
                  <thead>
                    <tr>
                      <th scope="col" class="text-center">FECHA_DE_ABONO</th>
                      <th scope="col" class="text-center">DESCRIPCIÓN</th>
                      <th scope="col" class="text-center">MONTO</th>
                      <th scope="col" class="text-center">EVIDENCIA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in PurchaseStore.purchase
                        .partial_payments_of_purchase"
                      :key="index"
                    >
                      <td class="text-center">
                        {{ item.date }}
                      </td>
                      <td class="text-center">
                        {{ item.description }}
                      </td>
                      <td class="text-center">
                        {{
                          item.amount
                            .toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                            })
                            .split(",")[0]
                        }}
                      </td>
                      <td class="text-center">
                        <v-btn
                          color="primary"
                          dark
                          variant="flat"
                          density="compact"
                          class="mx-1"
                          :disabled="!item.evidence"
                          @click="PurchaseStore.downloadEvidence(item.id)"
                          v-if="validatePermission(['invoices-download-evidence'])"
                        >
                          <v-icon left>mdi-file-document</v-icon>
                          <v-tooltip activator="parent" location="bottom"
                            >Descargar evidencia</v-tooltip
                          >
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!---->
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-divider color="primary" class="mt-4 mb-4"></v-divider>
      <p class="text-h6 mb-4">
        <span>Productos comprados:</span>
      </p>
      <div
        class="v-table v-theme--light v-table--density-default invoice-preview-table border text-high-emphasis overflow-hidden mb-6"
      >
        <!---->
        <div class="v-table__wrapper">
          <table>
            <thead>
              <tr>
                <th scope="col">PRODUCTO</th>
                <th scope="col">SKU</th>
                <th scope="col">LOTE</th>
                <th scope="col" class="text-center">CANTIDAD</th>
                <th scope="col" class="text-center">COSTO UNITARIO</th>
                <th scope="col" class="text-center">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in PurchaseStore.purchase.purchase_lines"
                :key="index"
              >
                <td class="text-no-wrap">
                  {{ item.product.name }}
                </td>
                <td class="text-no-wrap">
                  {{ item.product.sku }}
                </td>
                <td class="text-no-wrap">
                  {{ item.entrance.batch.code }}
                </td>
                <td class="text-center">
                  {{ item.quantity }}
                </td>
                <td class="text-center">
                  {{
                    item.price
                      .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                      .split(",")[0]
                  }}
                </td>
                <td class="text-center">
                  {{
                    item.total_line
                      .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                      .split(",")[0]
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!---->
      </div>
      <div
        class="d-flex justify-space-between flex-column flex-sm-row print-row bg-blue-grey-lighten-4 rounded"
        style="padding: 10px"
      >
        <div class="mb-2">
          <div class="d-flex align-center mb-1">
            <h6 class="text-h6 me-2">Registrada por:</h6>
            <span>
              {{ PurchaseStore.purchase.user.full_name }}
            </span>
          </div>
        </div>
        <div>
          <table class="w-100">
            <tbody>
              <tr>
                <td class="pe-16">Total compra:</td>
                <td class="text-end">
                  <h6 class="text-sm">
                    {{
                      PurchaseStore.purchase.total
                        .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                        .split(",")[0]
                    }}
                  </h6>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="w-100">
            <tbody>
              <tr>
                <td class="pe-16">Total pagado:</td>
                <td class="text-end">
                  <h6 class="text-sm">
                   - {{
                      PurchaseStore.purchase.total_paid
                        .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                        .split(",")[0]
                    }}
                  </h6>
                </td>
              </tr>
              <tr>
                <td class="pe-16">Por pagar:</td>
                <td class="text-end">
                  <h6 class="text-sm">
                    {{
                      PurchaseStore.purchase.total_for_pay
                        .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                        .split(",")[0]
                    }}
                  </h6>
                </td>
              </tr>
            </tbody>
          </table>
          <hr
            class="v-divider v-theme--light mt-4 mb-3"
            aria-orientation="horizontal"
            role="separator"
          />
          
        </div>
      </div>
      <hr
        class="v-divider v-theme--light my-6 border-dashed"
        aria-orientation="horizontal"
        role="separator"
      />

      <!----><!----><span class="v-card__underlay"></span>
    </div>
    <CreatePartialPayment></CreatePartialPayment>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePurchaseStore } from "@/stores/purchases/purchaseStore";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import CreatePartialPayment from "./CreatePartialPayment.vue";
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

const purchaseColor = (state) => {
  switch (state) {
    case "PAGADA":
      return "green";
    case "PENDIENTE":
      return "orange";
    default:
      return "black"; // O cualquier color por defecto
  }
};
</script>

<style scoped>
/* Estilos personalizados aquí */
</style>
