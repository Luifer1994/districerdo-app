import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";

import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const Lighttheme: ThemeDefinition = {
  dark: false,
  variables: {},
  colors: {
    primary: "#52B2ED",
    info: "#03c9d7",
    success: "#05b187",
    accent: "#fc4b6c",
    warning: "#fec90f",
    error: "#fc4b6c",
    secondary: "#F16262",
  },
};

const Darktheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#52B2ED",
    info: "#03c9d7",
    success: "#05b187",
    accent: "#fc4b6c",
    warning: "#fec90f",
    error: "#fc4b6c",
    secondary: "#F16262",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: Lighttheme,
      dark: Darktheme,
    },
  },
  defaults: {
    VBtn: {
      color: "primary",
      rounded: "md",
      flat: true,
      fontWeight: "400",
      letterSpacing: "0",
    },
    VCard: {
      flat: true,
      elevation: 10,
    },
  },
});
