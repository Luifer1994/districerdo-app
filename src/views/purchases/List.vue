<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <v-card>
    <v-card-text class="pa-5">
      <v-row>
        <v-col cols="12" lg="3" md="4">
          <v-text-field
            density="compact"
            label="Buscar compras"
            hide-details
            variant="outlined"
            v-model="PurchaseStore.search"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="3" md="3">
          <v-select
            density="compact"
            clearable
            label="Estado"
            :items="[
              { name: 'PAGADA', value: 'PAID' },
              { name: 'PENDIENTE', value: 'PENDING' },
            ]"
            variant="outlined"
            item-title="name"
            item-value="value"
            v-model="PurchaseStore.state"
          ></v-select>
        </v-col>
        <v-col cols="12" lg="3" md="3">
          <VueDatePicker
            class="my-datepicker"
            v-model="PurchaseStore.dates"
            range
            locale="es"
            teleport-center
          ></VueDatePicker>
        </v-col>
        <v-col cols="3" lg="1" md="2">
          <v-btn color="error" @click="PurchaseStore.getPurchases()">
            <v-tooltip activator="parent" location="top"> Buscar</v-tooltip>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="3" lg="2" md="3" class="text-right">
          <v-btn
            color="primary"
            class="white--text"
            @click="$router.push({ name: 'purchase-create' })"
            v-if="validatePermission(['purchases-create'])"
          >
            <v-tooltip activator="parent" location="top"> Registrar compra </v-tooltip>
            <v-icon>mdi-plus</v-icon>
            <span class="hidden-sm-and-down">Registrar compra</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-container fluid>
        <v-table density="compact">
          <thead>
            <tr>
              <th>COD_COMPRA</th>
              <th>LOTE</th>
              <th>PROVEEDOR</th>
              <th>FECHA_CREACIÓN</th>
              <th>CANT_PRODUCTOS</th>
              <th>TOTAL_COMPRA</th>
              <th>TOTAL_PAGADO</th>
              <th>POR_PAGAR</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="purchase in PurchaseStore.purchases" :key="purchase.id">
              <td>{{ purchase.code }}</td>
              <td>{{ purchase.purchase_lines[0].entrance.batch.code }}</td>
              <td>
                {{ purchase.provider.full_name }}
              </td>
              <td>{{ purchase.created_at }}</td>
              <td>
                {{ purchase.total_products }}
              </td>
              <td>
                {{
                  purchase.total
                    .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                    .split(",")[0]
                }}
              </td>
              <td>
                {{
                  purchase.total_paid
                    .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                    .split(",")[0]
                }}
              </td>
              <td>
                {{
                  purchase.total_for_pay
                    .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                    .split(",")[0]
                }}
              </td>
              <td>
                <v-badge
                  :content="purchase.status"
                  :color="purchase.status === 'PENDIENTE' ? 'error' : 'success'"
                  overlap
                >
                </v-badge>
              </td>
              <td>
                <div class="text-center">
                  <v-menu>
                    <template v-slot:activator="{ props: menu }">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props: tooltip }">
                          <v-btn
                            color="grey-lighten-1"
                            v-bind="mergeProps(menu, tooltip)"
                          >
                            Acciones <v-icon> mdi-dots-vertical </v-icon>
                          </v-btn>
                        </template>
                        <span> Acciones de la compra </span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <div
                        v-for="(item, index) in acctionsTable"
                        :key="index"
                        :value="item"
                      >
                        <v-list-item
                          v-if="
                            item.show(purchase.status) &&
                            validatePermission([item.permission])
                          "
                          @click="
                            item.isDetailLink
                              ? $router.push({
                                  name: 'purchase-detail',
                                  params: { id: purchase.id },
                                })
                              : PurchaseStore[item.action](purchase.id)
                          "
                        >
                          <v-list-item-title
                            >{{ item.title }}
                            <v-icon v-if="item.icon" :color="item.color">
                              {{ item.icon }}
                            </v-icon>
                          </v-list-item-title>
                        </v-list-item>
                      </div>
                    </v-list>
                  </v-menu>
                </div>
              </td>
              </tr>
          </tbody>
        </v-table>
        <v-divider color="primary" class="mt-4 mb-4"></v-divider>
        <v-pagination
          v-model="PurchaseStore.currentPage"
          :length="PurchaseStore.lastPage"
          :total-visible="5"
          :show-first-last-page="true"
          @update:modelValue="PurchaseStore.changePage($event)"
          size="x-small"
        />
      </v-container>
    </v-card-text>
    <CreatePartialPayment></CreatePartialPayment>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { validatePermission } from "@/utils/validatePermission";
import { usePurchaseStore } from "@/stores/purchases/purchaseStore";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import CreatePartialPayment from "./CreatePartialPayment.vue";
const page = ref({ title: "Listado de compra" });
const PurchaseStore = usePurchaseStore();
const dates = ref([]);

const acctionsTable = ref([
  {
    title: "Marcar como pagada",
    icon: "mdi-currency-usd",
    color: "primary",
    action: "paidPurchase",
    permission: "purchases-update",
    show: (status) => status === "PENDIENTE",
    isDetailLink: false,
  },
  {
    title: "Detalle",
    icon: "mdi-eye",
    color: "warning",
    action: "detailInvoice",
    permission: "purchases-show",
    show: (status) => true,
    isDetailLink: true,
  },
  {
    title: "Registrar pago parcial",
    icon: "mdi mdi-cash-multiple",
    color: "primary",
    action: "addPartialPayment",
    permission: "purchases-partial-payment",
    show: (status) => status === "PENDIENTE",
    isDetailLink: false,
  },
]);

//mounted
onMounted(() => {
  PurchaseStore.getPurchases();
 //sacar item del acctionsTable segun el permiso
 acctionsTable.value = acctionsTable.value.filter((item) => {
    return validatePermission([item.permission]);
  });
});

const mergeProps = (menu, tooltip) => {
  return {
    ...menu,
    ...tooltip,
    class: "ma-2",
  };
};
</script>
<style scoped></style>
