//create plugin vue 3
import {permissions as permissionsUser,userRole as userRoleUser} from "@/utils/validatePermission";
export default {
    install: (app, options) => {
        app.config.globalProperties.$validatePermissions = (permissions: string[]): boolean => {
            const userPermissions = permissionsUser();
            const hasPermission = userPermissions.some((p) => permissions.includes(p));
            return hasPermission;
        },
        app.config.globalProperties.$userRole = (): string => userRoleUser();
    }
}