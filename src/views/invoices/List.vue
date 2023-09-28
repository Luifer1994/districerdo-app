<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <v-card>
    <v-card-text class="pa-5">
      <v-row>
        <v-col cols="12" lg="4" md="6">
          <v-text-field
            density="compact"
            label="Buscar facturas"
            hide-details
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-btn color="primary" class="white--text" :to="{ name: 'invoices-create' }">
            <v-icon>mdi-plus</v-icon>
            <span class="hidden-sm-and-down">Crear factura</span>
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
                :disabled="invoice.state === 'Pagada'"
                @click="InvoiceStore.cancelInvoice(invoice.id)"
                v-if="this.$validatePermissions(['invoices-update'])"
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
                  :disabled="invoice.state === 'Pagada'"
                  @click="InvoiceStore.paidInvoice(invoice.id)"
                  v-if="this.$validatePermissions(['invoices-update'])"
                >
                  <v-tooltip activator="parent" location="top"
                    >MARCAR COMO PAGADA</v-tooltip
                  >
                  <v-icon>mdi-currency-usd</v-icon>
                </v-btn>
                <v-btn
                  color="warning"
                  density="compact"
                  icon="mdi-eye"
                  :to="{
                    name: 'invoices-detail',
                    params: { id: invoice.id },
                  }"
                  v-if="this.$validatePermissions(['invoices-show'])"
                >
                  <v-tooltip activator="parent" location="top">Detalle</v-tooltip>
                  <v-icon>mdi-eye</v-icon>
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
import { useInvoiceStore } from "@/stores/invoices/invoiceStore";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
const page = ref({ title: "Listado de facturas" });

const InvoiceStore = useInvoiceStore();

//mounted
onMounted(() => {
  InvoiceStore.getInvoices();
});
</script>
