<template>
  <div class="d-flex justify-end mr-5 mt-4">
    <v-dialog v-model="ProductStore.modalNewProductActive" width="800" persistent>
      <template v-slot:activator="{ props }">
        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          v-bind="props"
          v-if="this.validatePermission(['products-create'])"
        >
          Crear servicio
        </v-btn>
      </template>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            {{ ProductStore.Product.id ? "Editar servicio" : "Crear servicio" }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <Form :fields="fields"></Form>
          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-end">
            <v-btn
              prepend-icon="mdi-close-circle"
              color="secondary"
              class="mr-2"
              @click="closedModal()"
              >Cancelar</v-btn
            >
            <v-btn prepend-icon="mdi-content-save" color="primary" @click="submit">
              {{ ProductStore.Product.id ? "Actualizar" : "Registrar" }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useProductStore } from "@/stores/Products/ProductStore";
import { useCategoryStore } from "@/stores/categories/categoryStore";
import { Product } from "@/stores/Products/ProductInterface";
import Form from "@/components/Forms/Form.vue";

const ProductStore = useProductStore();
const CategoryStore = useCategoryStore();

watch(
  () => ProductStore.Product.id,
  (newId) => {
    if (newId) {
      fields.value.forEach((field) => {
        field.value = ref(ProductStore.Product[field.name]);
      });
    }
  }
);
const initialFieldRules = {
  name: [(v) => !!v || "Este campo es requerido"],
  description: [],
  category_id: [(v) => !!v || "Este campo es requerido"],
};
let fields = ref([
  {
    name: "name" as string,
    label: "Nombre" as string,
    type: "text" as string,
    value: ref(ProductStore.Product.name).value ?? "",
    cols: 12 as number,
    rules: [(v) => !!v || "Este campo es requerido"] as Array<Function>,
    messaggeError: "" as string,
  },
  {
    name: "description" as string,
    label: "Descripción" as string,
    type: "text" as string,
    value: ref(ProductStore.Product.description).value ?? "",
    cols: 12 as number,
    rules: [] as Array<Function>,
    messaggeError: "" as string,
  },
  {
    name: "category_id" as string,
    label: "Categoría" as string,
    type: "select" as string,
    value: ref(ProductStore.Product.category_id).value ?? "",
    options: computed(() => CategoryStore.categories),
    cols: 12 as number,
    rules: [(v) => !!v || "Este campo es requerido"] as Array<Function>,
    messaggeError: "" as string,
  }
]);

async function submit() {
  // Validar los fields
  let formValid = true;
  fields.value.forEach((field) => {
    field.messaggeError = "";
    field.rules.forEach((rule) => {
      const result = rule(field.value);
      if (result !== true) {
        field.messaggeError = result;
        formValid = false;
      }
    });
  });

  if (formValid) {
    const payload = {};
    fields.value.forEach((field) => {
      payload[field.name] = field.value;
    });
    if (ProductStore.Product.id) {
      payload["id"] = ProductStore.Product.id;
    }
    ProductStore.Product = payload as Product;
    if (ProductStore.Product.id) {
      await ProductStore.updateProduct();
    } else {
      await ProductStore.createProduct();
    }
    await ProductStore.getProducts();

    closedModal();
  }
}

function closedModal() {
  ProductStore.currentPage = 1;
  ProductStore.modalNewProductActive = false;
  ProductStore.resetProduct();
  fields.value.forEach((field) => {
    field.rules = initialFieldRules[field.name];
    field.messaggeError = "";
    field.value = "";
  });
}
</script>
