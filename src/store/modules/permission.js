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
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  const publics=[]
  let arr=[]
  var ruta=false
  console.log("jd")
const loginCrud= store.getters.loginCrud
console.log(loginCrud)
  routes.forEach(route => {
    const tmp = { ...route }
    for(var i=0;i<tmp.children.length;i++){
  ruta=false
  if(tmp.children[i].children && tmp.children[i].children.length>0){
    arr.push(tmp.children[i])
    filterAsyncRoutes(arr)
  }
      if(tmp.children[i].public==0){
         loginCrud.find(function(post,index){
          if(tmp.children[i].name == post.ruta){
           if (hasPermission(post.permisos, tmp.children[i])) {
              ruta=true
           }
          //  else{
          //   tmp.children.splice(i,1)
          //  }
      }
    })
   
    if(ruta===false){
    tmp.children.splice(i,1)
    i--
   }
  }
 
}
if(tmp.children.length>0){
    res.push(tmp)
}
    
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
