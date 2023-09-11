<template>
  <v-form>
    <v-row>
      <v-col
        v-for="field in fields"
        :key="field.name"
        :cols="field.cols"
        class="v-col-sm-12 v-col-lg-6 v-col-6"
      >
        <template v-if="field.type === 'text'">
          <v-text-field
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
          ></v-text-field>
        </template>

        <template v-if="field.type === 'number'">
          <v-text-field
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
            type="number"
            :min="0"
          ></v-text-field>
        </template>

        <template v-if="field.type === 'email'">
          <v-text-field
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
            type="email"
          ></v-text-field>
        </template>
        <template v-else-if="field.type === 'select'">
          <v-select
            v-model="field.value"
            :label="field.label"
            :items="field.options"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
            item-title="name"
            item-value="id"
          ></v-select>
        </template>
        <template v-else-if="field.type === 'checkbox'">
          <v-checkbox
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
          ></v-checkbox>
        </template>
        <template v-else-if="field.type === 'radio'">
          <v-radio-group v-model="field.value" :label="field.label" :rules="field.rules">
            <v-radio
              v-for="opcion in field.opciones"
              :key="opcion.value"
              :label="opcion.text"
              :value="opcion.value"
              :error-messages="field.messaggeError"
              variant="outlined"
              density="compact"
            ></v-radio>
          </v-radio-group>
        </template>
        <template v-else-if="field.type === 'textarea'">
          <v-textarea
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
          ></v-textarea>
        </template>
        <template v-else-if="field.type === 'file'">
          <v-file-input
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
          ></v-file-input>
        </template>
        <template v-else-if="field.type === 'date'">
          <v-date-picker
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
          ></v-date-picker>
        </template>
        <template v-else-if="field.type === 'autocomplete'">
          <v-autocomplete
            v-model="field.value"
            clearable
            :label="field.label"
            :items="field.opciones"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
            item-title="name"
            item-value="id"
            no-data-text="No hay datos"
          ></v-autocomplete>
        </template>
        <template v-else-if="field.type === 'combobox'">
          <v-combobox
            v-model="field.value"
            :label="field.label"
            :items="field.opciones"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
            item-title="name"
            item-value="id"
          ></v-combobox>
        </template>
        <template v-else-if="field.type === 'slider'">
          <v-slider
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
          ></v-slider>
        </template>
        <template v-else-if="field.type === 'switch'">
          <v-switch
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
          ></v-switch>
        </template>
        <template v-else-if="field.type === 'rating'">
          <v-rating
            v-model="field.value"
            :label="field.label"
            :rules="field.rules"
            :error-messages="field.messaggeError"
            variant="outlined"
            density="compact"
          ></v-rating>
        </template>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      required: true,
    },
  },
};
</script>
