
import store from '@/store'
import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor

const getters = {
  CompaniesLaw: state => state.arrCompanies,

}
const state = {
  arrCompanies: [],
 
}

const mutations = {
  SET_COMPANIES: (state, payload) => {
    state.arrCompanies = payload
  },
 
}
const actions = {
  getCompaniesLaw({ commit }) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.get('/accounting/getCompaniesLaw', config).then(res => {
        const { data } = res
        commit('SET_COMPANIES', data)
        resolve(data)
      }).catch(error => {
        console.log(error)
      })
    })
  },
  async updateAntilavado({ commit, state },formData){
    return new Promise((resolve, reject) => {
  

       Api.post('/accounting/updateAntilavado',formData).then(res=>{ 
        resolve(res);
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },
   async addAntilavado({ commit, state },formData){
    return new Promise((resolve, reject) => {
  

       Api.post('/accounting/addAntilavado',formData).then(res=>{ 
        resolve(res);
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },

   async searchDataAntilavado({ commit, state },formData){
    return new Promise((resolve, reject) => {
  

       Api.post('/accounting/getDataAntilavado',formData).then(res=>{ 
        resolve(res);
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
