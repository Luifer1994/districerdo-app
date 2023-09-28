<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" sm="12">
      <v-card>
        <v-card-text class="pa-5">
          <v-row>
            <!--  <v-col cols="12" lg="4" md="6">
              <v-text-field
                density="compact"
                v-model="search"
                label="Search Contacts"
                hide-details
                variant="outlined"
              ></v-text-field>
            </v-col> -->
            <!-- <v-col cols="12" lg="8" md="6" class="text-right">
               
            </v-col> -->
          </v-row>
          <ModalCreateNewRol></ModalCreateNewRol>
          <v-table class="mt-5">
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>NÚMERO DE PERMISOS</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in RoleAndPermissionStore.roles" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.description }}</td>
                <td>
                  <v-badge
                    color="primary"
                    :content="item.permissions_count"
                    inline
                  ></v-badge>
                </td>

                <td>
                  <v-btn
                  color="primary"
                  density="compact"
                  icon="mdi-pencil"
                    @click="getRoleById(item.id)"
                    v-if="$validatePermissions(['update-roles'])"
                  >
                    <i
                      class="mdi-marker mdi v-icon notranslate v-theme--light v-icon--size-default"
                      aria-hidden="true"
                    ></i>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import ModalCreateNewRol from "./ModalCreateNewRol.vue";
import { useRolesAndPermissionsStore } from "@/stores/rolesAndPermissions/rolesAndPermissionsStore";
const RoleAndPermissionStore = useRolesAndPermissionsStore();

//mounted
onMounted(() => {
  RoleAndPermissionStore.getRoles();
});

const page = ref({ title: "Configuración" });
const breadcrumbs = ref([
  {
    text: "Seguridad",
    disabled: false,
    href: "#",
  },
  {
    text: "Listado de roles",
    disabled: true,
    href: "#",
  },
]);

//getRoleById
const getRoleById = (id: number) => {
  RoleAndPermissionStore.getRoleById(id);
};
</script>
