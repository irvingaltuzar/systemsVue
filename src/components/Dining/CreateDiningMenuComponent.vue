<template>
  <form novalidate class="md-layout" @submit.prevent="store">
    <md-card class="md-layout-item  md-small-size-100">
      <md-card-header>
        <div class="md-title">Semana: {{ week }}</div>
      </md-card-header>

      <md-card-content>
        <!-- <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('firstName')">
              <label for="first-name">First Name</label>
              <md-input name="first-name" id="first-name" autocomplete="given-name" v-model="form.firstName" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.firstName.required">The first name is required</span>
              <span class="md-error" v-else-if="!$v.form.firstName.minlength">Invalid first name</span>
            </md-field>
          </div>
        </div> -->

        <div v-if="!!!is_loaded" class="md-layout-item md-small-size-100">
          <div class="md-layout md-gutter" @click="onPickFile">
            <div class="dropzone-container md-layout-item md-small-size-100">
              <div class="dropzone-content">
                <md-icon>touch_app</md-icon>

                <h3 class="dropzone-title title">Haz clic para seleccionar imágenes de su computadora.</h3>
              </div>
              <input ref="fileInput" type="file" style="display: none" accept="image/*" @change="onFilePicked">
            </div>
          </div>
          <span v-if="v.files" class="md-danger" style="color:red;">*{{ v.files[0] }}</span>
        </div>

        <div v-else class="md-layout md-gutter mt-3">
          <div class="md-layout-item md-small-size-100">
            <div>
              <md-button class="md-icon-button md-dense md-raised md-accent mb-4" @click="removeFile()">
                <md-icon>cancel</md-icon>
              </md-button>
            </div>
            <md-card-media>
              <img :src="img_preview">
            </md-card-media>
          </div>
        </div>

        <div class="md-layout md-gutter mt-3">
          <div class="md-layout-item md-small-size-50">
            <md-datepicker v-model="f.start_date" required>
              <label>Fecha de inicio *</label>
            </md-datepicker>
            <span v-if="v.start_date" class="md-danger" style="color:red;">*{{ v.start_date[0] }}</span>
          </div>
          <div class="md-layout-item md-small-size-50">
            <md-datepicker v-model="f.finish_date">
              <label>Fecha de fin *</label>
            </md-datepicker>
            <span v-if="v.finish_date" class="md-danger" style="color:red;">*{{ v.finish_date[0] }}</span>
          </div>
        </div>

        <div class="md-layout md-gutter mt-3">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>Días disponible</label>
              <md-select v-model="f.enabled_days" :md-fuzzy-search="false" multiple>
                <md-option v-for="item in days" :key="item.key" :value="item.id">
                  {{ item.name }}
                </md-option>
              </md-select>
            </md-field>
            <span v-if="v.enabled_days" class="md-error" style="color:red;">*{{ v.enabled_days[0] }}</span>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>Locación</label>
              <md-select v-model="f.location_id" :md-fuzzy-search="false">
                <md-option v-for="item in locations" :key="item.id" :value="item.id">
                  {{ item.name }}
                </md-option>
              </md-select>
            </md-field>
            <span v-if="v.locations_id" class="md-error" style="color:red;">*{{ v.locations_id[0] }}</span>
          </div>
        </div>
      </md-card-content>

      <md-progress-bar v-if="disabled" md-mode="indeterminate" />

      <md-card-actions>
        <md-button type="submit" class="md-primary" :disabled="disabled">Guardar</md-button>
      </md-card-actions>
    </md-card>
  </form>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
  name: 'CreateDiningMenuComponent',

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
      { id: 1, key: 'Sun', name: 'Domingo' },
      { id: 2, key: 'Mon', name: 'Lunes' },
      { id: 3, key: 'Tue', name: 'Martes' },
      { id: 4, key: 'Wed', name: 'Miércoles' },
      { id: 5, key: 'Thu', name: 'Jueves' },
      { id: 6, key: 'Fri', name: 'Viernes' },
      { id: 7, key: 'Sat', name: 'Sábado' }
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
