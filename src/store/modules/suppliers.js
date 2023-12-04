
import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor
import Vue from 'vue'

const getters = {
    Countries: state => state.arrCountries,
    Specialities: state => state.arrSpecialities,
    catSupplierDocuments: state => state.arrCatSupplierDocuments,
    Banks: state => state.arrBanks,
    States: state => state.arrStates,
    MySuppliers: state => state.arrMySuppliers,
    SuppliersEFO: state => state.arrSuppliersEFO,
    ReportAccess: state => state.arrReportAccess,
}
const state = {
 arrCountries:[],
 arrSpecialities:[],
 arrBanks:[],
 arrStates:[],
 arrMySuppliers:[],
 arrReportAccess:[],
 arrSuppliersEFO:[],
 arrCatSupplierDocuments:[],
}

const mutations = {
    SET_COUNTRIES: (state, payload) => {
        state.arrCountries = payload
  },
  SET_SPECIALITIES: (state, payload) => {
    state.arrSpecialities = payload
},
  SET_BANKS: (state, payload) => {
    state.arrBanks = payload
  },
    SET_STATES: (state, payload) => {
        state.arrStates = payload
    },
    SET_MY_SUPPLIERS: (state, payload) => {
        state.arrMySuppliers = payload
    },
    SET_REPORT_ACCESS_SUPPLIERS: (state, payload) => {
      state.arrReportAccess = payload
  },
    SET_SUPPLIERS_EFO: (state, payload) => {

        try {
            const items = payload

            const type = items.map(v => {
              Vue.set(v, 'edit', false)
              Vue.set(v, 'disabled', true)
              v.originaldescripcion = v.efo
              v.originaldescripcionid = v.id
              // v.originalborrado = v.deleted
              return v
            })

            state.arrSuppliersEFO = type
          } catch (error) {
            console.error(error)
          }
    },
    SET_CAT_SUPPLIER_DOCUMENTS: (state, payload) => {
      state.arrCatSupplierDocuments = payload
    },
}
const actions = {
  async getExistRFC({ commit, state },formData){
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {

    Api.post('/suppliers/ExistRFC',formData,config).then(res => {
    const { data } = res
        resolve(data)
      }).catch(error => {
        console.log(error)
      })
    })
  },
  async getContries({ commit, state }){
    return new Promise((resolve, reject) => {


       Api.get('/suppliers/getCountries').then(res=>{
        const { data } = res
        commit('SET_COUNTRIES', data)
        resolve()
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },

   async getSpecialities({ commit, state }){
    return new Promise((resolve, reject) => {


       Api.get('/suppliers/getSpecialities').then(res=>{
        const { data } = res
        commit('SET_SPECIALITIES', data)
        resolve()
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },

   async getBanks({ commit, state }){
    return new Promise((resolve, reject) => {


       Api.get('/suppliers/getBanks').then(res=>{
        const { data } = res
        commit('SET_BANKS', data)
        resolve()
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },
   async getMySuppliers({ commit, state }){
    return new Promise((resolve, reject) => {


       Api.get('/suppliers/getMySuppliers').then(res=>{
        const { data } = res
        commit('SET_MY_SUPPLIERS', data)
        resolve()
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },
   async getSuppliersEFO({ commit, state },formData){
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve, reject) => {

       Api.post('/suppliers/getSuppliersEFO',formData,config).then(res=>{
        const { data } = res
        commit('SET_SUPPLIERS_EFO', data.data)
        resolve(data)
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },
   async getSuppliersEFOSearch({ commit, state },formData){
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve, reject) => {


       Api.post('/suppliers/getSuppliersEFOSearch',formData,config).then(res=>{
        const { data } = res
        commit('SET_SUPPLIERS_EFO', data.data)
        resolve(data)
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },
   async getStatesbyCountry({ commit, state },formData){
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve, reject) => {


       Api.post('/suppliers/getStatesbyCountry',formData,config).then(res=>{
        const { data } = res
        commit('SET_STATES', data)
        resolve()
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },

   async getStates({ commit, state }){
    return new Promise((resolve, reject) => {


       Api.get('/suppliers/getStates').then(res=>{
        const { data } = res
        commit('SET_STATES', data)
        resolve()
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },

   async getReportAccessSupplier({ commit, state }){
    return new Promise((resolve, reject) => {


       Api.get('/suppliers/getReportAccessSupplier').then(res=>{
        const { data } = res
        commit('SET_REPORT_ACCESS_SUPPLIERS', data)
        resolve()
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },
   async getCatSupplierDocuments({ commit, state }){
    return new Promise((resolve, reject) => {


       Api.get('/suppliers/supplier-documents').then(res=>{
        const { data } = res.data
        commit('SET_CAT_SUPPLIER_DOCUMENTS', data)
        resolve()
        }).catch(error => {
          console.log(error);
          reject(error)
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
