import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";
import router from "../router";
import { useLoadingStore } from "@/stores/loadingStore";


const axiosHttp = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

axiosHttp.interceptors.request.use(
  config => {

    useLoadingStore().dialog = true;

    const currentUser = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    if (currentUser) {
      config.headers["Authorization"] = `Bearer ${currentUser} `;
    }

    return config;
  },
  error => {
    useLoadingStore().dialog = false;
    Promise.reject(error.response || error.message);
  }
);

axiosHttp.interceptors.response.use(
  response => {
    useLoadingStore().dialog = false;

    if (response.data.message && response.status === 201) {
      useNotification().notify({
        title: response.data.message,
        type: "success",
      });
    }
    return response;
  },
  error => {

    if (error.response.data && (error.response.status !== 403 || error.response.status !== 401)) {
      Object.keys(error.response.data).forEach((key) => {
        if (error.response.data[key] && key !== 'status') {
          useNotification().notify({
            title: error.response.data[key],
            type: "error",
          });
        }
      });
    }

    if (error.response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userLoged");
      useNotification().notify({
        title: "No tienes permisos para realizar esta acción, inicia sesión nuevamente",
        type: "error",
      });
      router.push('/auth/login');
    }


    if (error.response.status === 401) {
      if (error.response.data.tokenRefresh) {
        localStorage.setItem("token", error.response.data.tokenRefresh);
        return axiosHttp.request(error.config);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("userLoged");
      useLoadingStore().dialog = false;
      useNotification().notify({
        title: "Tu sesión ha expirado, inicia sesión nuevamente",
        type: "error",
      });
      router.push('/auth/login');
    } else {
      useLoadingStore().dialog = false;
      return Promise.reject(error.response || error.message);
    }
  }
);

export default axiosHttp;




