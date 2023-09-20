//define and create store for clients module using pinia
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import { useNotification } from "@kyvg/vue3-notification";
import { Client,CreateClientResponse } from "./clientInterface";
import { ref } from "vue";

export const useClientStore = defineStore("clientStore", {
  //state
  state: () => {
    return {
      notification: useNotification(),
      clients: [] as Client[],
      clientSelected: null as Number,
      loading: false as boolean,
      modalNewClientActive: false as boolean,
      errors: {} as any,
      client: {} as Client,
      //ref
      currentPage: ref(1),
      totalPages: ref(0),
      lastPage: ref(0),
      search: ref(""),
    };
  },

  //actions
  actions: {
    //get all clients
    async getClients() {
      this.loading = true;
      try {
        const response = await axiosHttp.get(
          `/clients/list?page=${this.currentPage}&search=${this.search}`
        );
        this.currentPage = response.data.data.current_page;
        this.totalPages = response.data.data.total;
        this.lastPage = response.data.data.last_page;
        this.clients = response.data.data.data;

        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    //search clients
    async searchClients(termine:string) {
      this.loading = true;
      try {
        const response = await axiosHttp.get(
          `/clients/search?search=${termine}`
        );
        this.clients = response.data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    //create client
    async createClient() {
        this.loading = true;
        try {
            await axiosHttp.post<CreateClientResponse>('/clients/create', this.client);
            this.modalNewClientActive = false;
            this.loading = false;
            this.resetClient();
            await this.getClients();
        } catch (error) {
            this.loading = false;
        }
    },

    //show client
    async showClient(id: Number) {
      this.loading = true;
      try {
        const response = await axiosHttp.get(`/clients/show/${id}`);
        this.client = response.data.data;
        console.log(this.client);
        this.modalNewClientActive = true;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    
    //update client
    async updateClient(id : Number) {
      this.loading = true;
      try {
        await axiosHttp.put(`/clients/update/${id}`, this.client);
        this.loading = false;
        this.modalNewClientActive = false;
        this.resetClient();
        await this.getClients();
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    async changePage(page: Number) {
      this.currentPage = page;
      await this.getClients();
    },
    async searchClient() {
      this.currentPage = 1;
      await this.getClients();
    },

    resetClient() {
      this.client = {} as Client;
    }
  },
});
