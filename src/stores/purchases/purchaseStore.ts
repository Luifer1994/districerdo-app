//define and create store for clients module using pinia
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import Swal from "sweetalert2";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { Item } from "../Products/ProductInterface";
import { downloadBase64File } from "../../utils/dowloadBase64";
import {
  DataGetPurchase,
  GetPurchaseResponse,
  NewPurchase,
  PartialPayment,
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
      modalPartialPaymentActive: false as boolean,
      partialPayment: {} as PartialPayment,
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
    /**
     * get total amount of Purchase for month.
     */
    async getTotalAmount() {
      this.loading = true;
      try {
        const response = await axiosHttp.get(`purchases/total-amount-for-month`);
        this.loading = false;
        return response.data.data;
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

    /**
     * Show modal for add partial payment.
     * @param purchaseId
     */
    async addPartialPayment(purchaseId: Number) {
      await this.findPurchase(purchaseId);

      this.modalPartialPaymentActive = true;
      this.partialPayment = {
        purchase_id: purchaseId,
        amount: 0,
        description: "",
      };
    },

    /**
     * Create a new partial payment.
     */
    async createPartialPayment() {
      this.loading = true;
      const formData = new FormData();
      formData.append("purchase_id", this.partialPayment.purchase_id);
      formData.append("amount", this.partialPayment.amount);
      formData.append("description", this.partialPayment.description);
      let evidence =
        this.partialPayment.evidence && this.partialPayment.evidence[0]
          ? this.partialPayment.evidence[0]
          : null;

      if (evidence) {
        formData.append("evidence", evidence);
      }

      try {
        await axiosHttp.post(`purchases/partial-payment`, formData);
        this.loading = false;
        this.resetPartialPayment();
        if (this.purchase.id) {
          await this.findPurchase(this.purchase.id);
        }
        await this.getPurchases();
      } catch (error) {
        this.loading = false;
      }
    },

    /**
     * Download a evidence to partial payment format image, the image form api send base64 string.
     */
    async downloadEvidence(id: Number) {
      this.loading = true;
      try {
        const response = await axiosHttp.get(
          `purchases/download-evidence/${id}`
        );
        this.loading = false;
        var currentDate = new Date();
        var day = currentDate.getDate().toString().padStart(2, "0");
        var month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        var year = currentDate.getFullYear();
        var fileName = `COMPROBANTE-${response.data.data.code}-${day}-${month}-${year}.jpg`;
        downloadBase64File(response.data.data.base64, "jpg", fileName);
      } catch (error) {
        this.loading = false;
      }
    },

    resetPartialPayment() {
      this.modalPartialPaymentActive = false;
      this.partialPayment = {
        purchase_id: null,
        amount: null,
        description: "",
      } as PartialPayment;
    },
  },
});
