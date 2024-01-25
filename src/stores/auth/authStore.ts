import { defineStore } from 'pinia'
import axiosHttp from "../../utils/axios";
import { loginPayload, LoginResponse, UserLogedInterface } from "./authInterfaces";
import router from "../../router";

export const useAuthStore = defineStore('authStore', {
    //state
    state: () => {
        return {
            dataLogin: {} as loginPayload,
            errors: {
                email: [] as string[],
                password: [] as string[],
            },
            res: {} as LoginResponse,
            userLoged: JSON.parse(localStorage.getItem('userLoged')) as UserLogedInterface,
        }
    },

    //actions
    actions: {

        /**
         * Function to login user and save token in localstorage.
         * 
         * @returns {Promise<void>}
         */
        async login(): Promise<void> {
            try {
                const response = await axiosHttp.post('auth/login', this.dataLogin);
                this.userLoged = response.data.data.user;
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("userLoged", JSON.stringify(this.userLoged));
                router.push('/');
            } catch (error) {
               this.errors = error;
            }
        },

        /**
         * Function to logout user and remove token from localstorage.
         * 
         * @returns {Promise<void>}
         */
        async logout(): Promise<void> {
            try {
                await axiosHttp.get('auth/logout');
                localStorage.removeItem("token");
                localStorage.removeItem("userLoged");
                router.push('/auth/login');
            }
            catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("userLoged");
                router.push('/auth/login');
                this.errors = error;
            }
        }
    },
})