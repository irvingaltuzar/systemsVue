
import store from '@/store'
import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor

const getters={
  NotificationsUser: state => state.arrNotifications,
  countNotifications: state => state.countNotifications,
}
const state={
  arrNotifications: [],
  countNotifications: 0
}

const mutations= {
  SET_NOTIFICATION_CENTER: (state, payload) => {
    state.arrNotifications = payload
  },
  SET_COUNT_NOTIFICATION: (state, payload) => {
    state.countNotifications = payload
  }

}
const actions={
  NotificationsCenter({ commit }) {
    return new Promise((resolve) => {

     Api.get('/NotificationCenter').then(res => {
      const { data } = res
      commit('SET_NOTIFICATION_CENTER', data)
      resolve();
    }).catch(function(error) {
      console.log(error)
    })
  })
},
countNotification({ commit }) {
  return new Promise((resolve) => {

   Api.get('/countNotification').then(res => {
    const { data } = res
    commit('SET_COUNT_NOTIFICATION', data)
    resolve();
  }).catch(function(error) {
    console.log(error)
  })
})
},
changeStatusNotification({ commit }, formData) {
  const config = { headers: { 'content-type': 'multipart/form-data' }}
  return new Promise((resolve) => {
    Api.post('/changeStatusNotification', formData, config).then(res => {
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