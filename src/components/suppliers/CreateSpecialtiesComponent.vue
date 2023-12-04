<template>
    <div>
      <md-dialog :md-active.sync="showDialog">
        <md-dialog-title class="dialog-header">Registrar nueva especialidad</md-dialog-title>
        <form class="md-layout -mb-3" @submit.prevent="store">
  
          <md-dialog-content class="md-scrollbar">
            <md-card-content>

              <div class="md-layout md-gutter mt-3">
                <div class="md-layout-item md-small-size-100">
                  <md-field>
                    <label>Nombre especialidad</label>
                    <md-input v-model="f.description"></md-input>
                    <span v-if="v.description" class="md-danger" style="color:red;">*{{ v.description[0] }}</span>
                  </md-field>
                </div>
              </div>
            </md-card-content>
            <md-progress-bar v-if="disabled" md-mode="indeterminate" />
            <md-button type="submit" class="md-primary" :disabled="disabled">Guardar</md-button>
          </md-dialog-content>
        </form>
      </md-dialog>
      <el-button size="mini" type="success" @click="showDialog = true">
        <md-icon class="size-xsmall" style="color:white;">add_circle</md-icon>
      </el-button>
    </div>
  </template>
  
  <script>
  import imageCompression from 'browser-image-compression'
  import { mapMutations, mapState } from 'vuex'
  import moment from 'moment'
  import Api from '@/store/modules/Api'
  
  export default {
    name: 'CreateSpecialtiesComponent',
    data: () => ({
      showDialog: false,
      is_loaded: null,
      f: {
        description: '',
      },
      v: new Object(),
      sending: false,
      disabled: false
    }),
    methods: {
      ...mapMutations('suppliers_tools', ['changeValue']),
      store() {
        this.disabled = true
        Api.post('/suppliers/specialties/store', {
          description: this.f.description,
        })
          .then(res => {
            this.$notify({
              title: 'Realizado',
              message: 'Especialidad creada correctamente',
              type: 'success'
            })
            Object.assign(this.$data, this.$options.data.call(this))
						this.changeValue()
            this.showDialog = false
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
						this.changeValue()
          })
      }
    },
    computed: {
      ...mapState('suppliers_tools', ['has_change'])
    },
  }
  </script>
  
  <style lang="css">
      .md-dialog {
          max-width: 100%;
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
    .md-field {
      max-width: 300px;
    }
  
      .size-xsmall {
          width: 10px;
      min-width: 10px;
      height: 10px;
      font-size: 17px!important;
  
      }
  
    /* .el-input__inner {
        display: block !important;
        outline: none !important;
        border: none !important;
        height: 2em !important;
        font-size: 16px !important;
        margin-bottom: 1px !important;
        border-bottom: 1px solid #333 !important;
    } */
  
    /* .el-input__inner.border: unset!important;{
  
    } */
  
    .dialog-header {
      background-color: #3f5465;
      color: white;
    }
  
    .-mb-3 {
      margin-top: -2.7rem;
    }
  
  </style>
  