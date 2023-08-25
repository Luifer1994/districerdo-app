<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" sm="12">
      <v-card>
        <v-card-text class="pa-5">
          <v-row>
            <v-col cols="12" lg="4" md="6">
              <v-text-field
                density="compact"
                label="Buscar clientes"
                hide-details
                variant="outlined"
                v-model="ProductStore.search"
                @keyup.enter="ProductStore.searchProduct()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="8" md="6" class="text-right">
              <ModalCreateProduct></ModalCreateProduct>
            </v-col>
          </v-row>
          <v-container fluid>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>NOMBRE</th>
                  <th>CATEGORÍA</th>
                  <th class="text-end">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="Product in ProductStore.Products" :key="Product.id">
                  <td class="font-weight-medium"
                  >{{ Product.sku }}</td>
                  <td>{{ Product.name }}</td>
                  
                  <td>{{ Product.category.name }}</td>
                  <td class="text-end">
                    <v-btn
                      color="secondary"
                      size="x-small"
                      v-if="this.validatePermission(['products-update'])"
                      @click="editProduct(Product.id)"
                    >
                      <v-tooltip activator="parent" location="top">Editar</v-tooltip>
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-divider color="primary" class="mt-4 mb-4"></v-divider>
            <v-pagination
              v-model="ProductStore.currentPage"
              :length="ProductStore.lastPage"
              :total-visible="5"
              :show-first-last-page="true"
              @update:modelValue="ProductStore.changePage($event)"
              size="x-small"
            />
          </v-container>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { useProductStore } from "@/stores/Products/ProductStore";
import { useCategoryStore } from "@/stores/categories/categoryStore";
import ModalCreateProduct from "./ModalCreateProduct.vue";

const ProductStore = useProductStore();
const CategoryStore = useCategoryStore();
const page = ref({ title: "Productos" });
const breadcrumbs = ref([
  {
    text: "Servicios",
    disabled: false,
    href: "#",
  },
  {
    text: "Listado de servicios",
    disabled: true,
    href: "#",
  },
]);

async function editProduct(id: Number) {
  await ProductStore.getProductById(id);
  ProductStore.modalNewProductActive = true;
}

//mounted
onMounted(() => {
  ProductStore.getProducts();
  CategoryStore.getCategories();
});
</script>
