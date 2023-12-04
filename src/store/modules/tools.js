import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor
import Csrf from "./Csrf"
import store from '@/store'
import moment from 'moment'

export default {
  namespaced: true,
  state: {
    payrolls: [],
    data_excel: [],
    test_payrolls: [],
    is_loading: true,
    months: [
      { id: "1", name: 'Enero' },
      { id: "2", name: 'Febrero' },
      { id: "3", name: 'Marzo' },
      { id: "4", name: 'Abril' },
      { id: "5", name: 'Mayo' },
      { id: "6", name: 'Junio' },
      { id: "7", name: 'Julio' },
      { id: "8", name: 'Agosto' },
      { id: "9", name: 'Septiembre' },
      { id: "10", name: 'Octubre' },
      { id: "11", name: 'Noviembre' },
      { id: "12", name: 'Diciembre' },
    ],
    isValidate: false,
    data_json: '',
    loading: true
  },
  mutations: {
    getPayroll(state, year) {
      state.is_loading = true
      state.payrolls = []

      Api.get('/tools/get-payroll/' + year)
      .then(response => {
        response.data.map(val => state.payrolls.push({
          start_date: val.Observaciones.substr(11,10),
          finish_date: val.Observaciones.substr(25,10),
          month:  state.months.find(element => element.id == moment(val.Observaciones.substr(11,10),"DD-MM-YYYY").format("M")).name,
          comments: val.Observaciones,
          year: val.Ejercicio,
          start_month: val.Periodo,
          personal: val.Personal,
          rfc: val.RFC,
          payroll_code: val.MovID,
          company_code: val.Empresa,
          pdf_url: val.ArchivoPDF
        }))

        if (state.payrolls.length > 0) {
          setTimeout(() => {
            state.is_loading = false
          }, 50)
        } else {
          false
        }

      })
      .catch(error => {
        console.log(error)
      })
    },
    getDataExcel(state) {
      Api.get('/suppliers/export-to-excel/')
      .then(response => {

        state.data_excel = response.data
      })
      .catch(error => {
        console.log(error)
      })
    },
  },
  actions: {
    async checkToken({ commit, state }, token) {
      Csrf.getCookie()
        await Api.get('/user/check-token/' + token)
        .then(res=>{
          if (!!res.data.is_validate) {
            state.isValidate = res.data.is_validate
            state.data_json = res.data.data_json
            setTimeout(() => {
              state.loading = false
            }, 1000)
          } else {
            setTimeout(() => {
              state.isValidate = res.data.is_validate
              state.loading = false
            }, 1000)
          }
      })
    },
  }
}
