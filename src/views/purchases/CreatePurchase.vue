<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols lg="5" md="5" xl="5" xxl="5" class="border-right">
          <v-autocomplete
            label="Buscar proveedor"
            density="compact"
            :items="providerStore.providers"
            variant="outlined"
            item-title="full_name"
            item-value="id"
            clearable
            append-inner-icon="mdi-magnify"
            v-model="PurchaseStore.newPurchaseData.provider_id"
            v-model:search="providerStore.search"
            @click:append-inner="providerStore.searchProvider(providerStore.search)"
            @keyup.enter="providerStore.searchProvider(providerStore.search)"
            :rules="[(v) => !!v || 'Seleccione un proveedor']"
          ></v-autocomplete>

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

        <v-col cols lg="7" md="7" xl="7" xxl="7">
          <div class="d-flex flex-row-reverse">
            <v-sheet class="ma-2">
              <h2 class="pa-1 font-weight-bold">Listado de productos de la compra</h2>
              <v-card
                class="mt-2"
                v-for="(item, index) in PurchaseStore.items"
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
                      v-model="PurchaseStore.newPurchaseData.status"
                      variant="outlined"
                      density="compact"
                      item-title="text"
                      item-value="value"
                    ></v-select>
                    <p
                      class="text-caption"
                      style="color: red"
                      v-if="
                      !PurchaseStore.newPurchaseData.provider_id ||
                      !PurchaseStore.items.length
                      "
                    >
                      Debes seleccionar un proveedor y al menos un producto para poder
                      guardar
                    </p>
                    <v-btn
                      color="error"
                      class="mr-1 mt-1 pr-7"
                      @click="
                        PurchaseStore.cancelCreatePurchase(),
                          this.$router.push({ name: 'purchase-list' })
                      "
                    >
                      <v-icon>mdi-close-circle</v-icon>CANCELAR COMPRA
                    </v-btn>
                    <v-btn
                      color="success"
                      class="mt-1"
                      @click="createPurchase()"
                      :disabled="
                        !PurchaseStore.newPurchaseData.provider_id ||
                        !PurchaseStore.items.length
                      "
                    >
                      <v-icon>mdi-content-save</v-icon>GUARDAR COMPRA
                    </v-btn>
                  </div>
                </v-sheet>
              </div>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <ModalAddProduct :item="PurchaseStore.itemSelected"></ModalAddProduct>
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
import { ref, onMounted, getCurrentInstance } from "vue";
import Swal from "sweetalert2";
import ModalAddProduct from "@/components/Purchases/ModalAddProduct.vue";
import { usePurchaseStore } from "../../stores/purchases/purchaseStore";
import { useProductStore } from "../../stores/Products/ProductStore";
import { useproviderStore } from "../../stores/providers/providerStore";
import { Item } from "../../stores/Products/ProductInterface";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
const page = ref({ title: "Registrar nueva compra" });
import { Router } from "vue-router";

const router = getCurrentInstance()!.appContext.config.globalProperties.$router as Router;

const PurchaseStore = usePurchaseStore();
const ProductStore = useProductStore();
const providerStore = useproviderStore();

function addProduct(item, action: string) {
  if (action === "add") {
    let filterItem = PurchaseStore.items.find((i) => i.id === item.id);
    if (filterItem) {
      item.price = filterItem.price;
      item.quantity = filterItem.quantity;
    } else {
      item.price = null;
      item.quantity = null;
    }
  }
  PurchaseStore.itemSelected = item;
  PurchaseStore.modalAddProduct = true;
}
function editItem(item: Item) {
  PurchaseStore.itemSelected = item;
  PurchaseStore.modalAddProduct = true;
}
function deleteItem(item: Item) {
  Swal.fire({
    title: "Eliminar producto",
    text: "¿Está seguro de eliminar el producto de la compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      PurchaseStore.items = PurchaseStore.items.filter((i) => i.id !== item.id);
      ProductStore.getProductsActive("");
    }
  });
}

function calculateGrandTotal() {
  let total = 0;
  PurchaseStore.items.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total;
}

async function createPurchase() {
  Swal.fire({
    title: "Guardar compra",
    text: "¿Está seguro de guardar la compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, guardar!",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const items = [];
      PurchaseStore.items.forEach((item) => {
        items.push({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        });
      });
      PurchaseStore.newPurchaseData.purchase_lines = items;

      const res = await PurchaseStore.createPurchase(PurchaseStore.newPurchaseData);
      router.push({ name: "purchase-detail", params: { id: res } });
    }
  });
}
onMounted(async () => {
  await ProductStore.getProductsActive("");
  await providerStore.searchProvider("");
  PurchaseStore.newPurchaseData.status = "PENDING";
});
</script>
