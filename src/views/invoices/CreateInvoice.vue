<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols lg="5" md="5" xl="5" xxl="5" class="border-right">
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                density="compact"
                label="Buscar cliente"
                :items="ClientStore.clients"
                variant="outlined"
                item-title="full_name"
                item-value="id"
                clearable
                append-inner-icon="mdi-magnify"
                v-model="invoiceStore.newInvoiceData.client_id"
                v-model:search="ClientStore.search"
                @click:append-inner="ClientStore.searchClients(ClientStore.search)"
                @keyup.enter="ClientStore.searchClients(ClientStore.search)"
                :rules="[(v) => !!v || 'Seleccione un cliente']"
              >
                <template v-slot:append>
                  <ModalCeateClient
                    style="visibility: hidden"
                    v-if="ClientStore.modalNewClientActive"
                  ></ModalCeateClient>
                  <v-btn @click="ClientStore.modalNewClientActive = true">
                    <v-tooltip activator="parent" location="top"
                      >Registrar cliente</v-tooltip
                    >
                    <v-icon>mdi-account-plus</v-icon>
                  </v-btn>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols lg="12" md="12" xl="12" xxl="12">
              <v-text-field
                density="compact"
                label="Buscar productos"
                hide-details
                variant="outlined"
                clearable
                v-model="ProductStore.searchActive"
                append-inner-icon="mdi-magnify"
                @click:append-inner="
                  ProductStore.getProductsActive(ProductStore.searchActive)
                "
                @keyup.enter="ProductStore.getProductsActive(ProductStore.searchActive)"
              ></v-text-field>
              <v-card
                class="mt-2"
                v-for="(item, index) in ProductStore.ProductsActive"
                :key="index"
              >
                <v-card-item>
                  <div class="text-subtitle-2">
                    {{ item.name }}
                  </div>
                  <div class="text-caption" v-if="item.description">
                    {{ item.description }}
                  </div>
                  <div class="d-flex flex-row-reverse">
                    <v-sheet class="">
                      <v-btn
                        prepend-icon="mdi-cart"
                        size="small"
                        @click="addProduct(item, 'add')"
                      >
                        Agregar
                      </v-btn>
                    </v-sheet>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols lg="7" md="7" xl="7" xxl="7">
          <div class="d-flex flex-row-reverse">
            <v-sheet class="ma-2">
              <h2 class="pa-1 font-weight-bold">Listado de productos a facturar</h2>
              <v-card
                class="mt-2"
                v-for="(item, index) in invoiceStore.items"
                :key="index"
              >
                <v-card-item>
                  <div>
                    <div class="text-h6">
                      {{ item.name }}
                    </div>
                    <div class="text-caption" v-if="item.description">
                      {{ item.description }}
                    </div>
                    <div class="text-caption">
                      LOTE: {{ item.batch }}
                      <br />
                      CANTIDAD: {{ item.quantity }} Kg
                      <br />
                      PRECIO UNITARIO:
                      {{
                        item.price
                          .toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })
                          .split(",")[0]
                      }}

                      <br />
                      PRECIO TOTAL:
                      {{
                        (item.price * item.quantity)
                          .toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })
                          .split(",")[0]
                      }}
                    </div>
                    <div class="d-flex flex-row-reverse">
                      <v-sheet class="">
                        <v-btn
                          density="compact"
                          icon="mdi-pencil"
                          @click="editItem(item)"
                        ></v-btn>
                      </v-sheet>
                      <v-sheet class="mr-1">
                        <v-btn
                          density="compact"
                          icon="mdi-trash-can-outline"
                          color="error"
                          @click="deleteItem(item)"
                        ></v-btn>
                      </v-sheet>
                    </div>
                  </div>
                </v-card-item>
              </v-card>

              <v-divider color="primary" class="mt-4 mb-4"></v-divider>
              <div class="d-flex justify-end">
                <v-sheet class="ma-2 pa-2">
                  <p>
                    <span class="text-h5 font-weight-bold">Total:</span>
                    <span class="text-h5 font-weight-bold">
                      {{
                        calculateGrandTotal()
                          .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                          .split(",")[0]
                      }}
                    </span>
                  </p>
                  <div class="mt-4">
                    <v-select
                      label="Estado de la compra"
                      :items="[
                        {
                          text: 'Pendiente',
                          value: 'PENDING',
                        },
                        {
                          text: 'Pagada',
                          value: 'PAID',
                        },
                      ]"
                      v-model="invoiceStore.newInvoiceData.state"
                      variant="outlined"
                      density="compact"
                      item-title="text"
                      item-value="value"
                    ></v-select>
                    <p
                      class="text-caption"
                      style="color: red"
                      v-if="
                        !invoiceStore.newInvoiceData.client_id ||
                        !invoiceStore.items.length
                      "
                    >
                      Debes seleccionar un cliente y al menos un producto para poder
                      guardar
                    </p>
                    <v-btn
                      color="error"
                      class="mr-1 mt-1 pr-7"
                      @click="
                        invoiceStore.cancelCreateInvoice(),
                          this.$router.push({ name: 'invoices-list' })
                      "
                    >
                      <v-icon>mdi-close-circle</v-icon>CANCELAR FACTURA
                    </v-btn>

                    <v-btn
                      color="success"
                      class="mt-1"
                      @click="createInvoice()"
                      :disabled="
                        !invoiceStore.newInvoiceData.client_id ||
                        !invoiceStore.items.length
                      "
                    >
                      <v-icon>mdi-content-save</v-icon>GUARDAR FACTURA
                    </v-btn>
                  </div>
                </v-sheet>
              </div>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <ModalAddProduct :item="invoiceStore.itemSelected"></ModalAddProduct>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from "vue";
import Swal from "sweetalert2";
import ModalAddProduct from "@/components/Invoices/ModalAddProduct.vue";
import ModalCeateClient from "@/views/clients/ModalCeateClient.vue";
import { useInvoiceStore } from "../../stores/invoices/invoiceStore";
import { useProductStore } from "../../stores/Products/ProductStore";
import { useClientStore } from "../../stores/clients/clientStore";
import { Item } from "@/stores/Products/ProductInterface";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { Router } from "vue-router";

const router = getCurrentInstance()!.appContext.config.globalProperties.$router as Router;

const page = ref({ title: "Crear nueva factura" });

const invoiceStore = useInvoiceStore();
const ProductStore = useProductStore();
const ClientStore = useClientStore();

let typingTimer;
const doneTypingInterval = 500;

function searchProductsActive() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    ProductStore.getProductsActive("");
  }, doneTypingInterval);
}
function addProduct(item, action: string) {
  if (action === "add") {
    item.price = null;
  }
  invoiceStore.itemSelected = item;
  invoiceStore.modalAddProduct = true;
}
function editItem(item: Item) {
  invoiceStore.itemSelected = item;
  invoiceStore.modalAddProduct = true;
}
function deleteItem(item: Item) {
  Swal.fire({
    title: "¿Estas seguro?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      invoiceStore.items = invoiceStore.items.filter((i) => i.id !== item.id);
      ProductStore.getProductsActive("");
    }
  });
}

function calculateGrandTotal() {
  return invoiceStore.items.reduce((acc, item) => {
    return item.price * item.quantity;
  }, 0);
}

async function createInvoice() {
  Swal.fire({
    title: "Guardar factura",
    text: "¿Está seguro de generar la factura",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, guardar!",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let invoice = {
        state: invoiceStore.newInvoiceData.state,
        client_id: invoiceStore.newInvoiceData.client_id,
        invoice_lines: [],
      };

      invoiceStore.items.forEach((item) => {
        invoice.invoice_lines.push({
          product_id: item.id,
          price: item.price,
          quantity: item.quantity,
          batch: item.batch,
        });
      });
      const res = await invoiceStore.createInvoice(invoice);
      router.push({ name: "invoices-detail", params: { id: res } });
    }
  });
}
onMounted(async () => {
  await ProductStore.getProductsActive("");
  await ClientStore.searchClients("");
});
</script>
