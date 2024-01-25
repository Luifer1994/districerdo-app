<template>
  <div class="d-flex justify-end mr-5 mt-4">
    <v-dialog v-model="purchaseStore.modalPartialPaymentActive" width="800" persistent>
      <v-card>
        <v-toolbar>
          <v-toolbar-title> Registrar pago parcial de compra </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <h4>Información de la compra</h4>
          <p><strong>Compra: </strong> {{ purchaseStore.purchase.code }}</p>
          <p>
            <strong>Cliente: </strong> {{ purchaseStore.purchase.provider.name }}
            {{ purchaseStore.purchase.provider.last_name }}
          </p>
          <p>
            <strong>Valor de la compra: </strong>
            {{
              purchaseStore.purchase.total
                .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                .split(",")[0]
            }}
          </p>
          <p>
            <strong>Saldo de la compra: </strong>
            {{
              purchaseStore.purchase.total_for_pay
                .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                .split(",")[0]
            }}
          </p>
          <p>
            <strong>Total abonado: </strong>
            {{
              purchaseStore.purchase.total_paid
                .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                .split(",")[0]
            }}
          </p>

          <v-divider color="primary" class="mt-4 mb-4"></v-divider>

          <h4>Datos del pago parcial</h4>
          <v-divider color="primary" class="mt-4 mb-4"></v-divider>

          <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
            <v-row>
              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="amount"
                  v-slot="{ field, errors }"
                  v-model="purchaseStore.partialPayment.amount"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Monto a abonar"
                    :error-messages="errors"
                    v-model="purchaseStore.partialPayment.amount"
                    type="number"
                  />
                </Field>
              </v-col>

              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="description"
                  v-slot="{ field, errors }"
                  v-model="purchaseStore.partialPayment.description"
                >
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-bind="field"
                    label="Descripción del pago parcial"
                    :error-messages="errors"
                    v-model="purchaseStore.partialPayment.description"
                    type="text"
                  />
                </Field>
              </v-col>

              <v-col cols="12" class="v-col-sm-12 v-col-lg-6 v-col-6">
                <Field
                  name="evidence"
                  v-slot="{ field, errors }"
                  v-model="purchaseStore.partialPayment.evidence"
                >
                  <v-file-input
                    v-model="purchaseStore.partialPayment.evidence"
                    placeholder="Seleccione una imagen"
                    label="Evidencia del pago parcial"
                    accept="image/*"
                    prepend-icon="mdi-paperclip"
                    variant="outlined"
                    density="compact"
                  >
                    <template v-slot:selection="{ fileNames }">
                      <template v-for="fileName in fileNames" :key="fileName">
                        <v-chip size="small" label color="primary" class="me-2">
                          {{ fileName }}
                        </v-chip>
                      </template>
                    </template>
                  </v-file-input>
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
                Guardar
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

import { usePurchaseStore } from "@/stores/purchases/purchaseStore";
const purchaseStore = usePurchaseStore();

const schema = yup.object({
  amount: yup.number().required("Monto es requerido").min(1, "Monto debe ser mayor a 0"),
});

/**
 * Function onSubmit
 *
 * @param values
 */
async function onSubmit(values: any) {
  await purchaseStore.createPartialPayment();
}

function closedModal() {
  purchaseStore.resetPartialPayment();
}
</script>
