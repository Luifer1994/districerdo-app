//using pinia with typescript

import { defineStore } from 'pinia'
import { useNotification } from '@kyvg/vue3-notification'
import axiosHttp from '../../utils/axios'
import { DocumentType,DocumentTypeResponse } from './documentTypeInterfaces'

export const useDocumentTypesStore = defineStore('documentTypesStore', {
    //state
    state: () => {
        return {
            notification: useNotification(),
            documentTypes: [] as DocumentType[],
            loading: false as boolean,
            errors: {} as any,
            documentType: {} as DocumentType,
            documentTypeSelected: {} as DocumentType,
        }
    },
    //actions
    actions: {
        //get all document types
        async getDocumentTypes() {
            this.loading = true
            try {
                const response = await axiosHttp.get<DocumentTypeResponse>(`/document-types/list`)
                this.documentTypes = response.data.data
                this.loading = false
            } catch (error) {
                this.loading = false
                this.notification.error({
                    title: 'Error',
                    message: 'No se pudo obtener los tipos de documentos',
                })
            }
        }
    },
})
