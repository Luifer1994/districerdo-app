import { ref } from "vue";
import { defineStore } from "pinia";
import axiosHttp from "../../utils/axios";
import { User } from "./userInterface";

export const useUserStore = defineStore("userStore", {
  //state
  state: () => ({
    users: [] as User[],
    userSelected: null as Number,
    loading: false as boolean,
    modalNewUserActive: false as boolean,
    errors: {} as any,
    user: {} as User,
    //ref
    currentPage: ref(1),
    totalPages: ref(0),
    lastPage: ref(0),
    search: ref(""),
  }),
  //actions
  actions: {
    //get all users
    async getUsers() {
      this.loading = true;
      try {
        const response = await axiosHttp.get(
          `/users/list?page=${this.currentPage}&search=${this.search}`
        );
        this.users = response.data.data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    //get user by id
    async getUserById(id: Number) {
      this.loading = true;
      try {
        const response = await axiosHttp.get(`/users/show/${id}`);
        this.user = response.data.data;
        this.user.role = response.data.data.roles[0].name;
        this.modalNewUserActive = true;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    //create user
    async createUser() {
      this.loading = true;
      try {
        await axiosHttp.post(`/users/create`, this.user);
        this.modalNewUserActive = false;
        this.resetUser();
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    //update user
    async updateUser(id: Number) {
      this.loading = true;
      try {
        await axiosHttp.put(`/users/update/${id}`, this.user);
        this.modalNewUserActive = false;
        this.resetUser();
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    async changePage(page: Number) {
      this.currentPage = page;
      await this.getUsers();
    },
    async searchUser() {
      this.currentPage = 1;
      await this.getUsers();
    },
    resetUser() {
      this.user = {} as User;
    },
  },
});
