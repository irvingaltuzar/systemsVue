<template>
  <div class="m-table">

    <table class="table table-lg">
      <thead>
        <tr>
          <th class="w-10" />
          <th class="w-65">
            Nombre

          </th>
          <th class="w-30">
            Tipo
          </th>
          <th class="w-10">
            Fecha

          </th>
          <th class="w-auto">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody v-if="loadTable">
        <tr v-if="actualCarpeta!=0">
          <td colspan="5" class="fm-content-item" @click="returnFolder()">
            <i class="fas fa-level-up-alt" /> <b>Regresar</b>

          </td>
        </tr>
        <tr
          v-for="(item, index) in carpetas"
          :key="`d-${index}`"
          @click="HasChildren(item.documentoid,item.documentoPadre,item.titulo)"
        >

          <td style="width: 15%;"><img class="img-ico" :src="url_folder"></td>
          <td><b>{{ item.titulo }}</b></td>
          <td>CARPETA</td>
          <td />
          <td />
        </tr>

        <tr
          v-for="(item, index) in archivos"
          :key="`a-${index}`"
        >
          <td style="width: 15%;"><img class="img-ico" :src="item.icono"></td>
          <td>  <b>{{ item.titulo }}</b> <br> Descargas: &nbsp;  <b> {{ item.numeroDescargas }}</b>&nbsp;|
            Views:  &nbsp; <b>{{ item.numeroConsultas }} </b>&nbsp;|
            Tamaño:  &nbsp; <b>{{ item.size }} </b></td>
          <td>{{ item.extension }}</td>
          <td>{{ item.fechaCaptura }}</td>

          <td>
            <el-button type="success" icon="el-icon-download" title="Descargar" circle @click="DescargarArchivo(item.archivo)" />
            <el-button type="warning" icon="el-icon-view" title="Ver Documento" circle @click="ViewArchivo(item.urlArchivo,item.id)" />
          </td>
        </tr>

      </tbody>
    </table>
    <!-- <Delete ref="ModalDelete"/> -->
    <div v-if="isLoaded" class="spinner">
      <half-circle-spinner
        :animation-duration="2000"
        :size="60"
        color="#304156"
      />
    </div>

    <el-dialog
      title="Preview Documento"
      :visible.sync="dialogVisible"
      width="85%"
      top="3vh"
      height="95vh"
      @close="url= ''"
    >
      <iframe id="fred" style="border:1px solid #666CCC" title="" :src="url" frameborder="0" scrolling="auto"  width="100%" />
    </el-dialog>

  </div>

</template>

<script>
// import pdf from 'vue-pdf'
import { HalfCircleSpinner } from 'epic-spinners'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {
  components: {
    HalfCircleSpinner

  },
  data() {
    return {
      search: '',
      multipleSelection: [],
      carpetas: [],
      returnId: [],
      archivos: [],
      pdf: '',
      actualCarpeta: 0,
      isLoaded: false,
      loadTable: false,
      dialogVisible: false,
      url: null,
      url_folder: null
    }
  },
  computed: {
    ...mapGetters([
      'ubicacion'

    ])
  },
  created() {
    this.$root.$refs.Browser = this
    this.url_folder = process.env.VUE_APP_URL_IMG_FOLDER
  },

  methods: {
    open() {
      this.$notify.success({
        title: 'Success',
        message: 'This is a success message',
        offset: 100
      })
    },
    async HasChildren(rows, docPadre, path) {
      // Proceso de Auditoria metodo
      const formAut = new FormData()
      formAut.append('name_view', this.$route.name)
      formAut.append('comentarios', 'Entró a esta carpeta ->' + path)
      formAut.append('evento', 'HasChildren()')

      this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      this.loadTable = false
      this.isLoaded = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}

      this.returnId.push(docPadre)
      this.actualCarpeta = rows
      console.log(this.ubicacion)

      // form data
      const formData = new FormData()
      formData.append('documentoPadre', rows)
      formData.append('privacidadId', this.$root.$refs.TabPrivacidad.tabId)
      formData.append('ubicacion', this.ubicacion)

      await Api.post('/getSubCarpetaspublic', formData, config)
        .then(function(response) {
          currentObj.success = response.data.success
          currentObj.status = response.statusText
          currentObj.data = response.data[0].carpetas
          currentObj.archivos = response.data[0].archivos
        })
        .catch(function(error) {
          currentObj.output = error
          console.log(error)
        })
      this.$root.$refs.breadcrumb.arrpath.push(path)
      this.isLoaded = false
      this.loadTable = true
      this.carpetas = currentObj.data
      this.archivos = currentObj.archivos
    },
    async returnFolder() {
      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      if (this.returnId === '') {
        this.returnId = [0]
      }
      this.loadTable = false
      this.isLoaded = true
      this.actualCarpeta = this.returnId[this.returnId.length - 1]
      console.log(this.actualCarpeta)
      // console.log( this.returnId.pop())
      const formData = new FormData()
      formData.append('documentoPadre', this.returnId[this.returnId.length - 1])
      formData.append('privacidadId', this.$root.$refs.TabPrivacidad.tabId)
      formData.append('ubicacion', this.ubicacion)
      await Api.post('/getSubCarpetaspublic', formData, config)
        .then(function(response) {
          currentObj.success = response.data.success
          currentObj.status = response.statusText
          currentObj.data = response.data[0].carpetas
          currentObj.archivos = response.data[0].archivos
        })
        .catch(function(error) {
          currentObj.output = error
          console.log(error)
        })
      this.loadTable = true
      this.isLoaded = false
      this.carpetas = currentObj.data
      this.archivos = currentObj.archivos
      this.returnId.pop()
      this.$root.$refs.breadcrumb.arrpath.pop()
    },

    async ViewArchivo(archivo, documentodId) {
      // Proceso de Autoria metodo
      const formAut = new FormData()
      formAut.append('name_view', this.$route.name)
      formAut.append('comentarios', 'Abrio este documento ' + archivo)
      formAut.append('evento', 'ViewArchivo()')

      this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      this.url = ''
      this.url = archivo
      this.dialogVisible = true
      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      const formData = new FormData()
      formData.append('documentodId', documentodId)

      setTimeout(() =>

        Api.post('/viewarchivo', formData, config)
          .then(function(response) {
            currentObj.success = response.data.success
            currentObj.status = response.statusText
          })
          .catch(function(error) {
            currentObj.output = error
            console.log(error)
          })
      , 1000)
    },
    async DescargarArchivo(file) {
      // Proceso de Auditoria metodo
      const formAut = new FormData()
      formAut.append('name_view', this.$route.name)
      formAut.append('comentarios', 'Descargó este documento ->' + file)
      formAut.append('evento', 'DescargarArchivo()')

      this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      const config = {
        headers: {
          'content-type': 'application/*'

        }
      }
      const formData = new FormData()
      formData.append('file', file)

      await Api.post('/download', formData, { config, responseType: 'blob'
      })
        .then(function(res) {
          const blob = new Blob([res.data], { type: res.headers['content-type'] })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.slice(file.lastIndexOf('/') + 1)
          link.click()
        })
        .catch(function(error) {
          if (error.response.status === 422) {
            Message({
              message: 'Error 404: No se encuentra el Archivo a Descargar' || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
      // this.refreshAll()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    async buscar(consulta, tipoDoc, Area, topico, Modulo) {
      // Proceso de Auditoria metodo
      const formAut = new FormData()
      formAut.append('name_view', this.$route.name)
      formAut.append('comentarios', 'Realizando esta búsqueda ->' + consulta)
      formAut.append('evento', 'buscar()')

      this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      const currentObj = this
      const query = consulta
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      this.loadTable = false
      this.isLoaded = true
      const formData = new FormData()
      formData.append('query', query)
      formData.append('tipoDoc', tipoDoc)
      formData.append('topico', topico)
      formData.append('area', Area)
      formData.append('modulo', Modulo)
      formData.append('ubicacion', this.ubicacion)

      await Api.post('/buscarArchivospublicos', formData, config)
        .then(function(response) {
          currentObj.success = response.data.success
          // currentObj.filename = "";
          currentObj.status = response.statusText
          currentObj.data = ''
          currentObj.archivos = response.data
        })
        .catch(function(error) {
          currentObj.output = error
          console.log(error)
        })
      this.loadTable = true
      this.isLoaded = false
      this.carpetas = currentObj.data
      this.archivos = currentObj.archivos
    },
    async refreshAll() {
      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      this.loadTable = false
      this.isLoaded = true
      const formData = new FormData()
      formData.append('documentoPadre', this.actualCarpeta)
      formData.append('privacidadId', this.$root.$refs.TabPrivacidad.tabId)
      formData.append('ubicacion', this.ubicacion)

      await Api.post('/getSubCarpetaspublic', formData, config)
        .then(function(response) {
          currentObj.success = response.data.success
          // currentObj.filename = "";
          currentObj.status = response.statusText
          currentObj.data = response.data[0].carpetas
          currentObj.archivos = response.data[0].archivos
        })
        .catch(function(error) {
          currentObj.output = error
          console.log(error)
        })
      this.loadTable = true
      this.isLoaded = false
      this.carpetas = currentObj.data
      this.archivos = currentObj.archivos
    }
  }
}
</script>

<style lang="scss" scoped>
    .spinner{
            position: relative;
            margin-left: 47%;
        }
    .m-table {
         margin-top: 0px;
      height: auto;
      width:100%;
      // overflow: overlay;
      padding: 1%;
      border: white 4px ridge;
        thead th{
            background: white;
            // position: sticky;
            // top: 0;
            // z-index: 10;
            cursor: pointer;
            // border-top: none;

            &:hover {
                background-color: #f8f9fa;
            }

            & > i {
                padding-left: 0.5rem;
            }
        }

        td {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        tr:hover {
            background-color: #f8f9fa;
        }

        .w-10 {
            width: 10%;
        }
          .w-30 {
            width: 30%;
        }
        .w-65 {
            width: 55%;
        }

        .fm-content-item {
            cursor: pointer;
            max-width: 1px;
        }

        .text-hidden {
            color: #cdcdcd;
        }
        tbody tr{
           background: white;
            // position: sticky;
            top: 0;
            // z-index: 10;
            cursor: pointer;
            // border-top: none;

           &:hover {
                background-color: #f8f9fa;
            }

            & > i {
                padding-left: 0.5rem;
            }
        }
    }
    .img-ico{
       width: 55px !important;
    height: 55px !important;
    display:block;
    }
    iframe {
    display: block;       /* iframes are inline by default */
    background: #000;
    border: none;         /* Reset default border */
    height: 83vh;        /* Viewport-relative units */
    width: 100vw;
}
</style>
