
<template>
  <el-dialog v-if="dialogfolderVisible" width="40%" center :visible.sync="dialogfolderVisible" :title="dialogType==='edit'?'Editar Carpeta':'Crear Nueva Carpeta'">

    <el-form ref="FolderForm" :model="FolderForm" :rules="rules" label-width="200px" label-position="left" enctype="multipart/form-data">

      <el-form-item label="Titulo Carpeta" prop="titulo">
        <el-input v-model="FolderForm.titulo" clearable placeholder="" />
      </el-form-item>

    </el-form><br>

    <div style="text-align:right;">
      <el-button type="danger" @click="dialogfolderVisible=false">Cancelar</el-button>
      <el-button v-if="dialogType==='edit'" :loading="btnloading" type="primary" @click="submitEditar('FolderForm')">Editar Carpeta <i class="el-icon-upload el-icon-right" /></el-button>
      <el-button v-if="dialogType==='new'" :loading="btnloading" type="success" @click="validateForm('FolderForm')">Crear Carpeta <i class="el-icon-upload el-icon-right" /></el-button>
    </div>
  </el-dialog>

</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
export default {

  data() {
    var validate = (rule, value, callback) => {
      if (value.trim() == '') {
        return callback(new Error('Por favor Ingresa titulo carpeta '))
      } else {
        callback()
      }
    }
    return {
      dataDocPadre: [],
      dialogfolderVisible: false,
      DocPadre: '',
      btnloading: false,
      dialogType: 'new',
      docId: '',
      FolderForm: {
        titulo: ''
      },
      rules: {
        titulo: [
          { required: true, message: 'Por favor Ingresa titulo Carpeta', trigger: 'blur', validator: validate }
        ]
      }
    }
  },
  created() {
    this.$root.$refs.ModalFolder = this
  },

  methods: {
    async submitForm() {
      this.btnloading = true
      const currentObj = this
      if (this.DocPadre == '') {
        this.DocPadre = 0
      }
      // form data
      const formData = new FormData()
      formData.append('titulo', this.FolderForm.titulo)
      formData.append('DocPadre', this.$root.$refs.Browser.actualCarpeta)

      await Api.post('/crear_carpeta', formData)
        .then(function(response) {
          currentObj.success = response.data.success
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
        formAut.append('comentarios', 'Se creó Carpeta con titulo ->' + this.FolderForm.titulo)
        formAut.append('evento', 'CrearCarpeta()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.FolderForm.titulo = ''
        this.btnloading = false

        this.$root.$refs.Browser.refreshAll()
        this.$message.success(currentObj.success)
        return this.dialogfolderVisible = false
      }
    },
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitForm()
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    },

    async editarCarpeta() {
      this.btnloading = true
      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      const formData = new FormData()

      // form data
      formData.append('titulo', this.FolderForm.titulo)
      formData.append('docId', this.docId)
      // send upload request

      await Api.post('/editarCarpeta', formData, config)
        .then(function(response) {
          currentObj.success = response.data.success
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
        formAut.append('comentarios', 'Edito esta Carpeta con ID ->' + this.docId + ' Y titulo ' + this.FolderForm.titulo)
        formAut.append('evento', 'editarCarpeta()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.vaciarModalFolder()
        this.$root.$refs.Browser.refreshAll()
        this.$message.success(currentObj.success)
        this.btnloading = false
        return this.dialogfolderVisible = false
      } else if (currentObj.output) {
        console.log(currentObj.output.response.data.error)
        this.$message.warning(currentObj.output.response.data.error)
      }
    },
    submitEditar(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editarCarpeta()
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    },
    vaciarModalFolder() {
      this.FolderForm.titulo = ''
    },
    resetForm() {
      this.$refs.FolderForm.resetFields()
    }
  }
}
</script>
