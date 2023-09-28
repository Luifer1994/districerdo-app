<template>
  <div class="d-flex justify-end mr-5 mt-4">
    <v-dialog v-model="providerStore.modalNewproviderActive" width="800" persistent>
      <template v-slot:activator="{ props }">
        <v-btn
          prepend-icon="mdi-plus-circle"
          color="primary"
          v-bind="props"
          v-if="validatePermission(['providers-create'])"
          >Crear proveedor</v-btn
        >
      </template>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            {{ providerStore.provider.id ? "Editar proveedor" : "Crear proveedor" }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
            <v-row>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="name"
                  v-slot="{ field, errors }"
                  v-model="providerStore.provider.name"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Nombre"
                    :error-messages="errors"
                    v-model="providerStore.provider.name"
                   
                  />
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="last_name"
                  v-slot="{ field, errors }"
                  v-model="providerStore.provider.last_name"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Apellido"
                    :error-messages="errors"
                    v-model="providerStore.provider.last_name"
                  />
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="document_type_id"
                  v-slot="{ field, errors }"
                  v-model="providerStore.provider.document_type_id"
                >
                  <v-autocomplete
                    :disabled="DocumentTypesStore.documentTypes.length === 0"
                    clearable
                    label="Tipo de documento"
                    variant="outlined"
                    density="compact"
                    :items="DocumentTypesStore.documentTypes"
                    v-model="providerStore.provider.document_type_id"
                    item-title="name"
                    item-value="id"
                    no-data-text="No hay datos"
                    :error-messages="errors"
                  ></v-autocomplete>
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="document_number"
                  v-slot="{ field, errors }"
                  v-model="providerStore.provider.document_number"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Número de documento"
                    :error-messages="errors"
                    v-model="providerStore.provider.document_number"
                    type="number"
                    :min="1"
                  />
                </Field>
              </v-col>

              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="email"
                  v-slot="{ field, errors }"
                  v-model="providerStore.provider.email"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Correo electrónico"
                    :error-messages="errors"
                    v-model="providerStore.provider.email"
                    type="email"
                  />
                </Field>
              </v-col>

              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="phone"
                  v-slot="{ field, errors }"
                  v-model="providerStore.provider.phone"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Teléfono"
                    :error-messages="errors"
                    v-model="providerStore.provider.phone"
                    type="number"
                  />
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="address"
                  v-slot="{ field, errors }"
                  v-model="providerStore.provider.address"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Dirección"
                    :error-messages="errors"
                    v-model="providerStore.provider.address"
                  />
                </Field>
              </v-col>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="city_id"
                  v-slot="{ field, errors }"
                  v-model="providerStore.provider.city_id"
                >
                  <v-autocomplete
                    label="Ciudad"
                    density="compact"
                    variant="outlined"
                    clearable
                    v-model="providerStore.provider.city_id"
                    @update:search="CityStore.searchCity($event)"
                    :error-messages="errors"
                    :loading="CityStore.loading"
                    :items="CityStore.cities"
                    item-title="name"
                    item-value="id"
                    no-data-text="No hay datos"
                  ></v-autocomplete>
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
                {{ providerStore.provider.id ? "Actualizar" : "Guardar" }}
              </v-btn>
            </div>
          </Form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useDocumentTypesStore } from "@/stores/documentTypes/documentTypesStore";
import { useCityStore } from "@/stores/cities/cityStore";
import { useproviderStore } from "@/stores/providers/providerStore";

const DocumentTypesStore = useDocumentTypesStore();
const CityStore = useCityStore();
const providerStore = useproviderStore();

const schema = yup.object({
  name: yup.string().required("Nombre es requerido"),
  last_name: yup.string().required("Apellido es requerido"),
  document_number: yup
    .string()
    .required("Número de documento es requerido")
    .min(8, "Número de documento debe tener 8 caracteres"),
  document_type_id: yup.number().required("Tipo de documento es requerido").nullable(),
  email: yup
    .string()
    .email("Correo electrónico no válido")
    .required("Correo electrónico es requerido"),
  phone: yup.string().required("Teléfono es requerido").nullable(),
  city_id: yup.number().required("Ciudad es requerido").nullable(),
  address: yup.string().required("Dirección es requerido"),
});

//mounted
onMounted(() => {
  DocumentTypesStore.getDocumentTypes();
});
/**
 * Function onSubmit
 *
 * @param values
 */
function onSubmit(values: any) {
  console.log(values);
  if (providerStore.provider.id) {
    values.id = providerStore.provider.id;
    providerStore.provider = values;
    providerStore.updateprovider(values.id);
  } else {
    providerStore.createprovider();
  }
}

function closedModal() {
  providerStore.modalNewproviderActive = false;
  providerStore.resetprovider();
}
</script>
