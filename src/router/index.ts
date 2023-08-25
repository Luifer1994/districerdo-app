import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth/authStore';
import { validatePermission } from '../utils/validatePermission';

const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/dashboards',
      component: () => import('@/layouts/full/FullLayout.vue'),
      children: [
        {
          name: 'dashboards',
          path: '/dashboards',
          component: () =>
            import('@/views/dashboards/analytical/Analytical.vue'),
          meta: { permission: 'home' },
        },
        {
          name: 'Clients',
          path: '/clients',
          component: () => import('@/views/clients/Index.vue'),
          meta: { permission: 'clients-list' },
        },
        {
          name: 'Users',
          path: '/users-list',
          component: () => import('@/views/users/Index.vue'),
          meta: { permission: 'users-list' },
        },
        {
          name: 'Products',
          path: '/products-list',
          component: () => import('@/views/products/Index.vue'),
          meta: { permission: 'products-module' },
        },
        {
          name: 'Editable Table',
          path: '/editable-table',
          component: () => import('@/views/tables/EditableTable.vue'),
          meta: { permission: 'users-list' },
        },
        {
          name: 'Admin to Permissions',
          path: '/assign-permissions',
          component: () => import('@/views/RolesAndPermission/Index.vue'),
          meta: { permission: 'asisgn-permissions-to-roles' },
        },
        {
          name: 'Roles',
          path: '/roles-list',
          component: () => import('@/views/RolesAndPermission/Roles.vue'),
          meta: { permission: 'list-roles' },
        },
        {
          name: 'Invoices',
          path: '/invoices',
          component: () => import('@/views/invoices/Index.vue'),
         /*  meta: { permission: 'invoices-list' }, */
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('@/layouts/blank/BlankLayout.vue'),
      children: [
        {
          name: 'Login',
          path: '/auth/login',
          component: () => import('@/views/authentication/FullLogin.vue'),
        },
        {
          name: 'Error',
          path: '/authentication/error',
          component: () => import('@/views/authentication/Error.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/authentication/Error.vue'),
    },
  ],
});

router.beforeEach(async (to) => {
  const publicPages = ['/auth/login'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (to.meta && to.meta.permission) {
    if (!validatePermission([to.meta.permission as string])) {
      return '/authentication/error';
    }
  }

  if (authRequired && !auth.userLoged) {
    return '/auth/login';
  }
});

export default router;
