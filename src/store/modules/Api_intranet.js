import axios from 'axios'

const Api = axios.create({
  // baseURL: "http://localhost:8000"
  baseURL: `${process.env.VUE_APP_INTRANET_API_URL}`
})

Api.defaults.withCredentials = true

// Api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// baseURL: "http://192.168.10.235:8000"

export default Api
