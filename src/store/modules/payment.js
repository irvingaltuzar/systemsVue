import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {
  namespaced: true,
  state: {
    payments: {},
    rowsPerPage: 3,
    headers: {
      limit: 5,
      page: 1,
      order_by: 'desc',
      total: 0,
      search: ''
    },
    loading_get_list: false,
  },
  mutations: {
    getData(state, _page) {
      state.headers.page = _page
      state.loading_get_list = true

      Api.get('/dining/payments/fetch', {
        params: state.headers
      })
        .then(response => {
          state.payments = response.data
          state.loading_get_list = false
          state.headers.total = response.data.total
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
  }
}
