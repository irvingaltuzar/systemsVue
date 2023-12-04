<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar style="background-color:#1c5a79">
        <span class="md-title" style="color:white">Servicio de comedor</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <!-- <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar> -->

        <md-list @md-changed="checkNewPosts">
          <md-list-item @click="test(1)">
            <md-icon>history</md-icon>
            <span class="md-list-item-text">Historial menú</span>
          </md-list-item>
          <md-list-item @click="test(2)">
            <md-icon>edit</md-icon>
            <span class="md-list-item-text" link>Cargar menú</span>
          </md-list-item>

          <md-list-item @click="test(3)">
            <md-icon>paid</md-icon>
            <span class="md-list-item-text">Cobros</span>
          </md-list-item>

          <!-- <md-list-item>
            <md-icon>local_offer</md-icon>
            <span class="md-list-item-text">Comida ofertada</span>
          </md-list-item> -->
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <div v-if="step === 1">
          <!-- <section class="app-main"> -->
          <transition name="fade-transform" mode="out-in">
            <dining-menu-list-component />
          </transition>
          <!-- </section> -->
        </div>
        <div v-if="step === 2">
          <!-- <section class="app-main"> -->
          <transition name="fade-transform" mode="out-in">
            <create-dining-menu-component />
          </transition>
          <!-- </section> -->
        </div>

        <div v-if="step === 3">
          <!-- <section class="app-main"> -->
          <transition name="fade-transform" mode="out-in">
            <dining-payments-component />
          </transition>

          <transition name="fade-transform" mode="out-in">
            <payments-list-component />
          </transition>
          <!-- </section> -->
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
  name: 'DiningMenu',

  data: () => ({
    form: {
      firstName: null,
      lastName: null,
      gender: null,
      age: null,
      email: null
    },
    value: null,
    img_preview: null,
    is_loaded: null,
    step: 0,
    f: {
      enabled_days: [],
      location_id: null,
      user_id: '',
      description: '',
      files: [],
      email: '',
      phone: '',
      start_date: null,
      finish_date: null
    },
    label: 'Date',
    options: {
      locale: 'pt-BR',
      format: 'DD/MM/YYYY',
      clearable: true
    },
    v: new Object(),
    days: [
      { key: 'Sun', name: 'Domingo' },
      { key: 'Mon', name: 'Lunes' },
      { key: 'Tue', name: 'Martes' },
      { key: 'Wed', name: 'Miércoles' },
      { key: 'Thu', name: 'Jueves' },
      { key: 'Fri', name: 'Viernes' },
      { key: 'Sat', name: 'Sábado' }
    ],
    userSaved: false,
    sending: false,
    disabled: false,
    lastUser: null
  }),
  computed: {
    ...mapState('locations', ['locations']),
    week() {
      var weeknumber = moment().week()

      return weeknumber
    }
  },
  methods: {
    ...mapMutations('locations', ['getLocations']),
    checkNewPosts(activeTab) {
      if (activeTab !== 'tab-posts' && !this.checkInterval) {
        this.checkInterval = window.setInterval(() => {
          if (this.newPosts === 99) {
            this.newPosts = '99+'
            this.clearCheckPosts()
          } else {
            this.newPosts++
          }
        }, 1000)
      }
    },
    test(value) {
      this.step = value
    },
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

          console.log(compressedFile)

          const reader = new FileReader()
          reader.readAsDataURL(compressedFile)

          const ext = file.name.split('.').pop()

          reader.onload = () => {
            this.img_preview = reader.result

            this.is_loaded = true

            this.f.files.push({
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
      this.f.files = []

      this.f.files.lenght === 0 ? this.$refs.fileupload.value = null : false

      this.is_loaded = false
    },
    store() {
      this.disabled = true

      Api.post('/dining/menu/store', {
        enabled_days: this.f.enabled_days,
        locations_id: this.f.location_id,
        files: this.f.files,
        start_date: this.f.start_date,
        finish_date: this.f.finish_date
      })
        .then(res => {
          this.$notify({
            title: 'Realizado',
            message: 'Menú guardado correctamente',
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
    this.getLocations()
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
</style>
