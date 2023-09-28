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
                v-model="UserStore.search"
                @keyup.enter="UserStore.searchUser()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="8" md="6" class="text-right">
              <ModalCeateUser></ModalCeateUser>
            </v-col>
          </v-row>
          <v-container fluid>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>NOMBRE_COMPLETO</th>
                  <th>T_DOCUMENTO</th>
                  <th>N_DOCUMENTO</th>
                  <th>CORREO</th>
                  <th>ROL</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
              
                <tr v-for="user in UserStore.users" :key="user.id">
                  <td>{{ user.full_name }}</td>
                  <td>{{ user.document_type.code }}</td>
                  <td>
                    {{ user.document }}
                  </td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.roles[0].description }}</td>
                  <td>
                    <v-btn
                    color="primary"
                    density="compact"
                    icon="mdi-pencil"
                      v-if="this.$validatePermissions(['users-update'])"
                      @click="editUser(user.id)"
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
              v-model="UserStore.currentPage"
              :length="UserStore.lastPage"
              :total-visible="5"
              :show-first-last-page="true"
              @update:modelValue="UserStore.changePage($event)"
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
import { useUserStore } from "@/stores/users/userStore";
import { useRolesAndPermissionsStore } from "@/stores/rolesAndPermissions/rolesAndPermissionsStore";
import {useDocumentTypesStore}from "@/stores/documentTypes/documentTypesStore";

import ModalCeateUser from "./ModalCeateUser.vue";

const UserStore = useUserStore();
const rolesAndPermissions = useRolesAndPermissionsStore();
const documentTypes = useDocumentTypesStore();
const page = ref({ title: "Usuarios" });
const breadcrumbs = ref([
  {
    text: "Usuarios",
    disabled: false,
    href: "#",
  },
  {
    text: "Listado de usuarios",
    disabled: true,
    href: "#",
  },
]);
async function editUser(id: number) {
  await UserStore.getUserById(id);
  await rolesAndPermissions.getRoles();
  await documentTypes.getDocumentTypes();
  UserStore.modalNewUserActive = true;
}
//mounted
onMounted(() => {
  UserStore.getUsers();
});
</script>
