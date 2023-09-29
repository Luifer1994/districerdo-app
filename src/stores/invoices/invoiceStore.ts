//define and create store for clients module using pinia
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";
import Swal from "sweetalert2";
import { Item } from "../Products/ProductInterface";
import { Invoice, InvoiceListResponse, NewInvoice } from "./invoiceInterfaces";
import { downloadBase64File } from "../../utils/dowloadBase64";

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
        quantity: null as number | null,
      } as Item,
      //ref
      currentPage: ref(1),
      totalPages: ref(0),
      lastPage: ref(0),
      search: ref(""),
      state: ref(""),
      dates: ref([]),
      newInvoiceData: {
        client_id: null,
        state: "PENDING",
        invoice_lines: [] as Item[],
      } as NewInvoice,
      invoice: {} as Invoice,
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

        let dateStart = "";
        let dateEnd = "";

        if (this.dates && this.dates.length > 0) {
          dateStart = this.formateDate(this.dates[0]);
          dateEnd = this.formateDate(this.dates[1]);
        }

        const stateParam = this.state ? this.state.toString() : "";
        const searchParam = this.search ? this.search.toString() : "";

        const response = await axiosHttp.get(
          `invoices/list?page=${this.currentPage}&search=${searchParam}&date_start=${dateStart}&date_end=${dateEnd}&state=${stateParam}`
        );
        this.invoices = response.data.data.data;
        this.totalPages = response.data.data.last_page;
        this.lastPage = response.data.data.last_page;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Create a new Invoice.
     * @param invoice
     * @returns
     */
    async createInvoice(invoice: NewInvoice) {
      this.loading = true;
      try {
        const response = await axiosHttp.post(`invoices/create`, invoice);
        this.cancelCreateInvoice();
        this.loading = false;
        return response.data.data.id;
      } catch (error) {
        this.loading = false;
      }
    },

    /**
     * Get a Invoice by id.
     * @param id
     * @returns
     */
    async getInvoice(id: number) {
      this.loading = true;
      try {
        const response = await axiosHttp.get(`invoices/show/${id}`);
        this.invoice = response.data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    /**
     * Paid a Invoice by id.
     * @param id
     * @returns
     */
    async paidInvoice(id: Number) {
      Swal.fire({
        title: "Pagar factura",
        text: "¿Está seguro de pagar esta factura?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, pagar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loading = true;
          try {
            await axiosHttp.put(`invoices/paid/${id}`);
            this.loading = false;
            await this.getInvoice(id);
            await this.getInvoices();
          } catch (error) {
            this.loading = false;
          }
        }
      });
    },

    /**
     * Cancel a Invoice by id.
     * @param id
     * @returns
     */
    async cancelInvoice(id: Number) {
      Swal.fire({
        title: "Cancelar factura",
        text: "¿Está seguro de cancelar esta factura?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, cancelar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loading = true;
          try {
            await axiosHttp.put(`invoices/cancel/${id}`);
            this.loading = false;
            await this.getInvoice(id);
            await this.getInvoices();
          } catch (error) {
            this.loading = false;
          }
        }
      });
    },

    async changePage(page: Number) {
      this.currentPage = page;
      await this.getInvoices();
    },

    /**
     * Download a Invoice by id. to pdf format, the pdf form api send base64 string.
     * @param id
     * @returns
     */
    async downloadInvoice(id: Number) {
      this.loading = true;
      try {
        const response = await axiosHttp.get(`invoices/download/${id}`);
        this.loading = false;
        var currentDate = new Date();
        var day = currentDate.getDate().toString().padStart(2, "0");
        var month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        var year = currentDate.getFullYear();
        var fileName = `FACTURA-${response.data.data.code}-${day}-${month}-${year}.pdf`;
        downloadBase64File(response.data.data.base64, "pdf", fileName);
      } catch (error) {
        this.loading = false;
      }
    },

    /**
     * get total amount of invoice for month.
     */
    async getTotalAmount() {
      this.loading = true;
      try {
        const response = await axiosHttp.get(`invoices/total-amount-for-month`);
        this.loading = false;
        return response.data.data;
      } catch (error) {
        this.loading = false;
      }
    },


    //reset all data
    cancelCreateInvoice() {
      this.errors = {};
      this.newInvoice = false;
      this.items = [] as Item[];
      (this.newInvoiceData = {} as NewInvoice),
        (this.itemSelected = {
          id: null,
          name: "",
          description: "",
          price: null as number | null,
          quantity: null as number | null,
        } as Item);
    },
  },
});
