import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {
  namespaced: true,
  state: {
    dining_menu: {},
    cat_food_type: [],
    user_cashout: {},
    week_menu: [],
    has_product: false,
    product_owner: null,
    first_image_url: null,
    is_empty: false,
    current_order: [],
    offers: [],
    orders: [],
    rowsPerPage: 3,
    headers: {
      limit: 5,
      page: 1,
      order_by: 'desc',
      total: 0,
      search: ''
    },
    step: 0,
    welcome: true,
    loading_get_list: false
  },
  mutations: {
    SET_HAS_PRODUCT(state, value) {
      state.has_product = value
    },
    getData(state, _page) {
      state.headers.page = _page
      state.loading_get_list = true

      Api.get('/dining/fetch', {
        params: state.headers
      })
      .then(response => {
        state.dining_menu = response.data
        state.loading_get_list = false
        state.headers.total = response.data.total
      })
      .catch(error => {
        console.log(error)
        state.loading_get_list = false
      })
    },
    getOrders(state, _page) {
      state.headers.page = _page
      state.loading_get_list = true


      Api.get('dining/order/get-all-orders', {
        params: state.headers
      })
        .then(response => {
          state.orders = response.data
          state.loading_get_list = false
          state.headers.total = response.data.total
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    changeStep(state, value) {
      state.welcome = !state.welcome

      if (state.welcome === true) {
        state.step = 0
      } else {
        state.step = value
      }
    },
    getWeekMenu(state) {
      Api.get('/dining/get-week-menu')
        .then(response => {
          state.week_menu = response.data
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    getCurrentOrder(state) {
      Api.get('/dining/order/get-order')
        .then(response => {
          state.current_order = response.data
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    getCatFoodType(state) {
      Api.get('/dining/get-cat-food-type')
        .then(response => {
          state.cat_food_type = response.data
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    getOfferProducts(state) {
      Api.get('/dining/order/product/get-offer-products')
        .then(response => {
          if (Object.keys(response.data).length > 0) {
            state.offers = response.data

            state.first_image_url = response.data[Object.keys(response.data)[0]][0].product.order.menu.first_image_url

            state.is_empty = true
          } else {
            state.is_empty = false
          }
        })
        .catch(error => {

        })
    },
    getCurrentProduct(state) {
      Api.get('/dining/order/product/get-current-product')
        .then(response => {
          state.has_product = response.data
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    },
    getUserCashOut(state) {
      Api.get('/dining/cashout/get-user-cashout')
        .then(response => {
          state.user_cashout = response.data
        })
        .catch(error => {
          console.log(error)
          state.loading_get_list = false
        })
    }
  }
}
