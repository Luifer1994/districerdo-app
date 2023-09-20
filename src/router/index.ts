import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth/authStore";
import { validatePermission } from "../utils/validatePermission";

const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      redirect: "/dashboards",
      component: () => import("@/layouts/full/FullLayout.vue"),
      children: [
        {
          name: "dashboards",
          path: "/dashboards",
          component: () =>
            import("@/views/dashboards/analytical/Analytical.vue"),
          meta: { permission: "home" },
        },
        {
          name: "Clients",
          path: "/clients",
          component: () => import("@/views/clients/Index.vue"),
          meta: { permission: "clients-list" },
        },
        {
          name: "Users",
          path: "/users-list",
          component: () => import("@/views/users/Index.vue"),
          meta: { permission: "users-list" },
        },
        {
          name: "Products",
          path: "/products-list",
          component: () => import("@/views/products/Index.vue"),
          meta: { permission: "products-module" },
        },
        {
          name: "Editable Table",
          path: "/editable-table",
          component: () => import("@/views/tables/EditableTable.vue"),
          meta: { permission: "users-list" },
        },
        {
          name: "Admin to Permissions",
          path: "/assign-permissions",
          component: () => import("@/views/RolesAndPermission/Index.vue"),
          meta: { permission: "asisgn-permissions-to-roles" },
        },
        {
          name: "Roles",
          path: "/roles-list",
          component: () => import("@/views/RolesAndPermission/Roles.vue"),
          meta: { permission: "list-roles" },
        },
        {
          name: "Invoices",
          path: "/invoices",
          redirect: "/invoices/list",
          component: () => import("@/views/invoices/Index.vue"),
          meta: { permission: "invoices-list" },
          children: [
            {
              name: "invoices-detail",
              path: "/invoices/detail/:id",
              component: () => import("@/views/invoices/Detail.vue"),
              meta: { permission: "invoices-show" },
            },
            {
              name: "invoices-create",
              path: "/invoices/create",
              component: () => import("@/views/invoices/CreateInvoice.vue"),
              meta: { permission: "invoices-create" },
            },
            {
              name: "invoices-list",
              path: "/invoices/list",
              component: () => import("@/views/invoices/List.vue"),
              meta: { permission: "invoices-list" },
            },
          ],
        },
        {
          name: "Providers",
          path: "/providers",
          component: () => import("@/views/providers/Index.vue"),
          meta: { permission: "providers-list" },
        },
        {
          name: "Purchases",
          path: "/purchases",
          redirect: "/purchases/list",
          component: () => import("@/views/purchases/Index.vue"),
          meta: { permission: "purchases-list" },
          children: [
            {
              name: "purchase-list",
              path: "/purchases/list",
              component: () => import("@/views/purchases/List.vue"),
              meta: { permission: "purchases-list" },
            },
            {
              name: "purchase-create",
              path: "/purchases/create",
              component: () => import("@/views/purchases/CreatePurchase.vue"),
              meta: { permission: "purchases-create" },
            },
            {
              name: "purchase-detail",
              path: "/purchases/detail/:id",
              component: () => import("@/views/purchases/Detail.vue"),
              meta: { permission: "purchases-show" },
            },
          ],
        },
      ],
    },
    {
      path: "/auth",
      component: () => import("@/layouts/blank/BlankLayout.vue"),
      children: [
        {
          name: "Login",
          path: "/auth/login",
          component: () => import("@/views/authentication/FullLogin.vue"),
        },
        {
          name: "Error",
          path: "/authentication/error",
          component: () => import("@/views/authentication/Error.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/authentication/Error.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const publicPages = ["/auth/login"];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (to.meta && to.meta.permission) {
    if (!validatePermission([to.meta.permission as string])) {
      return "/authentication/error";
    }
  }

  if (authRequired && !auth.userLoged) {
    return "/auth/login";
  }
});

export default router;
