import { ref } from "vue";
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import { useNotification } from "@kyvg/vue3-notification";
import { CityResponse, City } from "./cityInterfaces";

export const useCityStore = defineStore("cityStore", {
  //state
  state: () => {
    return {
      notification: useNotification(),
      cities: [] as City[],
      loading: false as boolean,
      errors: {} as any,
      city: {} as City,
      currentPage: ref(1),
      totalPages: ref(0),
      lastPage: ref(0),
      search: ref(""),
      loaging: false as boolean,
    };
  },
  //actions
  actions: {
    //get all cities
    async getCities() {
      this.loading = true;
      try {
        const response = await axiosHttp.get<CityResponse>(
          `/cities/list?page=${this.currentPage}&search=${this.search}`
        );
        this.currentPage = response.data.data.current_page;
        this.totalPages = response.data.data.total;
        this.lastPage = response.data.data.last_page;
        this.cities = response.data.data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.notification.error({
          title: "Error",
          message: "No se pudo obtener las ciudades",
        });
      }
    },
    async searchCity(val: string) {
      this.search = val;
      this.currentPage = 1;
      this.loaging = true;
      await this.getCities();
      this.loaging = false;
    },
  },
});
