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
                label="Buscar proveedores"
                hide-details
                variant="outlined"
                v-model="providerStore.search"
                @keyup.enter="providerStore.searchprovider()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="8" md="6" class="text-right">
              <ModalCreateProvider></ModalCreateProvider>
            </v-col>
          </v-row>
          <v-container fluid>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>NOMBRE_COMPLETO</th>
                  <th>N_DOCUMENTO</th>
                  <th>CORREO</th>
                  <th>TELÉFONO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="provider in providerStore.providers" :key="provider.id">
                  <td>{{ provider.full_name }}</td>
                  <td>
                    {{ provider.document_number }}
                  </td>
                  <td>{{ provider.email }}</td>
                  <td>{{ provider.phone }}</td>
                  <td>
                    <v-btn
                      color="primary"
                      density="compact"
                      icon="mdi-pencil"
                      v-if="validatePermission(['providers-update'])"
                      @click="
                        CityStore.searchCity(provider.city.name),
                          providerStore.showprovider(provider.id)
                      "
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
              v-model="providerStore.currentPage"
              :length="providerStore.lastPage"
              :total-visible="5"
              :show-first-last-page="true"
              @update:modelValue="providerStore.changePage($event)"
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
import { useproviderStore } from "@/stores/providers/providerStore";
import { useCityStore } from "@/stores/cities/cityStore";
import ModalCreateProvider from "./ModalCreateProvider.vue";

const providerStore = useproviderStore();
const CityStore = useCityStore();
const page = ref({ title: "Proveedores" });
const breadcrumbs = ref([
  {
    text: "Proveedores",
    disabled: false,
    href: "#",
  },
  {
    text: "Listado de proveedores",
    disabled: true,
    href: "#",
  },
]);

//mounted
onMounted(() => {
  providerStore.getproviders();
});
</script>
