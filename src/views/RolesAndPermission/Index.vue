<template>
  <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
  <v-card>
   <ModalCreateNewRol></ModalCreateNewRol>
    <v-card-text class="pa-5">
      <v-row>
        <v-col cols="6" class="v-col-sm-12 v-col-lg-6 v-col-12">
          <v-autocomplete
            :disabled="RoleAndPermissionStore.roles.length === 0"
            clearable
            label="Rol"
            variant="outlined"
            density="compact"
            :items="RoleAndPermissionStore.roles"
            v-model="RoleAndPermissionStore.roleSelected"
            @update:modelValue="resectStore($event)"
            item-title="description"
            item-value="id"

            :loading="loading"
            no-data-text="No hay datos"
          ></v-autocomplete>
        </v-col>
        <v-col cols="6" class="v-col-sm-12 v-col-lg-6 v-col-12">
          <!-- <v-text-field label="Módulo" variant="outlined" required></v-text-field> -->
          <v-autocomplete
            :disabled="!RoleAndPermissionStore.roleSelected"
            label="Módulo"
            density="compact"
            variant="outlined"
            clearable
            v-model="RoleAndPermissionStore.groupSelected"
            @update:search="RoleAndPermissionStore.getGroups($event)"
            @update:modelValue="getPermissions()"
            :loading="loading"
            :items="RoleAndPermissionStore.groups"
            item-title="group"
            item-value="id"
            no-data-text="No hay datos"
          ></v-autocomplete>
        </v-col>
        <v-col>
          <v-container fluid>
            <v-row>
              <v-col
                cols="12"
                sm="4"
                md="4"
                v-for="permission in RoleAndPermissionStore.permissions"
                :key="permission.id"
              >
                <v-switch
                  v-model="permission.checked"
                  :label="permission.description"
                  color="success"
                  hide-details
                  inset
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <div class="d-flex justify-end mr-1">
        <v-btn
          color="success"
          prepend-icon="mdi-content-save"
          @click="RoleAndPermissionStore.assignPermissions()"
          :disabled="RoleAndPermissionStore.permissions.length === 0"
        >
          Guardar
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
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

const page = ref({ title: "Configuración de roles y permisos" });

let loading = RoleAndPermissionStore.loading;


//create function getPermissions
const getPermissions = async function () {
  await RoleAndPermissionStore.getPermissions();
};
//create function resectStore
const resectStore = function (val: string | null) {
  if (val == null) {
    RoleAndPermissionStore.roleSelected = null;
    RoleAndPermissionStore.groupSelected = "";
    RoleAndPermissionStore.permissions = [];
  }
};

</script>
