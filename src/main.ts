import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@/scss/style.scss";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import VueApexCharts from "vue3-apexcharts";
import InstantSearch from "vue-instantsearch/vue3/es";
import VCalendar from "v-calendar";
import VueFeather from "vue-feather";
import validatePermissions from "./plugins/validatePermissions";
import Notifications from "@kyvg/vue3-notification";
import "sweetalert2/dist/sweetalert2.min.css";

const app = createApp(App);
app.component(VueFeather.name, VueFeather);
app
  .use(validatePermissions)
  .use(PerfectScrollbar)
  .use(InstantSearch)
  .use(createPinia())
  .use(VCalendar, {})
  .use(VueApexCharts)
  .use(Notifications)
  .use(router)
  .use(vuetify)
  .mount("#app");
