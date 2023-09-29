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
                <v-btn
                  class="mr-1"
                  color="error"
                  density="compact"
                  icon="mdi-close"
                  :disabled="invoice.state === 'Pagada'|| invoice.state === 'Cancelada'"
                  @click="InvoiceStore.cancelInvoice(invoice.id)"
                  v-if="validatePermission(['invoices-cancel'])"
                >
                  <v-tooltip activator="parent" location="top"
                    >CANCELAR FACTURA</v-tooltip
                  >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-btn
                  class="mr-1"
                  color="primary"
                  density="compact"
                  icon="mdi-currency-usd"
                  :disabled="invoice.state === 'Pagada'|| invoice.state === 'Cancelada'"
                  @click="InvoiceStore.paidInvoice(invoice.id)"
                  v-if="validatePermission(['invoices-paid'])"
                >
                  <v-tooltip activator="parent" location="top"
                    >MARCAR COMO PAGADA</v-tooltip
                  >
                  <v-icon>mdi-currency-usd</v-icon>
                </v-btn>
                <v-btn
                  class="mr-1"
                  color="warning"
                  density="compact"
                  icon="mdi-eye"
                  :to="{
                    name: 'invoices-detail',
                    params: { id: invoice.id },
                  }"
                  v-if="validatePermission(['invoices-show'])"
                >
                  <v-tooltip activator="parent" location="top">Detalle</v-tooltip>
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn color="success" density="compact" icon="mdi-file-document" @click="InvoiceStore.downloadInvoice(invoice.id)" v-if="validatePermission(['invoices-download'])">
                  <v-tooltip activator="parent" location="top"
                    >Descargar factura</v-tooltip
                  >
                  <v-icon> mdi-file-document </v-icon>
                </v-btn>
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
const page = ref({ title: "Listado de facturas" });

const InvoiceStore = useInvoiceStore();

//mounted
onMounted(() => {
  InvoiceStore.getInvoices();
});
</script>
