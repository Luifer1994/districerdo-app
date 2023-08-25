<template>
  <v-dialog width="1000" persistent v-model="invoiceStore.modalAddProduct">
    <v-card>
      <v-toolbar>
        <v-toolbar-title>
          <span class="text-h5 font-weight-bold">Agregar servicio</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <p class="text-subtitle-1">
              Servicio:
              <span class="font-weight-bold">{{ item.name }}</span>
            </p>
            <p v-if="item.description">
              Descripción:
              <span class="font-weight-bold">{{ item.description }}</span>
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Precio"
              hide-details
              prefix="$"
              min="1"
              type="text"
              v-model="item.price"
              @input="validateNumberInput('price', item)"
              :rules="getValidationRules('priceProduct', null)"
            ></v-text-field>
            <span class="text-caption text-red">{{ errors.priceProduct }}</span>
          </v-col>
        </v-row>
        <p>
          <span class="text-h6">Insumos</span>
        </p>
        <v-divider></v-divider>
        <v-row class="mt-2" v-for="(supplie, index) in item.supplies" :key="index">
          <v-col cols="12" md="5">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Nombre"
              hide-details
              v-model="supplie.name"
              :rules="getValidationRules('name' + index, index)"
            ></v-text-field>
            <span class="text-caption text-red">{{ errors["name" + index] }}</span>
          </v-col>

          <v-col cols="8" md="4">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Precio"
              hide-details
              prefix="$"
              min="1"
              type="text"
              v-model="supplie.price"
              @input="validateNumberInput('price', supplie)"
              :rules="getValidationRules('price' + index, index)"
            ></v-text-field>
            <span class="text-caption text-red">{{ errors["price" + index] }}</span>
          </v-col>

          <v-col cols="4" md="2">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Cantidad"
              hide-details
              type="text"
              v-model="supplie.quantity"
              @input="validateNumberInput('quantity', supplie)"
              :rules="getValidationRules('quantity' + index, index)"
              :error-messages="errors.quantity"
            ></v-text-field>
            <span class="text-caption text-red">{{ errors["quantity" + index] }}</span>
          </v-col>

          <v-col cols="12" md="1">
            <div class="d-flex justify-end">
              <v-sheet class="">
                <v-btn icon color="error" size="small" @click="removeSupplie(supplie.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-sheet>
            </div>
          </v-col>
          <v-divider></v-divider>
        </v-row>

        <v-btn class="mt-4" color="primary" @click="AddSupplie()">
          <v-icon>mdi-plus</v-icon>
          Insumo
        </v-btn>
      </v-card-text>

      <v-divider color="primary" class="mt-4 mb-4"></v-divider>
      <div class="d-flex justify-end mx-4 my-4">
        <v-btn
          prepend-icon="mdi-close-circle"
          color="secondary"
          class="mr-2"
          @click="(invoiceStore.modalAddProduct = false), (errors = {})"
        >
          Cancelar
        </v-btn>
        <v-btn
          @click="addData()"
          prepend-icon="mdi-content-save"
          color="primary"
          :disabled="Object.values(errors).some((value) => value !== '')"
          >Guardar</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import Swal from "sweetalert2";
import { useInvoiceStore } from "../../stores/invoices/invoiceStore";
import { Item, Supplie } from "../../stores/Products/ProductInterface";
import { useProductStore } from "../../stores/Products/ProductStore";

// Constants
const invoiceStore = useInvoiceStore();
const ProductStore = useProductStore();
const errors = ref<Errors>({});
const props = defineProps({
  item: Object as () => Item,
});

// Interface
interface Errors {
  name?: string;
  price?: string;
  quantity?: string;
  priceProduct?: string;
}

// Add supplie
function AddSupplie() {
  props.item.supplies.push({
    id: props.item.supplies.length + 1,
    name: null,
    price: null as number | null,
    quantity: null as number | null,
  });
}

// Remove supplie
function removeSupplie(id: number) {
  invoiceStore.modalAddProduct = false;
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
      props.item.supplies = props.item.supplies.filter((item: Supplie) => item.id !== id);
      errors.value = {};
    }
    invoiceStore.modalAddProduct = true;
  });
}

// Validate rules
function getValidationRules(field: string, index: number) {
  switch (field) {
    case "priceProduct":
    case "price" + index:
      return [
        (v: number | null) => {
          if (!v) {
            errors.value[field] = "Este campo es requerido";
            return "Este campo es requerido";
          }
          if (v === null || v == 0) {
            errors.value[field] = "El precio debe ser un número válido";
            return "El precio debe ser un número válido";
          }
          errors.value[field] = "";
          return true;
        },
      ];
    case "name" + index:
      return [
        (v: string | null) => {
          if (!v) {
            errors.value[field] = "Este campo es requerido";
            return "Este campo es requerido";
          }
          errors.value[field] = "";
          return true;
        },
      ];
    case "quantity" + index:
      return [
        (v: number | null) => {
          if (v === null || v == 0) {
            errors.value[field] = "La cantidad debe ser un número válido";
            return "La cantidad debe ser un número válido";
          }
          errors.value[field] = "";
          return true;
        },
      ];
    default:
      return [];
  }
}

// Validate if the input is a number
function validateNumberInput(field: string, item: any) {
  if (item[field] !== null && isNaN(item[field])) {
    item[field] = null;
  }
}

// Add data in validate after save
async function addData() {
  if (!props.item.price) {
    errors.value.priceProduct = "Este campo es requerido";
    return;
  }

  props.item.supplies.forEach((supplie, index) => {
    errors.value["name" + index] =
      supplie.name === null || supplie.name === "" ? "Este campo es requerido" : "";
    errors.value["price" + index] =
      supplie.price === null || supplie.price === 0 ? "Este campo es requerido" : "";
    errors.value["quantity" + index] =
      supplie.quantity === null || supplie.quantity === 0
        ? "Este campo es requerido"
        : "";
  });

  const hasErrors = Object.values(errors.value).some((error) => error !== "");
  if (hasErrors) {
    return;
  }

  props.item.price = Number(props.item.price);
  props.item.supplies.forEach((supplie) => {
    supplie.price = Number(supplie.price);
    supplie.quantity = Number(supplie.quantity);
  });

  invoiceStore.items = invoiceStore.items.filter((item) => item.id !== props.item.id);
  invoiceStore.items.push(props.item);
  ProductStore.ProductsActive = [];
  ProductStore.getProductsActive();
  invoiceStore.modalAddProduct = false;
}
</script>
