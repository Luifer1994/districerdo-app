//define and create store for clients module using pinia
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import Swal from "sweetalert2";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { Item } from "../Products/ProductInterface";
import {
  DataGetPurchase,
  GetPurchaseResponse,
  NewPurchase,
  Purchase,
  PurchaseListResponse,
} from "./purchaseInterfaces";

export const usePurchaseStore = defineStore("purchaseStore", {
  //state
  state: () => {
    return {
      notification: useNotification(),
      modalAddProduct: false as boolean,
      newPurchase: false as boolean,
      loading: false as boolean,
      purchases: [] as Purchase[],
      newPurchaseData: {} as NewPurchase,
      errors: {} as any,
      items: [] as Item[],
      itemSelected: {
        id: null,
        name: "",
        description: "",
        price: null as number | null,
        quantity: null as number | null,
      } as Item,
      purchase: {} as DataGetPurchase,
      //ref
      currentPage: ref(1),
      totalPages: ref(0),
      lastPage: ref(0),
      search: ref(""),
      state: ref(""),
      dates: ref([]),
    };
  },

  //actions
  actions: {
    /**
     * Get all Purchases from API paginated and search by code.
     */
    async getPurchases() {
      try {
        this.loading = true;
        let dateStart = "";
        let dateEnd = "";

        if (this.dates && this.dates.length > 0) {
          dateStart = this.formateDate(this.dates[0]);
          dateEnd = this.formateDate(this.dates[1]);
        }

        const stateParam = this.state ? this.state.toString() : "";
        const searchParam = this.search ? this.search.toString() : "";

        const response = await axiosHttp.get<PurchaseListResponse>(
          `purchases/list?page=${this.currentPage}&search=${searchParam}&date_start=${dateStart}&date_end=${dateEnd}&state=${stateParam}`
        );

        const responseData = response.data.data;
        this.purchases = responseData.data;
        this.totalPages = responseData.last_page;
        this.lastPage = responseData.last_page;

        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async changePage(page: Number) {
      this.currentPage = page;
      await this.getPurchases();
    },

    //create new purchase
    async createPurchase(newPurchase: NewPurchase) {
      this.loading = true;
      try {
      const res =  await axiosHttp.post(`purchases/create`, newPurchase);
        this.loading = false;
        this.cancelCreatePurchase();
        return res.data.data.id;
      } catch (error) {
        this.loading = false;
      }
    },

    //paid purchase
    async paidPurchase(id: Number | String) {
      Swal.fire({
        title: "Pagar compra",
        text: "¿Está seguro de pagar esta compra?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, pagar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axiosHttp.put(`purchases/paid/${id}`);
            this.loading = false;
            await this.findPurchase(id);
            await this.getPurchases();
          } catch (error) {
            this.loading = false;
          }
        }
      });
      this.loading = true;
    },

    //find purchase by id
    async findPurchase(id: Number) {
      this.loading = true;
      try {
        const response = await axiosHttp.get<GetPurchaseResponse>(
          `purchases/show/${id}`
        );
        this.purchase = response.data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    //reset all data
    cancelCreatePurchase() {
      this.newPurchaseData = {} as NewPurchase;
      this.errors = {};
      this.newPurchase = false;
      this.items = [] as Item[];
      this.itemSelected = {
        id: null,
        name: "",
        description: "",
        price: null,
        quantity: null,
      } as Item;
    },

    formateDate(date: Date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
  },
});
