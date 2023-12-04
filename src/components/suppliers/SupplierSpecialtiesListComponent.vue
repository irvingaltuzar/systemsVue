<template>
    <div>
      <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>Agregar especialidades</md-dialog-title>
  
        <md-dialog-content class="md-scrollbar">
  
          <form novalidate class="md-layout" @submit.prevent="update">
            <md-card class="md-layout-item  md-small-size-100">
  
              <md-card-content>

              </md-card-content>
  
              <md-progress-bar v-if="disabled" md-mode="indeterminate" />
  
              <md-card-actions>
                <md-button type="submit" class="md-primary" :disabled="disabled">Guardar</md-button>
              </md-card-actions>
            </md-card>
          </form>
  
        </md-dialog-content>
      </md-dialog>
  
      <el-button size="mini" type="warning" circle @click="showDialog = true">
        <md-icon class="size-xsmall">star</md-icon>
      </el-button>
    </div>
  </template>
  
  <script>
  import imageCompression from 'browser-image-compression'
  import { mapMutations, mapState } from 'vuex'
  import moment from 'moment'
  import Api from '@/store/modules/Api'
  
  export default {
    name: 'SupplierSpecialtiesListComponent',
    props: {
      menu: {
        required: true
      }
    },
    data: () => ({
      showDialog: false,
      img_preview: null,
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
        return this.is_loaded = !!this.menu.image
      },
      data() {
        this.f.enabled_days = this.menu.enabled_days,
        this.f.menu_id = this.menu.id,
        this.f.location_id = this.menu.location_id,
        this.f.files =	this.menu.image,
        this.f.start_date = this.menu.start_date,
        this.f.finish_date = this.menu.finish_date,
        this.img_preview = this.menu.first_image_url
        this.is_loaded = !!this.menu.image
        return this.menu
      }
    },
    methods: {
      ...mapMutations('locations', ['getLocations']),
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
      update() {
        this.disabled = true
  
        Api.post('/dining/menu/update', {
          menu_id: this.f.menu_id,
          enabled_days: this.f.enabled_days,
          locations_id: this.f.location_id,
          files: this.f.files,
          file_updated: this.f.file_updated,
          new_files: this.f.new_files,
          start_date: this.f.start_date,
          finish_date: this.f.finish_date
        })
          .then(res => {
            console.log(res.data)
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
  