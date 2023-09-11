//define and create store for providers module using pinia
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import { useNotification } from "@kyvg/vue3-notification";
import { provider, CreateproviderResponse } from "./providerInterface";
import { ref } from "vue";

export const useproviderStore = defineStore("providerStore", {
  //state
  state: () => {
    return {
      notification: useNotification(),
      providers: [] as provider[],
      providerSelected: null as Number,
      loading: false as boolean,
      modalNewproviderActive: false as boolean,
      errors: {} as any,
      provider: {} as provider,
      //ref
      currentPage: ref(1),
      totalPages: ref(0),
      lastPage: ref(0),
      search: ref(""),
    };
  },

  //actions
  actions: {
    //get all providers
    async getproviders() {
      this.loading = true;
      try {
        const response = await axiosHttp.get(
          `/providers/list?page=${this.currentPage}&search=${this.search}`
        );
        this.currentPage = response.data.data.current_page;
        this.totalPages = response.data.data.total;
        this.lastPage = response.data.data.last_page;
        this.providers = response.data.data.data;

        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    //create provider
    async createprovider() {
      this.loading = true;
      try {
        await axiosHttp.post<CreateproviderResponse>(
          "/providers/create",
          this.provider
        );
        this.modalNewproviderActive = false;
        this.loading = false;
        this.resetprovider();
        await this.getproviders();
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    //show provider
    async showprovider(id: Number) {
      this.loading = true;
      try {
        const response = await axiosHttp.get(`/providers/show/${id}`);
        this.provider = response.data.data;
        console.log(this.provider);
        this.modalNewproviderActive = true;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    //

    //update provider
    async updateprovider(id: Number) {
      this.loading = true;
      try {
        await axiosHttp.put(`/providers/update/${id}`, this.provider);
        this.loading = false;
        this.modalNewproviderActive = false;
        this.resetprovider();
        await this.getproviders();
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    //search provider
    async searchProvider(termine: string) {
      console.log(termine);
      this.loading = true;
      if (!termine) {
        termine = "";
      }
      try {
        const response = await axiosHttp.get(
          `/providers/search?search=${termine}`
        );
        this.providers = response.data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    async changePage(page: Number) {
      this.currentPage = page;
      await this.getproviders();
    },
    async searchprovider() {
      this.currentPage = 1;
      await this.getproviders();
    },

    resetprovider() {
      this.provider = {} as provider;
    },
  },
});
