<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Ofertar comida</md-dialog-title>

      <md-dialog-content class="md-scrollbar">

        <form novalidate class="md-layout" @submit.prevent="store">
          <md-card class="md-layout-item  md-small-size-100">

            <md-card-content>
              <div class="md-layout md-gutter mt-3">
                <div class="md-layout-item md-small-size-100">
                  <md-card-media>
                    <img :src="img_preview">
                  </md-card-media>
                </div>
              </div>

              <div class="md-layout md-gutter mt-3">
                <div class="md-layout md-gutter md-alignment-center">
                  <div v-for="(product) in order.products" :key="product.id">
                    <div class="md-list-item-text pl-3 pt-3">
                      <b><span>{{ product.work_day_id | dayName }}</span></b>
                      <md-checkbox v-model="array[product.work_day_id]" class="mt-1" :value="product.id">{{ product.food_type }}</md-checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </md-card-content>

            <md-progress-bar v-if="disabled" md-mode="indeterminate" />

            <md-card-actions>
              <md-button type="submit" class="md-primary" :disabled="disabled">Guardar</md-button>
            </md-card-actions>
          </md-card>
        </form>

      </md-dialog-content>
    </md-dialog>

    <el-button size="mini" type="info" circle @click="showDialog = true">
      <md-icon class="size-xsmall">local_offer</md-icon>
    </el-button>
  </div>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
  name: 'OfferUserProductComponent',
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
      const found = days.find(element => element.id == day)
      return found.name
    }
  },
  props: {
    order: {
      required: true
    }
  },
  data: () => ({
    showDialog: false,
    img_preview: null,
    array: [],
    is_loaded: null,
    f: {
      enabled_days: [],
      location_id: null,
      menu_id: '',
      description: '',
      file_updated: false,
      files: [],
      new_files: [],
      email: '',
      phone: '',
      start_date: null,
      finish_date: null
    },
    v: new Object(),
    sending: false,
    disabled: false
  }),
  watch: {
    'data'(val) {
      console.log('')
      console.log('')
    }
  },
  computed: {
    ...mapState('locations', ['locations']),
    week() {
      var weeknumber = moment().week()

      return weeknumber
    },
    url() {
      return this.is_loaded = !!this.order.menu.image
    },
    data() {
      this.f.enabled_days = this.order.menu.enabled_days,
      this.f.menu_id = this.order.menu.id,
      this.f.location_id = this.order.menu.location_id,
      this.f.files =	this.order.menu.image,
      this.f.start_date = this.order.menu.start_date,
      this.f.finish_date = this.order.menu.finish_date,
      this.img_preview = this.order.menu.first_image_url
      this.is_loaded = !!this.order.menu.image
      return this.order
    }
  },
  mounted() {
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
  },
  methods: {
    onPickFile() {
      this.$refs.fileInput.click()
    },

    async onFilePicked(event) {
      if (this.f.files.length > 0) {
        this.f.files = []

        this.f.files.lenght === 0 ? this.$refs.fileupload.value = null : false
      } else {
        false
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }

      this.disabled = false

      const imageFile = event.target.files[0]

      this.disabled = false

      const extensions = ['jpg', 'jpeg', 'png']
      const files = Array.from(event.target.files).map(async file => {
        try {
          const compressedFile = await imageCompression(file, options)

          const reader = new FileReader()
          reader.readAsDataURL(compressedFile)

          const ext = file.name.split('.').pop()

          reader.onload = () => {
            this.img_preview = reader.result
            this.f.file_updated = true

            this.is_loaded = true

            this.f.new_files.push({
              data: reader.result,
              name: file.name,
              ext: ext
            })
          }
        } catch (error) {
          console.log(error)
        }
      })
    },
    removeFile(index) {
      this.f.new_files = []

      this.f.new_files.lenght === 0 ? this.$refs.fileupload.value = null : false

      this.is_loaded = false
    },
    store() {
      this.disabled = true

      if (this.array.length === 0) {
        this.$notify({
          title: 'Oops!',
          message: 'No puedes continuar, sin haber seleccionado al menos un día!',
          type: 'error'
        })
        this.disabled = false
      } else {
        const array_order = []

        this.array.map((val, index) => {
          if (val != null) {
            array_order.push({
              day: index,
              product: val
            })
          }
        })

        Api.post('/dining/order/product/offer', {
          product: array_order,
          info: this.order
        })
          .then(res => {
            console.log(res.data)
            this.$notify({
              title: 'Realizado',
              message: 'Comida ofertada correctamente',
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
    }
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

</style>
