<template>

  <el-dialog width="50%" center top="5vh" :visible.sync="dialogVisible" :title="dialogType==='edit'?'Editar Archivo':'Crear Archivo'">

    <el-form ref="ruleForm" :model="ruleForm" label-width="200px" label-position="left" enctype="multipart/form-data" :rules="rules">

      <el-form-item label="Titulo Archivo" prop="titulo">
        <el-input v-model="ruleForm.titulo" clearable placeholder="" />
      </el-form-item>

      <!-- <div > -->
      <el-form-item label="Tipo Documento" prop="tipoDoc">
        <el-select v-model="ruleForm.tipoDoc" clearable>
          <el-option
            v-for="item in dataCatTipoDoc"
            :key="item.tipoDocumentoId"
            :label="item.nombreTipoDocumento"
            :value="item.tipoDocumentoId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Topico" prop="Topico">
        <el-select v-model="ruleForm.Topico" clearable>
          <el-option
            v-for="item in dataCatTopico"
            :key="item.topicoId"
            :label="item.descripcion"
            :value="item.topicoId"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="dialogType==='edit'" label="Privacidad de Documento" prop="privacidad">
        <el-select v-model="ruleForm.privacidad" clearable>
          <el-option
            v-for="item in dataCatPrivacidad"
            :key="item.privacidadDocumentoId"
            :label="item.descripcion"
            :value="item.privacidadDocumentoId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Area" label-position="right" prop="Area">
        <el-select v-model="ruleForm.Area" clearable>
          <el-option
            v-for="item in dataCatArea"
            :key="item.areaId"
            :label="item.descripcion"
            :value="item.areaId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Modulo" prop="Modulo">
        <el-select v-model="ruleForm.Modulo" clearable>
          <el-option
            v-for="item in dataCatModulo"
            :key="item.moduloId"
            :label="item.descripcion"
            :value="item.moduloId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Ubicacion" prop="Ubicacion">
    <el-select v-model="ruleForm.Ubicacion" size="large" @change="changeUbicacion" clearable multiple allow-create filterable placeholder="Seleccionar">
           <el-option key="0" label="Todos"
            value="Todos"></el-option>
          <el-option
            v-for="item in dataCatUbicacion"
            :key="item.ubicacionId"
            :label="item.descripcion"
            :value="item.ubicacionId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Metadatos" prop="Metadato">
        <el-select v-model="ruleForm.Metadato" size="large" clearable multiple allow-create filterable placeholder="Seleccionar" />
      </el-form-item>

      <el-upload
        ref="upload"
        class="upload-demo"
        id="inputFileUpload"
        action="#"
        v-model="filename"
        :auto-upload="false"
        :on-preview="handlePreview"
        :on-exceed="handleExceed"
        :on-success="handleSucces"
        :on-change="beforeUploadFile"
        :thumbnail-mode="true"
        list-type="text"
        :limit="1"
        :file-list="fileList"
      >
        <el-button size="medium" type="primary">Clic para subir archivo</el-button>
        <div slot="tip" class="el-upload__tip">Solo archivos docx | pdf | mp4 | xlsx </div>
      </el-upload><br>

      <el-container>

        <!-- SINGLE SELECTION -->
        <label>Selecciona Icono predeterminado:</label>
        <vue-select-image ref="selectIcono" class="selectimg" :data-images="listimg" @onselectimage="onSelectImage" />
      </el-container>
      <label>O Selecciona:</label>
      <el-container>
        <el-upload
          ref="uploadico"
          class="upload-demo"
          action="#"
          id="inputFileUpload"
          :auto-upload="false"
          v-model="icono"
          accept="image/png, image/jpeg"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-success="handleSucces"
          :thumbnail-mode="true"
          :on-change="handleChange"
          list-type="picture"
          :limit="1"
          :file-list="IconoList"
        >
          <el-button size="medium" type="primary">Clic para subir Icono personalizado</el-button>
          <div slot="tip" class="el-upload__tip">Solo archivos png con un tamaño menor de 2MB</div>
        </el-upload><br>
      </el-container>
      <!-- </div> -->
      <!-- </el-form-item> -->

    </el-form>

    <div style="text-align:right;">
      <el-button type="danger" @click="CancelarModal()">Cancelar</el-button>
      <el-button v-if="dialogType==='edit'" type="primary" @click="submitEditar('ruleForm')">Editar Archivo <i class="el-icon-upload el-icon-right" /></el-button>
      <el-button v-if="dialogType==='new'" type="primary" @click="submitForm('ruleForm')">Guardar Archivo <i class="el-icon-upload el-icon-right" /></el-button>
      <!-- <el-button type="primary">Subir Archivo</el-button> -->
    </div>
  </el-dialog>

</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {
  data() {
    var validatetitulo = (rule, value, callback) => {
      if (value.trim() == '') {
        return callback(new Error('Por favor Ingresa titulo'))
      } else {
        callback()
      }
    }
    var validateMeta = (rule, value, callback) => {
      var tempArr = []
      for (var i = 0; i < value.length; i++) {
        if (value[i] !== undefined && value[i].trim() != '') {
          tempArr.push(value[i])
        }
      }
      this.ruleForm.Metadato = tempArr
      if (value == '') {
        return callback(new Error('Por favor Ingresa Meta'))
      } else {
        callback()
      }
    }
    return {
      /** Data get Informacion */
      dataCatPrivacidad: [],
      dataCatTipoDoc: [],
      dataCatArea: [],
      dataCatModulo: [],
      dataCatUbicacion: [],
      dataCatTopico: [],
      // dataDocPadre:[],
      /** *Definicion de valores de entrada Model */
      DocPadre: '',
      delivery: false,
      privacidad: '',
      filename: [],
      file: '',
      dialogVisible: false,
      icono: [],
      ico_name: '',
      dialogType: 'new',
      listimg: [{
        id: '1',
        src: process.env.VUE_APP_URL_WORD,
        name: 'word.png'
      }, {
        id: '2',
        src: process.env.VUE_APP_URL_PDF,
        name: 'pdf.png'
      }, {
        id: '3',
        src: process.env.VUE_APP_URL_EXCEL,
        name: 'excel.png'
        // disabled: false
      }, {
        id: '4',
        src: process.env.VUE_APP_URL_MP4,
        name: 'mp4.png'
        // disabled: false
      }],
      fileList: [],
      IconoList: [],
      docId: '',
      docDetId: '',
      ruleForm: {
        titulo: '',
        tipoDoc: '',
        privacidad: '',
        Area: '',
        Modulo: '',
        Metadato: [],
        Ubicacion: [],
        Topico: '',
        file: ''
      },
      rules: {
        titulo: [
          { required: true, message: 'Por favor Ingresa el titulo Documento', trigger: 'blur', validator: validatetitulo }
        ],
        tipoDoc: [
          { required: true, message: 'Por favor Selecciona Tipo Documento', trigger: 'change' }
        ],
        privacidad: [
          { required: true, message: 'Por favor Selecciona privacidad', trigger: 'change' }
        ],
        Topico: [
          { required: true, message: 'Por favor Selecciona Topico', trigger: 'change' }
        ],
        Area: [
          { required: true, message: 'Por favor Selecciona Area', trigger: 'change' }
        ],
        Modulo: [
          { required: true, message: 'Por favor Selecciona Modulo', trigger: 'change' }
        ],
        Metadato: [
          { required: true, message: 'Por favor ingresa tags del documento', trigger: 'change', validator: validateMeta }
        ],
        Ubicacion: [
          { required: true, message: 'Por favor Selecciona Ubicacion', trigger: 'change' }
        ],
        file: [
          { required: true, message: 'Por favor Agrega Archivo', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // this.urlword=process.env.VUE_APP_URL_WORD;
    //     this.urlexcel=process.env.VUE_APP_URL_EXCEL;
    //      this.urlpdf=process.env.VUE_APP_URL_PDF;
    //      this.urlmp4=process.env.VUE_APP_URL_MP4;
  },
  beforeMount() {
    this.$root.$refs.ModalArchivo = this
  },

  methods: {
    async cargaSelects() {
      /** *Peticion para obtener informacion Catalogos Selects Crear/Editar Archivos */
      Api.get('/getCmbArchivos').then(res => {
        this.dataCatPrivacidad = res.data[0].CatPrivacidad
        this.dataCatTipoDoc = res.data[0].CatTipoDoc
        this.dataCatModulo = res.data[0].CatModulo
        this.dataCatUbicacion = res.data[0].CatUbicacion
        this.dataCatTopico = res.data[0].CatTopico
        this.dataCatArea = res.data[0].CatArea

        // Buscador
        this.$root.$refs.Buscador.dataCatTipoDoc = res.data[0].CatTipoDoc
        this.$root.$refs.Buscador.dataCatModulo = res.data[0].CatModulo
        this.$root.$refs.Buscador.dataCatTopico = res.data[0].CatTopico
        this.$root.$refs.Buscador.dataCatArea = res.data[0].CatArea

        // tabs
        this.$root.$refs.TabPrivacidad.arrTab = res.data[0].CatPrivacidad
      }).catch(function(error) {
        console.log(error)
      })
    },
    onSelectImage(e) {
      if (this.$refs.uploadico.uploadFiles != null) {
        this.$refs.uploadico.clearFiles()
      }
      if (this.$refs.uploadico.status == 'ready') {
        this.$refs.uploadico = ''
      }
      this.ico_name = e.name
    },
    async crearArchivo() {
      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      const file = this.$refs.upload.uploadFiles
      const icono_file = this.$refs.uploadico.uploadFiles
      const formData = new FormData()
      if (icono_file.length == 0) {
        formData.append('icono', this.ico_name)
      } else

      if (icono_file[0].status == 'ready') {
        formData.append('iconofile', icono_file[0].raw)
      } else {
        formData.append('icono', icono_file[0].name)
      }
      // form data
      formData.append('file', file[0].raw)
      formData.append('DocPadre', this.$root.$refs.Browser.actualCarpeta)
      formData.append('titulo', this.ruleForm.titulo)
      formData.append('privacidad', this.$root.$refs.TabPrivacidad.tabId)
      formData.append('modulo', this.ruleForm.Modulo)
      formData.append('topico', this.ruleForm.Topico)
      formData.append('area', this.ruleForm.Area)
      formData.append('tipo', this.ruleForm.tipoDoc)
      formData.append('ubicacion', this.ruleForm.Ubicacion)
      formData.append('metadato', this.ruleForm.Metadato)
      // send upload request

      await Api.post('/store_file', formData, config)
        .then(function(response) {
          currentObj.success = response.data.success
          // currentObj.filename = "";
          currentObj.status = response.statusText
        })
        .catch(function(error) {
          currentObj.output = error
          console.log(error)
        })
      if (currentObj.status === 'OK') {
        // Proceso de Auditoria metodo
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se creó Archivo con titulo ->' + this.ruleForm.titulo)
        formAut.append('evento', 'CrearArchivo()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.vaciarModalArchivo()
        this.$root.$refs.Browser.refreshAll()
        this.$message.success(currentObj.success)

        return this.dialogVisible = false
      } else if (currentObj.output) {
        console.log(currentObj.output.response.data.errors)
        this.$message.warning(currentObj.output.response.data.errors)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const file = this.$refs.upload.uploadFiles
          const icono_file = this.$refs.uploadico.uploadFiles

          if (file.length > 0) {
            if (this.ico_name != '' || icono_file.length > 0) {
              // alert('submit!');

              this.crearArchivo()
            } else {
              this.$message.warning('Falta subir archivos validos')
              return false
            }
          } else {
            this.$message.warning('Falta subir archivos validos')
            return false
          }
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    },
    async editarArchivos() {
      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      const file = this.$refs.upload.uploadFiles
      const icono_file = this.$refs.uploadico.uploadFiles
      const formData = new FormData()

      if (file[0].raw) {
        formData.append('file', file[0].raw)
      } else {
        formData.append('file_name', file[0].name)
      }
      if (icono_file.length == 0) {
        formData.append('icono', this.ico_name)
      } else

      if (icono_file[0].status == 'ready') {
        formData.append('iconofile', icono_file[0].raw)
      } else {
        formData.append('icono', icono_file[0].name)
      }

      // form data
      formData.append('DocPadre', this.$root.$refs.Browser.actualCarpeta)
      formData.append('titulo', this.ruleForm.titulo)
      formData.append('privacidad', this.ruleForm.privacidad)
      formData.append('modulo', this.ruleForm.Modulo)
      formData.append('topico', this.ruleForm.Topico)
      formData.append('area', this.ruleForm.Area)
      formData.append('tipo', this.ruleForm.tipoDoc)
      formData.append('ubicacion', this.ruleForm.Ubicacion)
      formData.append('metadato', this.ruleForm.Metadato)
      formData.append('docId', this.docId)
      formData.append('docDetId', this.docDetId)
      // send upload request

      await Api.post('/editarArchivo', formData, config)
        .then(function(response) {
          currentObj.success = response.data.success
          currentObj.status = response.statusText
        })
        .catch(function(error) {
          currentObj.output = error
          console.log(error)
        })
      if (currentObj.status === 'OK') {
        this.vaciarModalArchivo()
        this.$root.$refs.Browser.refreshAll()
        this.$message.success(currentObj.success)

        return this.dialogVisible = false
      } else if (currentObj.output) {
        console.log(currentObj.output.response.data.error)
        this.$message.warning(currentObj.output.response.data.error)
      }
    },
    submitEditar(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const file = this.$refs.upload.uploadFiles
          const icono_file = this.$refs.uploadico.uploadFiles

          if (file.length > 0) {
            if (this.ico_name != '' || icono_file.length > 0) {
              this.editarArchivos()
            } else {
              this.$message.warning('Falta subir archivos validos')
              return false
            }
          } else {
            this.$message.warning('Falta subir archivos validos')
            return false
          }
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    },
    vaciarModalArchivo() {
      const form = this.$refs.ruleForm
      const selecIcono = this.$refs.selectIcono
      if (this.$refs.upload != null) {
        this.$refs.upload.clearFiles()
      }
      if (this.$refs.uploadico != null) {
        this.$refs.uploadico.clearFiles()
      }
      if (selecIcono === undefined) {
      } else if (selecIcono != null || selecIcono != '') {
        this.$refs.selectIcono.removeFromSingleSelected()
      }
      this.ruleForm.titulo = ''
      //  this.ruleForm.DocPadre='';
      this.ruleForm.tipoDoc = ''
      this.ruleForm.Area = ''
      this.ruleForm.privacidad = ''
      this.ruleForm.Modulo = ''
      this.ruleForm.Topico = ''
      this.ruleForm.Ubicacion = []
      this.ruleForm.Metadato = []
      this.ico_name = ''
      if (form != undefined) {
        this.resetForm()
      }
    },
    CancelarModal() {
      this.vaciarModalArchivo()
      this.dialogVisible = false
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      Api.get('/deletefile/' + file.raw.name).then(res => {
        this.$message.warning(`El archivo ha sido removido correctamente`)
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSucces(response, file, fileList) {
      //  console.log(response)

      this.$message.success(`Archivo Cargado correctamente`)
      // return this.dialogVisible = false
    },
    handleExceed(files, fileList) {
      this.$message.warning(`El límite es de un solo archivo intentas seleccionar ${files.length} archivo esta vez`)
    },
    handleChange(file) {
      //    if(this.$refs.selectIcono.singleSelected.id != null && this.$refs.selectIcono.singleSelected.id != ""){
      // this.$refs.selectIcono.removeFromSingleSelected();
      // }
      this.beforeUpload(file)
    },
    beforeUpload(file) {
      const isPNG = file.raw.type === 'image/png'
      const isJPG = file.raw.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      // console.log(this.$refs.selectIcono)
      const filea = this.$refs.uploadico

      // const bnd= true;

      if (!isJPG && !isPNG) {
        this.$message.error('La imagen debe estar en formato PNG / JPG!')
        // this.$refs.uploadico.uploadFiles.clearFiles();
      }
      // if (!isPNG) {
      //   this.$message.error('La imagen debe estar en formato PNG!');
      // }
      if (!isLt2M) {
        this.$message.error('La imagen excede los 2MB!')
        // this.$refs.uploadico.uploadFiles.clearFiles();
      }

      return isPNG && isLt2M
    },
    bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes == 0) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    },
    async beforeUploadFile(file, fileList) {
      const currentObj = this
      const fileType = file.raw.type
      const isLt2M = file.size
      let bool = false
      const ext = []
      let split
      await Api.get('/getCatTipoAdjunto').then(res => {
        currentObj.data = res.data
        for (var i = 0; i < currentObj.data.length; i++) {
          split = currentObj.data[i].extension.split('.')
          ext.push(split[1])
          if (currentObj.data[i].mimeType == fileType) {
            if (isLt2M >= currentObj.data[i].tamanioPermitido) {
              this.$message.error('El archivo supera el peso maximo admitido para este formato es: ' + this.bytesToSize(currentObj.data[i].tamanioPermitido))
              fileList.pop()
            }
            bool = true
          }
        }
        if (!bool) {
          this.$message.error('El archivo debe contener los siguientes formatos ' + ext)
          fileList.pop()
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    changeUbicacion(e){

      var array=[]
      console.log(e)
    if(e.find(element => element =="Todos")) {

      for(var i=0;i<this.dataCatUbicacion.length;i++){
          array.push(this.dataCatUbicacion[i].ubicacionId)
      }
      this.ruleForm.Ubicacion=array

      }else{
        this.ruleForm.Ubicacion.push[e];
      }
    }
  }
}
</script>

<style lang="scss">
  .el-select{
    width: 100%;
  }
  .vue-select-image__img{
    height: 55px !important;
  }
  .vue-select-image__item {
    margin-left: 20px;
}
</style>
