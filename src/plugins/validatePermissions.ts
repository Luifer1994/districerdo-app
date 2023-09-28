//create plugin vue 3
import { UserLogedInterface } from "@/stores/auth/authInterfaces";
export default {
  install: (app, options) => {
    (app.config.globalProperties.$validatePermissions = (
      permissions: string[]
    ): boolean => {
      const user = JSON.parse(
        localStorage.getItem("userLoged") || "{}"
      ) as UserLogedInterface;
      if (!user) {
        return false;
      }

      const permissionsUser = user.permissions;
      const decode = atob(permissionsUser);
      const parse = JSON.parse(decode);

      const hasPermission = parse.some((p) => permissions.includes(p));
      return hasPermission;
    }),
    
      (app.config.globalProperties.$userRole = (): string => {
        const user = JSON.parse(
          localStorage.getItem("userLoged") || "{}"
        ) as UserLogedInterface;
        if (user && user.roles) {
          const role = user.roles;
          const decode = atob(role);
          const parse = JSON.parse(decode);
          return parse[0];
        }
        return "";
      });
  },
};
