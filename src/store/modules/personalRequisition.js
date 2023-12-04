
import store from '@/store'
import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor
import Vue from 'vue'
import { notify } from '@/utils/function_repository'
import { Notification } from 'element-ui';
const getters = {
  CompanyName: state => state.Company_Name,
  BranchCode: state => state.arrBranchCode,
  PersonalStaffAll: state => state.arrStaffAll,
  PersonalStaffAll_Panel: state => state.arrStaffAllP,
  PersonalStaff: state => state.arrStaff,
  PersonalStaffHigher: state => state.arrStaffHigher,
  PersonalStaffHigherConsulta: state => state.arrStaffHigherconsulta,
  EmailDomain: state => state.arrEmailDomain,
  Supervalidator: state => state.arrSupervalidator,
  StatusRecruitment: state => state.arrStatusRecruitment,
  RequisitionValidation: state => state.arrRequisitionValidation,
  RequisitionValidationId: state => state.arrRequisitionValidationId,
  MyRequisitions: state => state.arrMyRequisitions,
  RequisitionsMyPersonal: state => state.arrRequisitionsMyPersonal,
  RequisitionsMyPersonal_Pendientes: state => state.arrRequisitionsMyPersonal_Pendientes,
  RequisitionsConsulta: state => state.arrRequisitionsConsulta,
  RequisitionsAutRech: state => state.arrRequisitionsAutRech,
}
const state = {
  Company_Name: [],
  arrBranchCode: [],
  arrStaffAll: [],
  arrStaffAllP: [],
  arrStaff: [],
  arrStaffHigher: [],
  arrStaffHigherconsulta:[],
  arrEmailDomain: [],
  arrSupervalidator:[],
  arrRequisitionValidation: [],
  arrMyRequisitions: [],
  arrRequisitionValidationId: [],
  arrRequisitionsMyPersonal:[],
  arrRequisitionsMyPersonal_Pendientes:[],
  arrRequisitionsConsulta:[],
  arrRequisitionsAutRech:[],
  arrStatusRecruitment:[]
}

const mutations = {
  SET_COMPANY_NAME: (state, payload) => {
    state.Company_Name = payload
  },
  SET_BRANCH_CODE: (state, payload) => {
    state.arrBranchCode = payload
  },
  SET_STAFF_ALL: (state, payload) => {
    state.arrStaffAll= payload
  },
  SET_STAFF_ALL_PANEL: (state, payload) => {
    state.arrStaffAllP= payload
  },
  SET_STAFF: (state, payload) => {
    state.arrStaff = payload
  },
  SET_STAFF_HIGHER: (state, payload) => {
    state.arrStaffHigher = payload
  },
  SET_STAFF_HIGHER_CONSULTA: (state, payload) => {
    state.arrStaffHigherconsulta = payload
  },
  SET_EMAIL_DOMAIN: (state, payload) => {
    state.arrEmailDomain = payload
  },
  SET_SUPERVALIDATOR: (state, payload) => {
    state.arrSupervalidator = payload
  },
  SET_STATUS_RECRUITMENT: (state, payload) => {
    state.arrStatusRecruitment = payload
  },

  SET_REQUISITION_VALIDATION: (state, payload) => {
    state.arrRequisitionValidation = payload
  },
  SET_MY_REQUISITIONS: (state, payload) => {
    state.arrMyRequisitions = payload
  },
  SET_REQUISITIONS_MY_PERSONAL: (state, payload) => {
    state.arrRequisitionsMyPersonal= payload
  },
  SET_REQUISITIONS_MY_PERSONAL_PENDIENTES: (state, payload) => {
    state.arrRequisitionsMyPersonal_Pendientes= payload
  },
  SET_REQUISITIONS_CONSULTA: (state, payload) => {
    state.arrRequisitionsConsulta= payload
  },
  SET_REQUISITIONS_AUTORIZADAS: (state, payload) => {
    try {
      const items = payload

      const type = items.map(v => {
        Vue.set(v, 'edit', false)
        Vue.set(v, 'disabled', true)
          v.originaldescripcion = v.dmi_cat_status_recruitment.description
          v.originaldescripcionid = v.dmi_cat_status_recruitment.id
       
        return v
      })

      state.arrRequisitionsAutRech = type
    } catch (error) {
      console.error(error)
    }
  
  },
  SET_REQUISITION_VALIDATION_BY_ID: (state, payload) => {
    state.arrRequisitionValidationId = payload
  },
  
}
const actions = {
  getVw_CompanyName({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getAllCompanyName').then(res => {
        const { data } = res
        commit('SET_COMPANY_NAME', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getVw_BranchCode({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getAllBranch_Code').then(res => {
        const { data } = res
        commit('SET_BRANCH_CODE', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getCommading_staff_All({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getAllCommanding_staff').then(res => {
        const { data } = res
        if(data != null){
          commit('SET_STAFF_ALL', data)
          resolve()
        }else{
          commit('SET_STAFF_ALL', [])
          resolve()
        }
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getCommading_staff_All_Panel({ commit,  state },formData){
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.post('/personalRequisition/getAllCommanding_staff_Panel',formData,config).then(res => {
        const { data } = res
        if(data != null){
          commit('SET_STAFF_ALL_PANEL', data)
          resolve()
        }else{
          commit('SET_STAFF_ALL_PANEL', [])
          resolve()
        }
  
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getCommading_staff({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getCommanding_staff').then(res => {
        const { data } = res
        commit('SET_STAFF', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getHigher_Staff({ commit, state },formData){
    return new Promise((resolve) => {
      Api.post('/personalRequisition/getStaff_Higher',formData).then(res => {
        const { data } = res
        if(data.error){

          commit('SET_STAFF_HIGHER', [])
          resolve(data)
        }else{
        commit('SET_STAFF_HIGHER', data)
        resolve(data)
        }
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getHigher_StaffConsulta({ commit, state },formData){
    return new Promise((resolve) => {
      Api.post('/personalRequisition/getStaff_HigherConsulta',formData).then(res => {
        const { data } = res
       
        commit('SET_STAFF_HIGHER_CONSULTA', data)
        resolve(data)
        
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getEmailDomain({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getEmailDomain').then(res => {
        const { data } = res
        commit('SET_EMAIL_DOMAIN', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },

  getSuperValidator({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getSuperValidator').then(res => {
        const { data } = res
        commit('SET_SUPERVALIDATOR', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getStatusRecruitment({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getStatusRecruitment').then(res => {
        const { data } = res
        commit('SET_STATUS_RECRUITMENT', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getRequisitionValidation({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getPersonalRequisitionValidation').then(res => {
        const { data } = res
        commit('SET_REQUISITION_VALIDATION', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getMyRequisitions({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getMyPersonalRequisitions').then(res => {
        const { data } = res
        commit('SET_MY_REQUISITIONS', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },

  getRequisitionsMyPersonal({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getRequisitionsMyPersonal').then(res => {
        const { data } = res
        commit('SET_REQUISITIONS_MY_PERSONAL', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getRequisitionsMyPersonalPendientes({ commit }) {
    return new Promise((resolve) => {
      Api.get('/personalRequisition/getRequisitionsMyPersonalPendientes').then(res => {
        const { data } = res
        commit('SET_REQUISITIONS_MY_PERSONAL_PENDIENTES', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },

  getConsultaPersonalRequisitions({ commit, state },formData){
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.post('/personalRequisition/getConsultaPersonalRequisitions',formData,config).then(res => {
        const { data } = res
        commit('SET_REQUISITIONS_CONSULTA', data.data)
        resolve(data)
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getConsultaPersonalRequisitionsSearch({ commit, state },formData){
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.post('/personalRequisition/getConsultaPersonalRequisitionsSearch',formData,config).then(res => {
        const { data } = res
        commit('SET_REQUISITIONS_CONSULTA', data.data)
        resolve(data)
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getAutRechPersonalRequisitions({ commit, state },formData){
    const config = { headers: { 'content-type': 'multipart/form-data' }}

    return new Promise((resolve) => {
      Api.post('/personalRequisition/getAutRechPersonalRequisitions',formData,config).then(res => {
        const { data } = res
        commit('SET_REQUISITIONS_AUTORIZADAS',  data.data)
        resolve(data)
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getAutRechPersonalRequisitionsSearch({ commit, state },formData){
    const config = { headers: { 'content-type': 'multipart/form-data' }}

    return new Promise((resolve) => {
      Api.post('/personalRequisition/getAutRechPersonalRequisitionsSearch',formData,config).then(res => {
        const { data } = res
        commit('SET_REQUISITIONS_AUTORIZADAS',  data.data)
        resolve(data)
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getRequisitionValidationbyId({ commit },formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.post('/personalRequisition/getRequisitionValidatebyId',formData,config).then(res => {
        const { data } = res
        commit('SET_REQUISITION_VALIDATION_BY_ID', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  addRequisition({ commit }, formData) {
      const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.post('/personalRequisition/addRequisition', formData,config).then(res => {
        resolve(res)
      }).catch(function(error) {
        console.log(error)
      })
    })
    
  },
  ValidateRequisition({ commit }, formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
  return new Promise((resolve) => {
    Api.post('/personalRequisition/validatePersonalRequisition', formData,config).then(res => {
      resolve(res)
    }).catch(function(error) {
      console.log(error)
    })
  })
  
},
CancelRequisition({ commit }, formData) {
  const config = { headers: { 'content-type': 'multipart/form-data' }}
return new Promise((resolve) => {
  Api.post('/personalRequisition/CancelPersonalRequisition', formData,config).then(res => {
    resolve(res)
  }).catch(function(error) {
    console.log(error)
  })
})

},
AutorizeRequisition({ commit }, formData) {
  const config = { headers: { 'content-type': 'multipart/form-data' }}
return new Promise((resolve) => {
  Api.post('/personalRequisition/AutorizeRequisition', formData,config).then(res => {
    resolve(res)
  }).catch(function(error) {
    console.log(error)
  })
})

},

SignRequisition({ commit }, formData) {
  const config = { headers: { 'content-type': 'multipart/form-data' }}
return new Promise((resolve) => {
  Api.post('/personalRequisition/SignPersonalRequisition', formData,config).then(res => {
    resolve(res)
  }).catch(function(error) {
    console.log(error)
  })
})

},
  updateRequisition({ commit }, formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
  return new Promise((resolve) => {
    Api.post('/personalRequisition/updatePersonalRequisition', formData,config).then(res => {
      resolve(res)
    }).catch(function(error) {
      console.log(error)
    })
  })

  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
