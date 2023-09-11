import { ref } from "vue";
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import { Product, CreateProductResponse } from "./ProductInterface";
import { useInvoiceStore } from "../invoices/invoiceStore";

export const useProductStore = defineStore("ProductStore", {
  //state
  state: () => ({
    Products: [] as Product[],
    ProductsActive: [] as Product[],
    ProductSelected: null as Number,
    loading: false as boolean,
    modalNewProductActive: false as boolean,
    errors: {} as any,
    Product: {} as Product,
    //ref
    currentPage: ref(1),
    totalPages: ref(0),
    lastPage: ref(0),
    search: ref(""),
    searchActive: ref(""),
  }),
  //actions
  actions: {
    //get all Products
    async getProducts() {
      this.loading = true;
      try {
        const response = await axiosHttp.get(
          `/products/list?page=${this.currentPage}&search=${this.search}`
        );
        this.Products = response.data.data.data;
        this.totalPages = response.data.data.last_page;
        this.lastPage = response.data.data.last_page;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    //get all Products active
    async getProductsActive(termine: string) {
      if(!termine){
        termine = "";
      }
      this.loading = true;
      try {
        const response = await axiosHttp.get(
          `/products/search?search=${termine}`
        );
        this.ProductsActive = response.data.data;
        const invoiceStore = useInvoiceStore();
        this.ProductsActive = this.ProductsActive.filter(
          (Product) =>
            !invoiceStore.items.find((item) => item.id === Product.id)
        );
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     *
     * @param page get Product bt id.
     *
     * @param id
     */
    async getProductById(id: Number) {
      try {
        const response = await axiosHttp.get(`/products/show/${id}`);
        this.Product = response.data.data;
        console.log(this.Product);
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    //create new Product.
    async createProduct() {
      try {
        await axiosHttp.post<CreateProductResponse>(
          `/products/create`,
          this.Product
        );
        this.modalNewProductActive = false;
      } catch (error) {
        console.log(error);
      }
    },

    //update Product.
    async updateProduct() {
      try {
        await axiosHttp.put(
          `/products/update/${this.Product.id}`,
          this.Product
        );
        this.modalNewProductActive = false;
      } catch (error) {
        console.log(error);
      }
    },

    async changePage(page: Number) {
      this.currentPage = page;
      await this.getProducts();
    },
    async searchProduct() {
      this.currentPage = 1;
      await this.getProducts();
    },
    resetProduct() {
      this.Product = {} as Product;
    },
  },
});
