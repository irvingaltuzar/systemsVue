// import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { MessageBox, Message } from 'element-ui'
import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor
import Api_intranet from "./Api_intranet" //Clase Api donde se declara Axios y la ruta al servidor
import Csrf from "./Csrf" //Clase donde se obtiene crsf-cookie para la autenticacion
import store from '@/store'

const state = {
  token: getToken(),
  usuario:null,
  name: '',
  lastname:'',
  avatar: '',
  personalid: '',
  personal_intelisis_id: '',
  email: '',
  extension:'',
  deparment:'',
  company:'',
  antiquity_date:'',
  position:'',
  roles: 0,
  ubicacion:'',
  loginCrud:[]
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USER: (state,usuario)=>{
    state.usuario=usuario;
  },
  SET_PERSONAL_INTELISIS_ID: (state,personal_intelisis_id)=>{
    state.personal_intelisis_id=personal_intelisis_id;
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_LASTNAME: (state, lastname) => {
    state.lastname = lastname
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_UBICACION: (state, ubicacion) => {
    state.ubicacion = ubicacion
  },
  SET_DEPARMENT: (state, deparment) => {
    state.deparment = deparment
  },
  SET_EXTENSION: (state, extension) => {
    state.extension = extension
  },
  SET_PERSONALID: (state, personalid) => {
    state.personalid = personalid
  },
  SET_COMPANY: (state, company) => {
    state.company = company
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_POSITION: (state, position) => {
    state.position = position
  },
  SET_ANTIQUITY: (state, payload) => {
    state.antiquity_date = payload
  },
  SET_LOGINCRUD: (state, loginCrud) => {
    state.loginCrud = loginCrud
  }
}

const actions = {

  // Action que ejecuta la peticion de Auth al backend
 async login({ commit }, credenciales) {
   //Se hace la peticion de cookie a sanctum de forma async
  await Csrf.getCookie();
  return new Promise((resolve, reject) => {

   //Hacemos la peticion a la ruta /login de laravel para autenticar y crear sesion
    Api.post('/login', credenciales).then(res=>{
      //Obtenemos la respuesta y declaramos constante data de res
      const { data,config } =  res

      //hacemos commit a la mutation token y le mandamos el valor del token de Auth
      commit('SET_TOKEN', config.headers["X-XSRF-TOKEN"])
      setToken(config.headers["X-XSRF-TOKEN"])
      let formData = new FormData();
      formData.append('name_view','Login');
      formData.append('comentarios',"Inicio de sesion Usuario");
      formData.append('evento',"Login()");

      store.dispatch("auditoria/addEventAuditoria",formData)
      resolve(res)
    }).catch(error => {
      if (error.response.status === 422) {
       //Mensaje element-ui, alerta de respuesta erronea
       let formData = new FormData();
       formData.append('name_view','Login');
       formData.append('comentarios',"Error en authenticacion usuario");
       formData.append('evento',"Login()");
       formData.append('error', 'Las credenciales son incorrectas');
       store.dispatch("auditoria/addEventAuditoria",formData)
        Message({
          message: error.response.data.errors.usuario[0] || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
    }
    reject(error);// error
    })
    })
},

  // Obtener Info si usuario sigue activo en servidor
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      //Ruta de Controlador donde valida el metodo de informacion
      Api.get('/check').then(res=>{
        const { data } = res

        if (data[0] == "") {
          reject('Verificacion fallida, ingresa de nuevo tus credenciales')
        }

        const { roles, name,usuario_ad,location,last_name,email,company_name,personal_id,extension,
        deparment,position_company_full,antiquity_date,id} = data[0]


        // Debe tener algun rol
        if (!roles || roles.length <= 0) {
          reject('getInfo: Ocurrio un error inicia sesion de nuevo!')
        }
        if ( location === '') {
          reject('getInfo: Ocurrio un error tu usuario no cuenta con ubicacion!')
        }
         //User Information ->PersonalIntelisis
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_USER', usuario_ad)
        commit('SET_PERSONAL_INTELISIS_ID', id)
        commit('SET_UBICACION', location)
        commit('SET_LASTNAME', last_name)
        commit('SET_DEPARMENT', deparment)
        commit('SET_EMAIL', email)
        commit('SET_COMPANY', company_name)
        commit('SET_PERSONALID', personal_id)
        commit('SET_EXTENSION', extension)
        commit('SET_POSITION', position_company_full)
        commit('SET_ANTIQUITY', antiquity_date)
        resolve(data[0])
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },
  getInfo_Permisos({ commit, state }) {
    return new Promise((resolve, reject) => {
      //Ruta de Controlador donde valida el metodo de informacion
      Api.get('/check_Permisos').then(res=>{
        const { data } = res

        if (!data) {
          reject('Verificacion fallida, ingresa de nuevo tus credenciales')
        }
          var array=[];

        for(var i=0;i<data.length;i++){

            array.push({"permisos":data[i].loginCrud,"ruta":data[i].subsecDesc});
            // array.push(data[i].loginCrud,data[i].subsecDesc);
        }
        commit('SET_LOGINCRUD',array)
        resolve(array)
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  // user logout
  async logout({ commit, state, dispatch }) {
    // await Api.get("/sanctum/csrf-cookie");
    await Csrf.getCookie();
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      formData.append('name_view','Logout');
      formData.append('comentarios',"Usuario Cerro Sesion");
       formData.append('evento',"Logout()");

      store.dispatch("auditoria/addEventAuditoria",formData)

      Api.get('/logout').then(res => {
           //Evento Store para auditoria
        // Api_intranet.get('/expire-session-from-alfa').then(res => {}).catch(error => {
        //   reject(error)
        // })
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_LOGINCRUD', [])
        removeToken()
        resetRouter()



        // reset visited views and cached views

        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // Remover Token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_LOGINCRUD', [])
      commit('SET_ROLES', '')
      removeToken()
      resolve()
    })
  },

  // Cambiar permisos dinamicamente
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // Generar routas de accesos
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // Reset de las vistas visitadas y la cache de las mismas
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}



