
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import router from '@/router'
import store from '@/store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] //No redirige a estos dos paths(whitelist)

router.beforeEach(async(to, from, next) => {
  // Comienza barra de progreso
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/Inicio' })
      NProgress.done() //
    } else {
      // determine whether the user has obtained his permission roles through getInfo
    
     const hasRoles = store.getters.roles && store.getters.roles > -1
      // const hasRoles = true
      const hasloginCrud= store.getters.loginCrud && store.getters.loginCrud.length > 0
      // const hasRoles =['Admin']

      if (hasRoles && hasloginCrud ) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const {roles}  = await store.dispatch('user/getInfo')
          const  loginCrud  = await store.dispatch('user/getInfo_Permisos')
          //Obtiene arreglo de datos validando que el usuario esta logueado y se obtiene su informacion
          // const { roles } = store.getters.roles


          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          // next('/Inicio')
          Message.closeAll()
          next({ ...to, replace: true})
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* No tiene token*/
 
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // Se redirige a otras paginas o si no tiene permisos lo mando directo a login
       // remove token and go to login page to re-login
       if (to.path === '/Inicio') {
        // if is logged in, redirect to the home page
        next({ path: '/login' })
        NProgress.done() //
      }else{
        await store.dispatch('user/resetToken')
        // Message.warning({message:'Tu sesión ha expirado, ingresas tus credenciales',duration:0})
        next(`/login?redirect=${to.path}`)
       NProgress.done()
      } 
      
       
    }
  }
})

router.afterEach(() => {
  // finaliza la barra de progreso
  NProgress.done()
})
