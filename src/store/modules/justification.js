
import store from '@/store'
import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor
import Vue from 'vue'
const getters = {
  typeJustifications: state => state.typeJustification,
  MyJustifications: state => state.arrMyJustifications,
  JustificationsMyPersonal: state => state.arrJustificationsMyPersonal,
  typeJustificationsActive: state => state.typeJustification_active,
  typeJustificationTbl: state => state.typeJustificationTbl,
  StaffAttendance:state => state.arrStaff,
}
const state = {
  typeJustification: [],
  arrMyJustifications: [],
  typeJustification_active:[],
  typeJustificationTbl: [],
  arrStaff: [],
  arrJustificationsMyPersonal:[],
}

const mutations = {
  set_typejustification: (state, payload) => {
    state.typeJustification = payload
  },
  SET_MY_JUSTIFICATIONS: (state, payload) => {
    state.arrMyJustifications = payload
  },
  SET_JUSTIFICATIONS_MY_PERSONAL: (state, payload) => {
    state.arrJustificationsMyPersonal = payload
  },
  set_typejustification_active: (state, payload) => {
    state.typeJustification_active = payload
  },
  SET_TypeJustificationTable: (state, payload) => {
    try {
      const items = payload

      const type = items.map(v => {
        Vue.set(v, 'edit', false)
        Vue.set(v, 'disabled', true)
        v.originaldescripcion = v.description
        v.originalborrado = v.deleted
        return v
      })

      state.typeJustificationTbl = type
    } catch (error) {
      console.error(error)
    }
  },
  SET_STAFF: (state, payload) => {
    state.arrStaff = payload
  },
}
const actions = {
  getTypeJustification({ commit }) {
    return new Promise((resolve) => {
      Api.get('/controlAsistencia/getTypeJustification').then(res => {
        const { data } = res
        const data2 = data
        commit('set_typejustification', data)
        commit('SET_TypeJustificationTable', data2)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },

  getMyJustifications({ commit }) {
    return new Promise((resolve) => {
      Api.get('/controlAsistencia/getMyJustifications').then(res => {
        const { data } = res
        commit('SET_MY_JUSTIFICATIONS', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getJustificationsMyPersonal({ commit }) {
    return new Promise((resolve) => {
      Api.get('/controlAsistencia/getJustificationsMyPersonal').then(res => {
        const { data } = res
        commit('SET_JUSTIFICATIONS_MY_PERSONAL', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getTypeJustificationActive({ commit }) {
    return new Promise((resolve) => {
      Api.get('/controlAsistencia/getTypeJustificationActive').then(res => {
        const { data } = res
        commit('set_typejustification_active', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  addJustification({ commit }, formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.post('/controlAsistencia/addJustification', formData, config).then(res => {
        resolve(res)
      }).catch(function(error) {
        console.log(error)
      })
    })
  },
  addJustificationUser({ commit }, formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.post('/controlAsistencia/addJustificationUser', formData, config).then(res => {
        resolve(res)
      }).catch(function(error) {
        console.log(error)
      })
    })
  },
  getCommading_staff_att({ commit }) {
    return new Promise((resolve) => {
      Api.get('/controlAsistencia/getCommanding_staff').then(res => {
        const { data } = res
        commit('SET_STAFF', data)
        resolve()
      }).catch(error => {
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
