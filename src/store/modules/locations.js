import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {
  namespaced: true,
  state: {
    locations: []
  },
  mutations: {
    getLocations(state) {
      Api.get('/locations/fetch')
        .then(res => {
          state.locations = res.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
