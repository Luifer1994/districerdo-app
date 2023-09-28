<template>
  <div class="d-flex justify-end mr-5 mt-4">
    <v-dialog v-model="UserStore.modalNewUserActive" width="800" persistent>
      <template v-slot:activator="{ props }">
        <v-btn
          prepend-icon="mdi-account-multiple-plus"
          color="primary"
          v-bind="props"
          v-if="this.$validatePermissions(['users-create'])"
          @click="DocumentTypesStore.getDocumentTypes(), RoleStore.getRoles()"
        >
          Crear usuario
        </v-btn>
      </template>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            {{ UserStore.user.id ? "Editar usuario" : "Crear usuario" }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
            <v-row>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="name"
                  v-slot="{ field, errors }"
                  v-model="UserStore.user.name"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Nombre"
                    :error-messages="errors"
                    v-model="UserStore.user.name"
                    autocomplete="new"
                  />
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="last_name"
                  v-slot="{ field, errors }"
                  v-model="UserStore.user.last_name"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Apellido"
                    :error-messages="errors"
                    v-model="UserStore.user.last_name"
                    autocomplete="new"
                  />
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="document_type_id"
                  v-slot="{ field, errors }"
                  v-model="UserStore.user.document_type_id"
                >
                  <v-autocomplete
                    :disabled="DocumentTypesStore.documentTypes.length === 0"
                    clearable
                    label="Tipo de documento"
                    variant="outlined"
                    density="compact"
                    :items="DocumentTypesStore.documentTypes"
                    v-model="UserStore.user.document_type_id"
                    item-title="name"
                    item-value="id"
                    no-data-text="No hay datos"
                    :error-messages="errors"
                  ></v-autocomplete>
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="document"
                  v-slot="{ field, errors }"
                  v-model="UserStore.user.document"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Número de documento"
                    :error-messages="errors"
                    v-model="UserStore.user.document"
                    type="number"
                    :min="1"
                    autocomplete="new"
                  />
                </Field>
              </v-col>

              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="email"
                  v-slot="{ field, errors }"
                  v-model="UserStore.user.email"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Correo electrónico"
                    :error-messages="errors"
                    v-model="UserStore.user.email"
                    type="email"
                    autocomplete="new"
                  />
                </Field>
              </v-col>

             
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="role"
                  v-slot="{ field, errors }"
                  v-model="UserStore.user.role"
                >
                  <v-select
                    label="Rol"
                    density="compact"
                    variant="outlined"
                    clearable
                    :items="RoleStore.roles"
                    v-model="UserStore.user.role"
                    :error-messages="errors"
                    item-title="description"
                    item-value="name"
                  ></v-select>
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="password"
                  v-slot="{ field, errors }"
                  v-model="UserStore.user.password"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Contraseña"
                    :error-messages="errors"
                    v-model="UserStore.user.password"
                    type="password"
                    autocomplete="new-password"
                  />
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="password_confirm"
                  v-slot="{ field, errors }"
                  v-model="UserStore.user.password_confirm"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Confirmar contraseña"
                    :error-messages="errors"
                    v-model="UserStore.user.password_confirm"
                    type="password"
                    autocomplete="new-password"
                  />
                </Field>
              </v-col>
            </v-row>
            <v-divider color="primary" class="mt-4 mb-4"></v-divider>
            <div class="d-flex justify-end">
              <v-btn
                prepend-icon="mdi-close-circle"
                color="secondary"
                class="mr-2"
                @click="closedModal()"
                >Cancelar</v-btn
              >
              <v-btn prepend-icon="mdi-content-save" color="primary" type="submit">
                {{ UserStore.user.id ? "Actualizar" : "Guardar" }}
              </v-btn>
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
import { useDocumentTypesStore } from "@/stores/documentTypes/documentTypesStore";
import { useUserStore } from "@/stores/users/userStore";
import { useRolesAndPermissionsStore } from "@/stores/rolesAndPermissions/rolesAndPermissionsStore";

const DocumentTypesStore = useDocumentTypesStore();
const UserStore = useUserStore();
const RoleStore = useRolesAndPermissionsStore();

const schema = yup.object({
  name: yup.string().required("Nombre es requerido"),
  last_name: yup.string().required("Apellido es requerido"),
  document: yup
    .string()
    .required("Número de documento es requerido")
    .min(8, "Número de documento debe tener 8 caracteres"),
  document_type_id: yup.number().required("Tipo de documento es requerido").nullable(),
  email: yup
    .string()
    .email("Correo electrónico no válido")
    .required("Correo electrónico es requerido"),

  password: yup
    .string()
    .when("id", {
      is: (val: any) => !UserStore.user.id,
      then: yup.string().required("Contraseña es requerida"),
    })
    .min(8, "Contraseña debe tener 8 caracteres"),

  password_confirm: yup
    .string()
    .when("id", {
      is: (val: any) => !UserStore.user.id,
      then: yup.string().required("Confirmar contraseña es requerida"),
    })
    .oneOf([yup.ref("password"), null], "Contraseñas no coinciden"),

  role: yup.string().required("Rol es requerido").nullable(),
});

const genders = ref([
  { text: "Masculino", value: "Masculino" },
  { text: "Femenino", value: "Femenino" },
]);

/**
 * Function onSubmit
 *
 * @param values
 */
async function onSubmit(values: any) {
  if (UserStore.user.id) {
    values.id = UserStore.user.id;
    UserStore.user = values;
    await UserStore.updateUser(values.id);
  } else {
    await UserStore.createUser();
  }
  await UserStore.getUsers();
}

function closedModal() {
  UserStore.modalNewUserActive = false;
  UserStore.resetUser();
}
</script>
