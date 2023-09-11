<template>
  <v-dialog width="1000" persistent v-model="purchaseStore.modalAddProduct">
    <v-card>
      <v-toolbar>
        <v-toolbar-title>
          <span class="text-h5 font-weight-bold">Agregar producto</span>
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
              label="Costo unitario"
              hide-details
              prefix="$"
              min="0"
              type="number"
              v-model="item.price"
              :rules="getValidationRules('priceProduct', null)"
            ></v-text-field>
            <span class="text-caption text-red">{{ errors.priceProduct }}</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Cantidad Kg"
              hide-details
              min="1"
              type="number"
              v-model="item.quantity"
              :rules="getValidationRules('quantityProduct', null)"
            ></v-text-field>
            <span class="text-caption text-red">{{ errors.quantityProduct }}</span>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider color="primary" class="mt-4 mb-4"></v-divider>
      <div class="d-flex justify-end mx-4 my-4">
        <v-btn
          prepend-icon="mdi-close-circle"
          color="secondary"
          class="mr-2"
          @click="(purchaseStore.modalAddProduct = false), (errors = {})"
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
import { usePurchaseStore } from "../../stores/purchases/purchaseStore";
import { Item } from "../../stores/Products/ProductInterface";
import { useProductStore } from "../../stores/Products/ProductStore";

// Constants
const purchaseStore = usePurchaseStore();
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
  quantityProduct?:string
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
          if (v === null || v < 0) {
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
    case "quantityProduct":
    case "quantity" + index:
      return [
        (v: number | null) => {
          if (!v) {
            errors.value[field] = "Este campo es requerido";
            return "Este campo es requerido";
          }
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

// Add data in validate after save
async function addData() {
  if (!props.item.price) {
    errors.value.priceProduct = "Este campo es requerido";
    return;
  }
  if (!props.item.quantity) {
    errors.value.quantity = "Este campo es requerido";
    return;
  }

  const hasErrors = Object.values(errors.value).some((error) => error !== "");
  if (hasErrors) {
    return;
  }

  props.item.price = Number(props.item.price);
  props.item.quantity = Number(props.item.quantity);

  purchaseStore.items = purchaseStore.items.filter((item) => item.id !== props.item.id);
  purchaseStore.items.push(props.item);
  ProductStore.ProductsActive = [];
  ProductStore.getProductsActive();
  purchaseStore.modalAddProduct = false;
}
</script>
