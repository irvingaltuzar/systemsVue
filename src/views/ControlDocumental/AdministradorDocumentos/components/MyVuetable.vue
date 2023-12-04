<template>
  <div class="m-tabl">

    <table class="table table-responsive-lg table-hover">
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
            Privacidad
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
        >

          <td style="width: 20%" @click="HasChildren(item.documentoid,item.documentoPadre,item.titulo)"><img class="img-ico" :src="url_folder"></td>
          <td @click="HasChildren(item.documentoid,item.documentoPadre,item.titulo)"><b>{{ item.titulo }}</b></td>
          <td @click="HasChildren(item.documentoid,item.documentoPadre,item.titulo)">CARPETA</td>
          <td />
          <td />
          <td>
            <el-button
              type="primary"
              icon="el-icon-edit"
              title="Editar"
              circle
              @click="EditCarpeta(item.titulo,item.documentoid)"
            />
            <el-button type="danger" icon="el-icon-delete" title="Eliminar" circle @click="Confirmar2(item.documentoid)" />
          </td>
        </tr>

        <tr
          v-for="(item, index) in archivos"
          :key="`a-${index}`"
        >
          <td style="width: 20%"> <img class="img-ico" :src="item.icono"></td>
          <td>  <b>{{ item.titulo }}  </b> <br> Descargas: &nbsp;  <b> {{ item.numeroDescargas }}</b>&nbsp;|
            Views:  &nbsp; <b>{{ item.numeroConsultas }} </b>&nbsp;|
            Tamaño:  &nbsp; <b>{{ item.size }} </b></td>
          <td>{{ item.extension }}</td>
          <td>{{ item.privacidadText }}</td>
          <td>{{ item.fechaCaptura }}</td>

          <td>
            <el-button type="success" icon="el-icon-download" title="Descargar" circle @click="DescargarArchivo(item.archivo)" />
            <el-button type="warning" icon="el-icon-view" title="Ver Documento" circle @click="ViewArchivo(item.urlArchivo,item.id)" />
            <el-button
              type="primary"
              icon="el-icon-edit"
              title="Editar"
              circle
              @click="EditArchivo(item.documentoId,item.id,item.titulo,item.tipoDocid,item.topicoid,item.areaId,item.moduloId,item.privacidadid,item.archivo,item.urlArchivo,
                                  item.icono_name,item.icono,item.metadatos,item.ubicacion)"
            />
            <el-button type="danger" icon="el-icon-delete" title="Eliminar" circle @click="Confirmar(item.documentoId,item.id)" />
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
import { HalfCircleSpinner } from 'epic-spinners'
import { Message } from 'element-ui'
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {
  name: 'Browser',
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
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }

      this.returnId.push(docPadre)
      this.actualCarpeta = rows

      // form data
      const formData = new FormData()
      formData.append('documentoPadre', rows)
      formData.append('privacidadId', this.$root.$refs.TabPrivacidad.tabId)

      await Api.post('/getSubCarpetas', formData, config)
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
      await Api.post('/getSubCarpetas', formData, config)
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
      // this.refreshAll();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    Confirmar(documentoId, documentodId) {
      this.$confirm('Estas Seguro de Eliminar el archivo seleccionado?')
        .then(_ => {
          this.EliminarArchivo(documentoId, documentodId)
        }).catch(_ => {})
    },
    Confirmar2(documentoId, documentodId) {
      this.$confirm('Estas Seguro de Eliminar la carpeta seleccionada?')
        .then(_ => {
          this.EliminarCarpeta(documentoId)
        }).catch(_ => {})
    },
    async EditArchivo(docId, docDetId, titulo, tipoDocid, topicoid, areaid, moduloid, privacidadid, archivo, urlarchivo, icono_name, urlicono, metadatos, ubicacion) {
      const listArchivos = []
      const listIcono = []
      const arrMetadato = []
      const arrUbicacion = []
console.log("jvj")
      for (var i = 0; i < ubicacion.length; i++) {
        arrUbicacion.push(ubicacion[i]['ubicacionId'])
      }
      for (var j = 0; j < metadatos.length; j++) {
        arrMetadato.push(metadatos[j]['descripcion'])
      }

      this.$root.$refs.ModalArchivo.dialogType = 'edit'
      this.$root.$refs.ModalArchivo.docId = docId
      this.$root.$refs.ModalArchivo.docDetId = docDetId
      this.$root.$refs.ModalArchivo.ruleForm.titulo = titulo
      this.$root.$refs.ModalArchivo.ruleForm.tipoDoc = tipoDocid
      this.$root.$refs.ModalArchivo.ruleForm.Topico = topicoid
      this.$root.$refs.ModalArchivo.ruleForm.Modulo = moduloid
      this.$root.$refs.ModalArchivo.ruleForm.Area = areaid
      this.$root.$refs.ModalArchivo.ruleForm.privacidad = privacidadid
      this.$root.$refs.ModalArchivo.ruleForm.Metadato = arrMetadato
      this.$root.$refs.ModalArchivo.ruleForm.Ubicacion = arrUbicacion
      listArchivos.push({ name: archivo, url: urlarchivo })
      this.$root.$refs.ModalArchivo.fileList = listArchivos
      listIcono.push({ name: icono_name, url: urlicono })
      this.$root.$refs.ModalArchivo.IconoList = listIcono
      this.$root.$refs.ModalArchivo.dialogVisible = true
    },
    async EditCarpeta(titulo, docId) {
      this.$root.$refs.ModalFolder.dialogType = 'edit'
      this.$root.$refs.ModalFolder.FolderForm.titulo = titulo
      this.$root.$refs.ModalFolder.docId = docId
      this.$root.$refs.ModalFolder.dialogfolderVisible = true
    },
    async EliminarArchivo(documentoId, documentodId) {
      const formAut = new FormData()
      formAut.append('name_view', this.$route.name)
      formAut.append('comentarios', 'Elimino esta Archivo con ID ->' + documentodId)
      formAut.append('evento', 'EliminarArchivo()')

      this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      const formData = new FormData()
      formData.append('documentodId', documentodId)
      formData.append('documentoId', documentoId)

      await Api.post('/deletefile', formData, config)
        .then(function(response) {
          currentObj.success = response.data.success
          currentObj.status = response.statusText
        })
        .catch(function(error) {
          currentObj.output = error
          console.log(error)
        })

      if (currentObj.status === 'OK') {
        this.refreshAll()
        this.$message.success(currentObj.success)
      }
    },
    async EliminarCarpeta(documentoId) {
      // Proceso de Auditoria metodo
      const formAut = new FormData()
      formAut.append('name_view', this.$route.name)
      formAut.append('comentarios', 'Elimino esta Carpeta con ID ->' + documentoId)
      formAut.append('evento', 'EliminarCarpeta()')

      this.$store.dispatch('auditoria/addEventAuditoria', formAut)
      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      const formData = new FormData()
      formData.append('docId', documentoId)

      await Api.post('/deleteCarpeta', formData, config)
        .then(function(response) {
          currentObj.data = response.data
          currentObj.status = response.statusText
        })
        .catch(function(error) {
          currentObj.output = error
          console.log(error)
        })
      if (currentObj.data.success) {
        this.$message.success(currentObj.data.success)
        this.refreshAll()
      } else {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Trato de Eliminar esta Carpeta con ID ->' + documentoId)
        formAut.append('evento', 'EliminarCarpeta()')
        formAut.append('error', 'No se pudo Eliminar la carpeta, ya que contiene archivos')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$message.error('No se puede Eliminar la carpeta,contiene archivos')
      }
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

      await Api.post('/buscarArchivos', formData, config)
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
      await Api.post('/getSubCarpetas', formData, config)
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
    .m-tabl {
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
</style>
