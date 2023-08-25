<template>
  <v-row class="h-100vh">
    <v-col
      cols="12"
      lg="7"
      xl="6"
      class="bg-primary d-none d-md-flex align-center justify-center"
    >
      <v-container>
        <div class="pa-10">
          <v-row justify="center">
            <v-col cols="8" xl="5">
              <div>
                <h2 class="text-h4 text-white font-weight-medium">
                  DISTRICERDO - TT
                </h2>
                <h6
                  class="text-subtitle-1 text-high-emphasis mt-4 text-white font-weight-regular"
                >
                  Bienvenido a la aplicación de administración de DISTRICERDO - TT.
                </h6>
                <!-- <v-btn
                  class="mt-6 text-capitalize"
                  size="x-large"
                  variant="outlined"
                  color="white"
                  >Conoce más </v-btn
                > -->
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <v-col cols="12" lg="5" xl="6" class="d-flex align-center">
      <v-container>
        <Loading />
        <div class="pa-7 pa-sm-12">
          <v-row>
            <v-col cols="12" lg="9" xl="6">
              <img :width="300" src="@/assets/images/logos/logo-login.png" />
              <h2 class="font-weight-bold mt-4 text--darken-2">Iniciar sesión</h2>
              <h6 class="text-subtitle-1 text-grey-darken-1">
                Bienvenido
              </h6>

              <v-form
                ref="form"
                lazy-validation
                class="mt-7"
              >
                <v-text-field
                  v-model="authStore.dataLogin.email"
                  :rules="emailRules"
                  label="E-mail"
                  class="mt-4"
                  required
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  v-model="authStore.dataLogin.password"
                  :rules="passwordRules"
                  label="Password"
                  required
                  variant="outlined"
                  type="password"
                ></v-text-field>

                
                <v-btn color="secondary" block class="mr-4" @click="authStore.login()"
                  >Login</v-btn
                >
              </v-form>

            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth/authStore";
import Loading from "../../components/Loading.vue";

const authStore = useAuthStore();
const passwordRules = ref([
  (v: string) => !!v || "Contraseña es requerida",
  (v: string) => (v.length >= 8) || "Contraseña debe tener al menos 8 caracteres",
]);
const emailRules = ref([
  (v: string) => !!v || "E-mail es requerido",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail debe ser válido",
]);
</script>
