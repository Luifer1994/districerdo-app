<template>
  <v-dialog width="1000" persistent v-model="invoiceStore.modalAddProduct">
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
              producto:
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
              label="Precio unitario"
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
          <v-col cols="12" md="6">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Cantidad"
              hide-details
              min="1"
              type="text"
              v-model="item.quantity"
              @input="validateNumberInput('quantity', item)"
              :rules="getValidationRules('quantityProduct', null)"
            ></v-text-field>
            <span class="text-caption text-red">{{ errors.quantityProduct }}</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              variant="outlined"
              density="compact"
              label=" Lote"
              hide-details
              type="text"
              v-model="item.batch"
              :rules="getValidationRules('batch', null)"
            ></v-text-field>
            <span class="text-caption text-red">{{ errors.batch }}</span>
          </v-col>
        </v-row>
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
import { Item } from "../../stores/Products/ProductInterface";
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
  quantityProduct?: string;
  batch?: string;
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

    case "batch":
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
  if (!props.item.quantity) {
    errors.value.quantityProduct = "Este campo es requerido";
    return;
  }
  if (!props.item.batch) {
    errors.value.batch = "Este campo es requerido";
    return;
  }

  const hasErrors = Object.values(errors.value).some((error) => error !== "");
  if (hasErrors) {
    return;
  }
  const validateStock = await ProductStore.validateStock(props.item);

  if (validateStock) {
    props.item.price = Number(props.item.price);
    // Filtrar elementos existentes con las mismas condiciones id y batch
    invoiceStore.items = invoiceStore.items.filter(
      (item) => item.id !== props.item.id || item.batch !== props.item.batch
    );
    // Luego, agregar el nuevo elemento
    invoiceStore.items.push(props.item);

    ProductStore.ProductsActive = [];
    ProductStore.getProductsActive("");
    invoiceStore.modalAddProduct = false;
  }
}
</script>
