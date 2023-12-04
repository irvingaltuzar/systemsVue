
import store from '@/store'
import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor
import Vue from 'vue'
const getters = {
  PersonalAttendance: state => state.arrAsistencia,
  HoursEntrance: state => state.arrHourEntrance,
  HoursFood: state => state.arrHourFood,
  HorarioPendiente: state => state.arrHorarioPendiente,
  DaysOff: state => state.arrDaysOff,
}
const state = {
  arrAsistencia: [],
  arrHourEntrance: [],
  arrHourFood: [],
  arrHorarioPendiente: [],
  arrDaysOff:[]
}

const mutations = {
  SET_ASISTENCIA: (state, payload) => {
    state.arrAsistencia = payload
  },
  SET_HOUR_ENTRANCE: (state, payload) => {
    state.arrHourEntrance = payload
  },
  SET_HOUR_FOOD: (state, payload) => {
    state.arrHourFood = payload
  },
  SET_HORARIO_PENDIENTE: (state, payload) => {
    state.arrHorarioPendiente = payload
  },
  SET_DAYS_OFF: (state, payload) => {
    try {
      const items = payload

      const type = items.map(v => {
        Vue.set(v, 'edit', false)
        Vue.set(v, 'disabled', true)
        v.originaldescripcion = v.date
        v.originalborrado = v.deleted_at
        return v
      })

      state.arrDaysOff = type
    } catch (error) {
      console.error(error)
    }
  },
}
const actions = {
  getPersonalAttendance({ commit }, formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.post('/controlAsistencia/getPersonalAttendance', formData, config).then(res => {
        const { data } = res
        commit('SET_ASISTENCIA', data)
        resolve(data)
      }).catch(error => {
        console.log(error)
      })
    })
  },
  // Arr Hours for module Solicitar Cambio Horario
  getHourEntrance({ commit }, formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.get('/controlAsistencia/getHourEntrance').then(res => {
        const { data } = res
        commit('SET_HOUR_ENTRANCE', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  // Arr Hours FOOD for module Solicitar Cambio Horario
  getHourFood({ commit }, formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.get('/controlAsistencia/getHourFood').then(res => {
        const { data } = res
        commit('SET_HOUR_FOOD', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  // get horario for module Solicitar cambio de Horario
   getHorarioPendiente({ commit }, formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.get('/controlAsistencia/getHorarioPendiente').then(res => {
        const { data } = res
        commit('SET_HORARIO_PENDIENTE', data)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },
  getDaysOff({ commit }) {
    return new Promise((resolve) => {
      Api.get('/controlAsistencia/getDaysOff').then(res => {
        const { data } = res
        commit('SET_DAYS_OFF', data)
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
