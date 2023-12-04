import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
/**
 * Uso de Meta para determinar si el usuario tiene permisos a la ruta 
 * @param roles
 * @param route
 */
function hasPermission(rol, route) {
    var roles= rol.split(",")
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

const loginCrud= store.getters.loginCrud

  routes.forEach(route => {
    const tmp = { ...route }
      loginCrud.find(function(post,index){
        if(tmp.name == post.ruta){
          if (hasPermission(post.permisos, tmp)) {

            if (tmp.children) {
              tmp.children = filterAsyncRoutes(tmp.children, post.permisos)
            }
              res.push(tmp)
           } 
          }
       })
     })
      return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
    
      if (roles==='1') {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, [roles])
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
