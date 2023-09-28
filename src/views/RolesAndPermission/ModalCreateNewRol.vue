<template>
  <div class="d-flex justify-end mr-5 mt-4">
    <v-dialog v-model="RoleAndPermissionStore.modalNewRoleActive" width="600" persistent>
      <template v-slot:activator="{ props }">
        <v-btn
          prepend-icon="mdi-plus-circle"
          color="primary"
          v-bind="props"
          v-if="this.$validatePermissions(['create-roles'])"
          >Crear rol</v-btn
        >
      </template>
      <v-card>
        <v-toolbar
          :title="RoleAndPermissionStore.newRol.id ? 'Editar rol' : 'Crear rol'"
        ></v-toolbar>
        <v-card-text>
          <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
            <v-row>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-12 v-col-12">
                <Field
                  name="description"
                  v-slot="{ field, errors }"
                  v-model="RoleAndPermissionStore.newRol.description"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Nombre del rol"
                    :error-messages="errors"
                    v-model="RoleAndPermissionStore.newRol.description"
                  />
                </Field>
              </v-col>
            </v-row>
            <div class="d-flex justify-end">
              <v-btn
                prepend-icon="mdi-close-circle"
                color="secondary"
                class="mr-2"
                @click="closedModal()"
                >Cancelar</v-btn
              >
              <v-btn prepend-icon="mdi-content-save" color="primary" type="submit">
                Guardar</v-btn
              >
            </div>
          </Form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useRolesAndPermissionsStore } from "@/stores/rolesAndPermissions/rolesAndPermissionsStore";
const RoleAndPermissionStore = useRolesAndPermissionsStore();

RoleAndPermissionStore.modalNewRoleActive;
const schema = yup.object({
  description: yup.string().required("Nombre es requerido"),
});
/**
 * Function onSubmit
 *
 * @param values
 */
function onSubmit(values: { description: string }) {
  RoleAndPermissionStore.newRol.name = values.description
    .replace(/ /g, "-")
    .toLowerCase();
  RoleAndPermissionStore.newRol.description = values.description;
  RoleAndPermissionStore.newRol.guard_name = "web";
  if (RoleAndPermissionStore.newRol.id) {
    RoleAndPermissionStore.updateRole();
  } else {
    RoleAndPermissionStore.createRole();
  }
}

function closedModal() {
  RoleAndPermissionStore.modalNewRoleActive = false;
  RoleAndPermissionStore.newRol = {
    id: null,
    name: "",
    description: "",
    guard_name: "",
  };
}
</script>
