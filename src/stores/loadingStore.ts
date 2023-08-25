import { defineStore } from "pinia";

export const useLoadingStore = defineStore('loadingStore', {
    //state
    state: () => {
        return {
            dialog: false as boolean,
        }
    },
});
