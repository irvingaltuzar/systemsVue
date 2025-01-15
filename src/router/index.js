import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import PreLoading from '@/views/home/PreLoading.vue'
import Logout from '@/views/logout/RedirectToLogout.vue'
import Menus from './modules/menus'
import nestedRouter from './modules/nested'
import DiningMenu from '../views/Dining/DiningMenu.vue'
import SingleIncidentReport from '@/views/RecursosHumanos/CAI/ProcesoDeIncidencias/single.vue'

/* Router Modules */

export const asyncRoutes = Menus
/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    callback: false,
    home: false,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  // {
  //   path: '/404',
  //   component: () => import('@/views/error-page/404'),
  //   hidden: true
  // },

  {
    path: '/Error',
    redirect: '/404',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/404',
        component: () => import('@/views/error-page/ErrorComponent'),
        name: 'ErrorComponent',
        meta: { title: 'No Disponible' }
      }
    ]
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/Error401Component'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Perfil', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: "/",
    component: Layout,
    redirect: '/Inicio',
    hidden: false,
    children: [{
      path: "rh/cai/proceso-de-incidencias/single/:id",
      name: "SingleProcesoDeIncidencias",
      component:  SingleIncidentReport,
      meta: { title: "Ver informe"},
    }]
  },
	// {
	// 	path: "/auth/intranet/:id",
	// 	name: "PreLoading",
  //   hidden: true,
	// 	meta: {
	// 		auth: false,
	// 		title: "Redirect to",
  //     params: true,
	// 	},
	// 	component: () => import("@/views/home/PreLoading.vue"),
	// },
	// {
	// 	path: "/logout",
	// 	name: "Logout",
  //   hidden: true,
	// 	meta: {
	// 		auth: false,
	// 		title: "Redirect to",
  //     logout: true,
	// 	},
	// 	component: () => import("@/views/logout/RedirectToLogout.vue"),
	// },
  {
    path: 'Intranet',
    component: Layout,
    children: [
      {
        path: 'http://intranet.dmi.local:8006',
        meta: { title: 'Intranet', icon: 'el-icon-s-home' }
      }
    ]
  },
  {
    path: 'Databox 2',
    component: Layout,
    children: [
      {
        path: '/Enlaces/redirectAdHoc',
        meta: { title: 'Databox 2', icon: 'el-icon-document' }
      }
    ]
  }, 
]

// 404 page must be placed at the end !!!
// { path: '*', redirect: '/Error',  name: 'Error',hidden: true}
// ]

const createRouter = () => new Router({
  mode: 'history',
   //base: '/',// require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
