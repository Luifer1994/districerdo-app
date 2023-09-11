import { ref } from "vue";
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import { useNotification } from "@kyvg/vue3-notification";
import { Category } from "../Products/ProductInterface";

export const useCategoryStore = defineStore("categoryStore", {
  //state
  state: () => {
    return {
      notification: useNotification(),
      categories: [] as Category[],
      loading: false as boolean,
      errors: {} as any,
      category: {} as Category,
      currentPage: ref(1),
      totalPages: ref(0),
      lastPage: ref(0),
      search: ref(""),
      loaging: false as boolean,
    };
  },
  //actions
  actions: {
    //get all categories
    async getCategories() {
      this.loading = true;
      try {
        const response = await axiosHttp.get(`/categories/list`);
        this.categories = response.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.notification.error({
          title: "Error",
          message: "No se pudo obtener las categorías",
        });
      }
    },

    async createCategory(category: Category) {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(category),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },
});
