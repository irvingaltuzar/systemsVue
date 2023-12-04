<template>
  <form novalidate class="md-layout" @submit.prevent="store">
    <md-card class="md-layout-item  md-small-size-100">
      <md-card-header>
        <div class="md-title">Semana: {{ week }}</div>
      </md-card-header>

      <template v-if="Object.keys(week_menu).length === 0">
        <empty-dining-menu-component />
      </template>
      <template v-else>
        <md-card-content>
          <div class="md-layout md-gutter mt-3">
            <div class="md-layout-item md-small-size-100">
              <md-card-media>
                <img :src="week_menu.first_image_url">
              </md-card-media>
            </div>
          </div>
          <div class="md-layout md-gutter mt-3">
            <div class="md-layout md-gutter md-alignment-center">
              <div v-for="(day) in week_menu.enabled_days" :key="day">
                <div class="md-list-item-text pl-3 pt-3">
                  <b><span>{{ day | dayName }}</span></b>
                  <md-checkbox v-model="array[day]" class="mt-1" value="1">Estandar</md-checkbox>
                  <md-checkbox v-model="array[day]" class="mt-1" value="2">Light</md-checkbox>
                  <md-checkbox v-model="array[day]" class="mt-1" value="3">Vergano</md-checkbox>
                  <md-checkbox v-model="array[day]" class="mt-1" value="4">Vegetariano</md-checkbox>
                </div>
              </div>
            </div>
          </div>
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
  name: 'CreateUserOrderComponent',

  data: () => ({
    img_preview: null,
    array: [],
    is_loaded: null,
    v: new Object(),
    days: [
      { id: 1, key: 'Sun', name: 'Domingo' },
      { id: 2, key: 'Mon', name: 'Lunes' },
      { id: 3, key: 'Tue', name: 'Martes' },
      { id: 4, key: 'Wed', name: 'Miércoles' },
      { id: 5, key: 'Thu', name: 'Jueves' },
      { id: 6, key: 'Fri', name: 'Viernes' },
      { id: 7, key: 'Sat', name: 'Sábado' }
    ],
    sending: false,
    disabled: false
  }),
  computed: {
    ...mapState('locations', ['locations']),
    ...mapState('dining', ['week_menu', 'cat_food_type']),
    week() {
      var weeknumber = moment().week()

      return weeknumber
    }
  },
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
  methods: {
    ...mapMutations('locations', ['getLocations']),
    ...mapMutations('dining', ['getWeekMenu', 'getCatFoodType', 'changeStep']),
    store() {
      this.disabled = true

      if (this.array.length === 0) {
        this.$notify({
          title: 'Oops!',
          message: 'No puedes continuar, sin haber ordenado al menos un día!',
          type: 'error'
        })
        this.disabled = false
      } else {
        const array_order = []

        this.array.map((val, index) => {
          if (val != null) {
            array_order.push({
              day: index,
              type: val
            })
          }
        })
        Api.post('/dining/order/store', {
          menu_id: this.week_menu.id,
          order: array_order
        })
          .then(res => {
            this.$notify({
              title: 'Realizado',
              message: 'Comida solictada correctamente',
              type: 'success'
            })
            Object.assign(this.$data, this.$options.data.call(this))
            this.changeStep(0)
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
    }
  },
  mounted() {
    this.getLocations()
    this.getWeekMenu()
    this.getCatFoodType()
    this.$material.locale = {
      startYear: 1900,
      endYear: 2099,
      dateFormat: 'yyyy-MM-dd',
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      shortDays: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
      shorterDays: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'],
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
      shorterMonths: ['J', 'F', 'M', 'A', 'M', 'Ju', 'Ju', 'A', 'Se', 'O', 'N', 'D'],
      firstDayOfAWeek: 0,
      cancel: 'Cancelar',
      confirm: 'Ok'
    }
  }
}
</script>

<style lang="scss" scoped>

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
.viewport {
	width: 320px;
	max-width: 100%;
	display: inline-block;
	vertical-align: top;
	overflow: auto;
	border: 1px solid rgba(#000, .12);
}
</style>
