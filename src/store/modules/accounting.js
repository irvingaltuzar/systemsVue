import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {
  namespaced: true,
  state: {
    accounting_companies: {},
    has_change: false,
    e_accounting_statues: {},
    cat_overviews: {},
    e_accountings: {},
    interim_accountings: {},
    overviews_accountings: {},
    rowsPerPage: 3,
    headers: {
      limit: 5,
      page: 1,
      order_by: 'asc',
      month: '',
      year: 2022,
      total: 0,
      search: ''
    },
    loading_get_list: false,
    managers: {},
    erps: {},
    work_stations: {},
    accountants: {}
  },
  mutations: {
    getEAccountingStatues(state) {
      Api.get('/accounting/get-e-status')
      .then(response => {
        state.e_accounting_statues = response.data
      })
      .catch(error => {
        console.log(error)
        state.loading_get_list = false
      })
    },
    getCatOverview(state) {
      Api.get('/accounting/get-cat-overviews')
      .then(response => {
        state.cat_overviews = response.data
      })
      .catch(error => {
        console.log(error)
        state.loading_get_list = false
      })
    },
    changeValue (state) {
      state.has_change = !!!state.hasChange
    },
    getData(state, _page) {
      state.headers.page = _page
      state.loading_get_list = true

      Api.get('/accounting/fetch-companies', {
        params: state.headers
      })
      .then(response => {
        state.accounting_companies = response.data
        state.loading_get_list = false
        state.headers.total = response.data.total
      })
      .catch(error => {
        console.log(error)
        state.loading_get_list = false
      })
    },
    getElectronicAccounting(state, _page) {
      state.headers.page = _page
      state.loading_get_list = true

      Api.get('/accounting/fetch-e-accounting', {
        params: state.headers
      })
        .then(response => {
          state.e_accountings = response.data
          state.loading_get_list = false
          state.headers.total = response.data.total
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    getOverviews(state, _page) {
      state.headers.page = _page
      state.loading_get_list = true

      Api.get('/accounting/fetch-overviews-accounting', {
        params: state.headers
      })
        .then(response => {
          state.overviews_accountings = response.data
          state.loading_get_list = false
          state.headers.total = response.data.total
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    getInterims(state, _page) {
      state.headers.page = _page
      state.loading_get_list = true

      Api.get('/accounting/fetch-interim', {
        params: state.headers
      })
        .then(response => {
          state.interim_accountings = response.data
          state.loading_get_list = false
          state.headers.total = response.data.total
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    pushCompany(state, company) {
      state.accounting_companies.data.unshift(company)
      state.headers.total = response.data.total
    },
    getAccountantPersonal(state) {
      Api.get('/accounting/fetch-personal')
        .then(response => {
          state.managers = response.data.filter(value => value.position_company === 'GERENTE')
          state.accountants = response.data.filter(value => value.position_company !== 'GERENTE')
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    getTools(state) {
      Api.get('/accounting/get-tools')
        .then(response => {
          state.work_stations = response.data.work_stations
          state.erps = response.data.erps
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    getAllCompanies (state) {
      Api.get('/accounting/fetch-all-companies')
      .then(response => {
        state.accounting_companies = response.data
      })
      .catch(error => {
        console.log(error)
        state.loading_get_list = false
      })
    }
  }
}
