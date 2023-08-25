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
import { validatePermission,userRole } from './utils/validatePermission';
import Notifications from '@kyvg/vue3-notification';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App);
app.component(VueFeather.name, VueFeather);
app.config.globalProperties.validatePermission = validatePermission;
app.config.globalProperties.userRole = userRole;
app.use(PerfectScrollbar);
app.use(InstantSearch);
app.use(createPinia());
app.use(VCalendar, {});
app.use(VueApexCharts);
app.use(Notifications)
app.use(router);
app.use(vuetify).mount("#app");
