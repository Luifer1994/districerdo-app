<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols lg="5" md="5" xl="5" xxl="5" class="border-right">
          <v-autocomplete
            label="Cliente"
            density="compact"
            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            variant="outlined"
            clearable
          ></v-autocomplete>
          <v-text-field
            density="compact"
            label="Buscar servicio"
            hide-details
            variant="outlined"
            v-model="ProductStore.searchActive"
            @input="searchProductsActive"
          ></v-text-field>
          <v-card
            class="mt-2"
            v-for="(item, index) in ProductStore.ProductsActive"
            :key="index"
          >
            <v-card-item>
              <div>
                <div class="text-subtitle-2">
                  {{ item.name }}
                </div>
                <div class="text-caption" v-if="item.description">
                  {{ item.description }}
                </div>
              </div>
            </v-card-item>
            <div class="d-flex flex-row-reverse">
              <v-sheet class="ma-2">
                <v-btn
                  prepend-icon="mdi-cart"
                  size="small"
                  @click="addProduct(item, 'add')"
                >
                  Agregar
                </v-btn>
              </v-sheet>
            </div>
          </v-card>
        </v-col>

        <v-col cols lg="7" md="7" xl="7" xxl="7">
          <div class="d-flex flex-row-reverse">
            <v-sheet class="ma-2">
              <h2 class="pa-1 font-weight-bold">Listado de servicios a facturar</h2>

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
                  </div>
                </v-card-item>

                <div class="d-flex">
                  <v-sheet class="ml-2 pa-2">
                    <p class="mb-1">
                      <span class="font-weight-bold">Total suministros: </span>
                      <span class="font-weight-bold">
                        {{
                          calculateTotalSupplies(item)
                            .toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                            })
                            .split(",")[0]
                        }}
                      </span>
                    </p>
                    <p class="mb-1">
                      <span class="font-weight-bold">IVA suministros 19%: </span>
                      <span class="font-weight-bold">
                        {{
                          calculateSuppliesIVA(item)
                            .toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                            })
                            .split(",")[0]
                        }}
                      </span>
                    </p>
                    <p class="mb-1">
                      <span class="font-weight-bold">Total servicios: </span>
                      <span class="font-weight-bold">
                        {{
                          item.price.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })
                        }}
                      </span>
                    </p>
                    <p class="mb-1">
                      <span class="font-weight-bold">IVA servicios 19%: </span>
                      <span class="font-weight-bold">
                        {{
                          calculateProductsIVA(item)
                            .toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                            })
                            .split(",")[0]
                        }}
                      </span>
                    </p>
                    <p class="mb-1">
                      <span class="font-weight-bold">Total: </span>
                      <span class="font-weight-bold">
                        {{
                          calculateTotal(item)
                            .toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                            })
                            .split(",")[0]
                        }}
                      </span>
                    </p>
                    <v-btn icon size="x-small" @click="editItem(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn size="x-small" icon color="error" @click="deleteItem(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-sheet>
                </div>
              </v-card>

              <v-divider color="primary" class="mt-4 mb-4"></v-divider>
              <div class="d-flex justify-end">
                <v-sheet class="ma-2 pa-2">
                  <p>
                    <span class="font-weight-bold">Subtotal:</span>
                    <span class="font-weight-bold">
                      {{
                        calculateSubtotal()
                          .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                          .split(",")[0]
                      }}
                    </span>
                  </p>
                  <p>
                    <span class="font-weight-bold">Total IVA:</span>
                    <span class="font-weight-bold">
                      {{
                        calculateTotalIVA()
                          .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                          .split(",")[0]
                      }}
                    </span>
                  </p>
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
                    <v-btn
                      color="error"
                      class="mr-1 mt-1 pr-7"
                      @click="invoiceStore.cancelCreateInvoice()"
                    >
                      <v-icon>mdi-close-circle</v-icon>Cancelar factura
                    </v-btn>
                    <v-btn color="warning" class="mr-1 mt-1 pr-6">
                      <v-icon>mdi-clock</v-icon>Guardar borrador
                    </v-btn>
                    <v-btn color="success" class="mt-1" @click="createInvoice()">
                      <v-icon>mdi-content-save</v-icon>Guardar y facturar
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
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import ModalAddProduct from "./ModalAddProduct.vue";
import { useInvoiceStore } from "../../stores/invoices/invoiceStore";
import { useProductStore } from "../../stores/Products/ProductStore";
import { Item } from "@/stores/Products/ProductInterface";

const invoiceStore = useInvoiceStore();
const ProductStore = useProductStore();

let typingTimer;
const doneTypingInterval = 500;

function searchProductsActive() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    ProductStore.getProductsActive();
  }, doneTypingInterval);
}
function addProduct(item, action: string) {
  if (action === "add") {
    item.price = null;
    item.supplies = [];
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
      ProductStore.getProductsActive();
    }
  });
}
function calculateTotalSupplies(item: Item) {
  return item.supplies.reduce((a, b) => a + b.price * b.quantity, 0);
}
function calculateSuppliesIVA(item: Item) {
  return (calculateTotalSupplies(item) * 19) / 100;
}
function calculateProductsIVA(item: Item) {
  return (item.price * 19) / 100;
}
function calculateTotal(item: Item) {
  return (
    item.price +
    calculateTotalSupplies(item) +
    calculateSuppliesIVA(item) +
    calculateProductsIVA(item)
  );
}
function calculateSubtotal() {
  return invoiceStore.items.reduce(
    (subtotal, item) => subtotal + calculateTotalSupplies(item) + item.price,
    0
  );
}
function calculateTotalIVA() {
  return invoiceStore.items.reduce(
    (iva, item) => iva + calculateSuppliesIVA(item) + calculateProductsIVA(item),
    0
  );
}
function calculateGrandTotal() {
  return calculateSubtotal() + calculateTotalIVA();
}

function createInvoice() {
  let invoice = {
    state: "draft",
    client_id: 1,
    invoice_lines: [],
  };

  invoiceStore.items.forEach((item) => {
    const invoiceLineSupplies = []; // Crear un arreglo para almacenar los elementos invoice_line_supplies

    item.supplies.forEach((supply) => {
      invoiceLineSupplies.push({
        quantity: supply.quantity,
        price: supply.price,
        description: supply.name,
      });
    });

    invoice.invoice_lines.push({
      Product_id: item.id,
      price: item.price,
      quantity: 1,
      invoice_line_supplies: invoiceLineSupplies, // Asignar el arreglo invoiceLineSupplies
    });
  });
  console.log(invoice);
}
onMounted(async () => {
  await ProductStore.getProductsActive();
});
</script>
