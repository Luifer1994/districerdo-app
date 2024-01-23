<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <v-card>
    <v-card-text class="pa-5">
      <v-row>
        <v-col cols="12" lg="3" md="4">
          <v-text-field
            density="compact"
            label="Buscar factura"
            hide-details
            variant="outlined"
            v-model="InvoiceStore.search"
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
              { name: 'CANCELADA', value: 'CANCELLED' },
            ]"
            variant="outlined"
            item-title="name"
            item-value="value"
            v-model="InvoiceStore.state"
          ></v-select>
        </v-col>
        <v-col cols="12" lg="3" md="3">
          <VueDatePicker
            class="my-datepicker"
            v-model="InvoiceStore.dates"
            range
            locale="es"
            teleport-center
          ></VueDatePicker>
        </v-col>
        <v-col cols="3" lg="1" md="2">
          <v-btn color="error" @click="InvoiceStore.getInvoices()">
            <v-tooltip activator="parent" location="top"> Buscar</v-tooltip>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="3" lg="2" md="3" class="text-right">
          <v-btn
            color="primary"
            class="white--text"
            @click="$router.push({ name: 'invoices-create' })"
            v-if="validatePermission(['invoices-create'])"
          >
            <v-tooltip activator="parent" location="top"> Registrar factura </v-tooltip>
            <v-icon>mdi-plus</v-icon>
            <span class="hidden-sm-and-down">Registrar factura</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-container fluid>
        <v-table density="compact">
          <thead>
            <tr>
              <th>N_FACTURA</th>
              <th>CLIENTE</th>
              <th>FECHA_CREACIÓN</th>
              <th>CANTIDAD_PRODUCTOS</th>
              <th>TOTAL_FACTURA</th>
              <th>TOTAL_PAGADO</th>
              <th>POR_PAGAR</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in InvoiceStore.invoices" :key="invoice.id">
              <td>{{ invoice.code }}</td>
              <td>
                {{ invoice.client.full_name }}
              </td>
              <td>{{ invoice.created_at }}</td>
              <td>{{ invoice.invoice_lines_count }}</td>
              <td>
                {{
                  invoice.total
                    .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                    .split(",")[0]
                }}
              </td>
              <td>
                {{
                  invoice.total_paid
                    .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                    .split(",")[0]
                }}
              </td>
              <td>
                {{
                  invoice.total_for_pay
                    .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                    .split(",")[0]
                }}
              </td>
              <td>
                <v-badge
                  :content="invoice.state"
                  :color="
                    invoice.state === 'Pendiente'
                      ? 'warning'
                      : invoice.state === 'Pagada'
                      ? 'success'
                      : invoice.state === 'Cancelada'
                      ? 'error'
                      : 'info'
                  "
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
                        <span> Acciones de la factura </span>
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
                            item.show(invoice.state) &&
                            validatePermission([item.permission])
                          "
                          @click="
                            item.isDetailLink
                              ? $router.push({
                                  name: 'invoices-detail',
                                  params: { id: invoice.id },
                                })
                              : InvoiceStore[item.action](invoice.id)
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
          v-model="InvoiceStore.currentPage"
          :length="InvoiceStore.lastPage"
          :total-visible="5"
          :show-first-last-page="true"
          @update:modelValue="InvoiceStore.changePage($event)"
          size="x-small"
        />
      </v-container>
      <CreatePartialPayment></CreatePartialPayment>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useInvoiceStore } from "@/stores/invoices/invoiceStore";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { validatePermission } from "@/utils/validatePermission";
import CreatePartialPayment from "./CreatePartialPayment.vue";
const page = ref({ title: "Listado de facturas" });

const acctionsTable = ref([
  {
    title: "Cancelar",
    icon: "mdi-close",
    color: "error",
    action: "cancelInvoice",
    permission: "invoices-cancel",
    show: (state) => state === "Pendiente",
    isDetailLink: false,
  },
  {
    title: "Marcar como pagada",
    icon: "mdi-currency-usd",
    color: "primary",
    action: "paidInvoice",
    permission: "invoices-paid",
    show: (state) => state === "Pendiente",
    isDetailLink: false,
  },
  {
    title: "Detalle",
    icon: "mdi-eye",
    color: "warning",
    action: "detailInvoice",
    permission: "invoices-show",
    show: (state) => true,
    isDetailLink: true,
  },
  {
    title: "Descargar factura",
    icon: "mdi-file-document",
    color: "success",
    action: "downloadInvoice",
    permission: "invoices-download",
    show: (state) => true,
    isDetailLink: false,
  },
  {
    title: "Registrar pago parcial",
    icon: "mdi mdi-cash-multiple",
    color: "primary",
    action: "addPartialPayment",
    permission: "invoices-partial-payment",
    show: (state) => state === "Pendiente",
    isDetailLink: false,
  },
]);

const InvoiceStore = useInvoiceStore();

//mounted
onMounted(() => {
  InvoiceStore.getInvoices();

  //sacar item del acctionsTable segun el permiso y el estado de la factura

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
