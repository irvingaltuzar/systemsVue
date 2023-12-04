<template>
  <form novalidate class="md-layout" @submit.prevent="store">
    <md-card class="md-layout-item  md-small-size-100">
      <md-card-header>
        <div class="md-title">Comida ofertada del día</div>
      </md-card-header>
      <template>
        <md-card-content>
          <template v-if="is_empty === true">
            <div class="md-layout md-gutter mt-3">
              <div class="md-layout-item md-small-size-100">
                <md-card-media>
                  <img :src="first_image_url">
                </md-card-media>
              </div>
            </div>

            <div class="md-layout md-gutter mt-3">
              <div class="md-layout md-gutter md-alignment-center md-small-size-100">
                <!-- <template v-if="has_product">
                  <md-empty-state
                    class="md-primary"
                    md-icon="done"
                    md-label="Comida tomada"
                    :md-description="'Recuerda solicitar tu comida a nombre de: ' + findObject.product.order.user_name"
                  />
                </template> -->
                <md-list :md-expand-single="expandSingle">
                  <div v-for="(product, i) in offers" :key="i">
                    <md-list-item md-expand>
                      <md-icon>dinner_dining</md-icon>
                      <span class="md-list-item-text">{{ i }}&nbsp;&nbsp; {{ product.length }}</span>
                      <md-list slot="md-expand">
                        <!-- <md-checkbox class="mt-1" v-model="array[product.id]" :value="product">{{ product.order }}</md-checkbox> -->

                        <md-field>
                          <label>Platillos disponibles</label>
                          <md-select v-model="new_product" :md-fuzzy-search="true">
                            <md-option v-for="item in product" :key="item.key" :value="item.id">
                              {{ item.product.order.user_name }}-
                            </md-option>
                          </md-select>
                        </md-field>
                      </md-list>
                    </md-list-item>
                  </div>
                </md-list>
              </div>
            </div>
          </template>
          <template v-else>
            <md-empty-state class="md-primary" md-icon="warning" md-label="Sin platillos ofertados" md-description="No hay platillos ofertados el día de hoy, regresa más tarde." />
          </template>
        </md-card-content>

        <md-progress-bar v-if="disabled" md-mode="indeterminate" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="disabled">Guardar</md-button>
        </md-card-actions>
      </template>
    </md-card>
  </form>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
  name: 'TakeProductComponent',
  filters: {
    dayName(day) {
      const days = [
        { id: 1, key: 'Sun', name: 'Domingo' },
        { id: 2, key: 'Mon', name: 'Lunes' },
        { id: 3, key: 'Tue', name: 'Martes' },
        { id: 4, key: 'Wed', name: 'Miércoles' },
        { id: 5, key: 'Thu', name: 'Jueves' },
        { id: 6, key: 'Fri', name: 'Viernes' },
        { id: 7, key: 'Sat', name: 'Sábado' }
      ]
      const found = days.find(element => element.id === day)
      return found.name
    }
  },
  data: () => ({
    expandSingle: false,
    img_preview: null,
    array: [],
    new_product: '',
    is_loaded: null,
    v: new Object(),
    sending: false,
    disabled: false
  }),
  computed: {
    ...mapState('dining', ['offers', 'first_image_url', 'has_product', 'is_empty']),
    week() {
      var weeknumber = moment().week()

      return weeknumber
    },
    url() {
      return this.is_loaded = !!this.order.menu.image
    },
    findObject() {
      const product = this.new_product
      let founded = []

      Object.values(this.offers).map(type => {
        return type.filter(value => {
          value.id === product ? founded = value : false
        })
      })

      return founded
    }
  },
  methods: {
    ...mapMutations('dining', ['getOfferProducts']),

    store() {
      this.disabled = true

      Api.post('/dining/order/product/take', {
        findObject: this.findObject
      })
        .then(res => {
          this.$store.commit('dining/SET_HAS_PRODUCT', true, { root: true })
          this.$notify({
            title: 'Realizado',
            message: 'Comida tomada correctamente',
            type: 'success'
          })
          Object.assign(this.$data, this.$options.data.call(this))
        })
        .catch(error => {
          this.$notify({
            title: 'Oops!',
            message: 'Ha ocurrido un error, intente nuevamente!',
            type: 'error'
          })
          this.v = new Object()
          setTimeout(() => {
            this.v = error.response.data.errors
          }, 50)
        })
        .finally(() => {
          this.disabled = false
        })
    }
  },
  mounted() {
    this.getOfferProducts()
  }
}
</script>

<style lang="scss" scoped>
	.md-dialog {
		max-width: 70%;
		margin-left: auto;
		margin-right: auto;
	}

	.dropzone-container {
		cursor: pointer;
		min-height: 180px;
		border: 2px dashed rgba(0,0,0,.54);
	}
	.dropzone-content{
		text-align: center;
		margin-top: 4rem;
		color: #777;
	}

	.v-list__tile__title {
		text-align: center!important;
	}

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-field {
    max-width: 300px;
  }

	.size-xsmall {
		width: 10px;
    min-width: 10px;
    height: 10px;
    font-size: 17px!important;
	}

  div {
    text-align: center;
  }

  .md-empty-state {
    display: inline-block;
    vertical-align: middle;

    + .md-empty-state {
      margin-left: 16px;
    }
  }

</style>
