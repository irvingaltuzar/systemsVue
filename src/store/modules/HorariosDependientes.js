
import store from '@/store'
import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor

const getters = {
  HorariosMiPersonal: state => state.arrHorPersonal
}
const state = {
  arrHorPersonal: []
}

const mutations = {
  SET_HORARIOS_PERSONAL: (state, payload) => {
    state.arrHorPersonal = payload
  }

}
const actions = {
  getHorariosMiPersonal({ commit }, formData) {
    const config = { headers: { 'content-type': 'multipart/form-data' }}
    return new Promise((resolve) => {
      Api.post('/controlAsistencia/getHorariosMiPersonal', formData, config).then(res => {
        const { data } = res
        commit('SET_HORARIOS_PERSONAL', data)
        resolve(data)
      }).catch(error => {
        console.log(error)
      })
    })
  }

}

export default {
  state,
  mutations,
  actions,
  getters
}
