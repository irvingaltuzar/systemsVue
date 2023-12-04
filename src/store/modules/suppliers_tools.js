import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {
  namespaced: true,
  state: {
    total_data: {},
    suppliers: {},
    specialties: {},
    has_change: false,
    showDialog: false,
    has_change: false,
    rowsPerPage: 3,
    headers: {
      limit: 5,
      page: 1,
      status: 0,
      order_by: 'desc',
      total: 0,
      search: ''
    },
    step: 0,
    loading_get_list: false
  },
  mutations: {
    getTotalData(state, _page) {
      state.headers.page = _page
      state.loading_get_list = true
      Api.get('/suppliers/get-total-data')
        .then(response => {
          state.total_data = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    changeValue (state) {
      state.has_change = !!!state.hasChange
    },
    changeTable(state) {
      state.has_change = true,
      state.loading_get_list = true
    },
    fetchSuppliers (state, payload) {
      var [_page, status] = payload

      state.headers.page = _page
      state.headers.status = status

      Api.get('/suppliers/fetch', {
        params: state.headers
      })
      .then(response => {
        state.suppliers = response.data
        state.loading_get_list = false
        state.headers.total = response.data.total
      })
      .catch(error => {
        state.loading_get_list = false
      })
    },
    fetchSpecialties (state, _page) {

      state.headers.page = _page

      Api.get('/suppliers/fetch-specialties', {
        params: state.headers
      })
      .then(response => {
        state.specialties = response.data
        state.loading_get_list = false
        state.headers.total = response.data.total
      })
      .catch(error => {
        state.loading_get_list = false
      })
    },
    fetchCatSpecialties (state) {

      Api.get('/suppliers/fetch-cat-specialties')
      .then(response => {
        state.specialties = response.data
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
}
