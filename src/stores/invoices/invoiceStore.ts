//define and create store for clients module using pinia
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { Item, Supplie } from "../Products/ProductInterface";
import { Invoice, InvoiceListResponse } from "./invoiceInterfaces";

export const useInvoiceStore = defineStore("invoiceStore", {
  //state
  state: () => {
    return {
      notification: useNotification(),
      modalAddProduct: false as boolean,
      newInvoice: false as boolean,
      loading: false as boolean,
      invoices: [] as Invoice[],
      errors: {} as any,
      items: [] as Item[],
      itemSelected: {
        id: null,
        name: "",
        description: "",
        price: null as number | null,
        is_active: true,
        supplies: [] as Supplie[],
      } as Item,
      //ref
      currentPage: ref(1),
      totalPages: ref(0),
      lastPage: ref(0),
      search: ref(""),
    };
  },

  //actions
  actions: {
    /**
     * Get all Invoices from API paginated and search by code.
     */
    async getInvoices() {
      this.loading = true;
      try {
        const response = await axiosHttp.get<InvoiceListResponse>(
          `invoices/list?page=${this.currentPage}&search=${this.search}`
        );
        this.invoices = response.data.data.data
        this.totalPages = response.data.data.last_page;
        this.lastPage = response.data.data.last_page;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    async changePage(page: Number) {
      this.currentPage = page;
      await this.getInvoices();
    },

    //reset all data
    cancelCreateInvoice() {
      this.errors = {};
      this.newInvoice = false;
      this.items = [] as Item[];
      this.itemSelected = {
        id: null,
        name: "",
        description: "",
        price: null,
        is_active: true,
        supplies: [],
      } as Item;
    }
  },
});
