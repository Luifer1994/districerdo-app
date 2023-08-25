import { defineStore } from 'pinia'
import axiosHttp from '../../utils/axios'
import { useNotification } from "@kyvg/vue3-notification";
import { Role, Group, Permission, NewRole } from './rolesAndPermissionsInterfaces'

export const useRolesAndPermissionsStore = defineStore('rolesAndPermissionsStore', {
    //state
    state: () => {
        return {
            notification: useNotification(),
            roles: [] as Role[],
            groups: [] as Group[],
            roleSelected: null as Number,
            groupSelected: null as string,
            permissions: [] as Permission[],
            loading: false as boolean,
            newRol: {} as NewRole,
            modalNewRoleActive: false as boolean,
            errors: {} as any,
            role: {} as Role,
        }
    },

    //actions
    actions: {
        /**
         * Get all roles
         * 
         * @returns {Promise<void>}
         */
        async getRoles(): Promise<void> {
            try {
                const response = await axiosHttp.get('/roles/list');
                this.roles = response.data.data;
            } catch (error) {
                this.errors = error;
            }
        },

        /**
         * Find roles by id.
         * 
         * @param {number} id
         * @returns {Promise<void>}
         */
        async getRoleById(id: number): Promise<void> {
            try {
                this.modalNewRoleActive = true;
                const response = await axiosHttp.get('/roles/show/' + id);
                this.newRol = response.data.data;
            } catch (error) {
                this.errors = error;
            }
        },

        /**
         * Find groups by name.
         * 
         * @param {string} value
         * @returns {Promise<void>}
         */
        async getGroups(value: string): Promise<void> {
            try {
                if (value.length < 3) {
                    this.groups = [];
                    return;
                } else {
                    const response = await axiosHttp.get('/permissions/group-to-permission?search=' + value);
                    this.groups = response.data.data;
                }
            } catch (error) {
                this.errors = error;
            }
        },

        /**
         * Find permissions for groups.
         * 
         * @returns {Promise<void>}
         */
        async getPermissions(): Promise<void> {
            try {
                this.permissions = []
                if (this.groupSelected) {
                    this.loading = true;
                    const response = await axiosHttp.get('/permissions/list-by-group/' + this.groupSelected + '/' + this.roleSelected);
                    this.permissions = response.data.data;
                    //convert permission.checked to boolean
                    this.permissions.forEach((permission: Permission) => {
                        permission.checked = Boolean(permission.checked);
                    }
                    );
                    this.loading = false;
                }
            }
            catch (error) {
                this.errors = error;
            }
        },

        /**
         * Asing permissions checked to role.
         * 
         * @returns {Promise<void>}
         */
        async assignPermissions(): Promise<void> {

            try {
                let permissions = [];
                this.permissions.forEach((permission: Permission) => {
                    if (permission.checked) {
                        permissions.push(permission.id);
                    }
                });
                if (permissions.length == 0) {
                    this.notification.notify({
                        title: 'No hay permisos para asignar',
                        type: "error",
                    });
                    return;
                }
                const response = await axiosHttp.post('/roles/asing-permissions', {
                    role_id: this.roleSelected,
                    permissions: permissions,
                    group: this.groupSelected
                });
            } catch (error) {
                this.errors = error;
            }
        },

        /**
         * Find created new Role.
         * 
         * @returns {Promise<void>}
         */
        async createRole(): Promise<void> {
            try {
                const response = await axiosHttp.post('/roles/created', this.newRol);
                this.modalNewRoleActive = false;
                this.getRoles();
            } catch (error) {
                this.errors = error;
            }
        },

        /**
         * Function to update role.
         * 
         * @returns {Promise<void>}
         */
        async updateRole(): Promise<void> {
            try {
                const response = await axiosHttp.put('/roles/updated/' + this.newRol.id, this.newRol);
                this.modalNewRoleActive = false;
                this.newRol = {} as NewRole;
                this.getRoles();
            } catch (error) {
                this.errors = error;
            }
        }
    },
})