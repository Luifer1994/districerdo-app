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
                v-model="ClientStore.search"
                @keyup.enter="ClientStore.searchClient()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="8" md="6" class="text-right">
              <ModalCeateClient></ModalCeateClient>
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
              
                <tr v-for="client in ClientStore.clients" :key="client.id">
                  <td>{{ client.full_name }}</td>
                  <td>
                    {{ client.document_number }}
                  </td>
                  <td>{{ client.email }}</td>
                  <td>{{ client.phone }}</td>
                  <td>
                    <v-btn
                      color="secondary"
                      size="x-small"
                      v-if="this.validatePermission(['clients-update'])"
                      @click="CityStore.searchCity(client.city.name),ClientStore.showClient(client.id)"
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
              v-model="ClientStore.currentPage"
              :length="ClientStore.lastPage"
              :total-visible="5"
              :show-first-last-page="true"
              @update:modelValue="ClientStore.changePage($event)"
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
import { useClientStore } from "@/stores/clients/clientStore";
import { useCityStore } from "@/stores/cities/cityStore";
import ModalCeateClient from "./ModalCeateClient.vue";

const ClientStore = useClientStore();
const CityStore = useCityStore();
const page = ref({ title: "Clientes" });
const breadcrumbs = ref([
  {
    text: "Clientes",
    disabled: false,
    href: "#",
  },
  {
    text: "Listado de clientes",
    disabled: true,
    href: "#",
  },
]);

//mounted
onMounted(() => {
  ClientStore.getClients();
});
</script>
