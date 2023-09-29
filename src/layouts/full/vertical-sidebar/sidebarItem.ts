export interface menu {
  header?: string;
  group?: string;
  model?: boolean;
  title?: any;
  icon?: string;
  to?: any;
  children?: menu[];
  permission: string;
}

const sidebarItem: menu[] = [
  /* { header: "Inicio", permission: "home" }, */
  {
    title: "Panel de Control",
    icon: "pie-chart",
    to: "/dashboards",
    permission: "home",
  },
  { header: "Módulos", permission: "module-roles-and-permissions" },
  {
    title: "Facturación",
    to: "/invoices",
    permission: "invoices-list",
    icon: "dollar-sign",
  },
  {
    title: "Compras",
    to: "/purchases",
    permission: "purchases-module",
    icon: "shopping-bag",
  },
  {
    title: "Clientes",
    to: "/clients",
    permission: "clients-module",
    icon: "users",
  },
  {
    title: "Proveedores",
    to: "/providers",
    permission: "providers-module",
    icon: "user-plus",
  },
  {
    title: "Productos",
    to: "/products-list",
    permission: "products-module",
    icon: "box",
  },
  { header: "Configuración", permission: "module-roles-and-permissions" },
  {
    title: "Seguridad",
    icon: "unlock",
    permission: "module-roles-and-permissions",
    children: [
      {
        title: "Usuarios",
        to: "/users-list",
        permission: "users-list",
        icon: "user",
      },
      {
        title: "Roles",
        to: "/roles-list",
        permission: "list-roles",
        icon: "shield",
      },
      {
        title: "Gestión de permisos",
        to: "/assign-permissions",
        permission: "asisgn-permissions-to-roles",
        icon: "key",
      },
    ],
  },

  /* {
    title: "Ubicaciones",
    icon: "map-pin",
    permission: "module-roles-and-permissions",
    children: [
      {
        title: "Paises",
        to: "/assign-permissions",
        permission: "asisgn-permissions-to-roles",
        icon: "globe",
      },
      {
        title: "Departamentos",
        to: "/assign-permissions",
        permission: "asisgn-permissions-to-roles",
        icon: "map",
      },
      {
        title: "Ciudades",
        to: "/assign-permissions",
        permission: "asisgn-permissions-to-roles",
        icon: "map-pin",
      },
    ],
  }, */

  /* {
    title: "Tipos de Documentos",
    to: "/assign-permissions",
    permission: "asisgn-permissions-to-roles",
    icon: "file-text",
  }, */
  /* { header: "Administración", permission: "module-roles-and-permissions" } */
];

export default sidebarItem;
