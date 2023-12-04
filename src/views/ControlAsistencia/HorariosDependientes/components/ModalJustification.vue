<template>
  <el-dialog :key="renderKey" width="50vw" :visible.sync="dialogVisible" center top="5vh" :title="dialogType==='edit'?'Detalles Justificacion Empleado':'Crear Justificación Empleado'">
    <el-form ref="ruleForm" :model="ruleForm" label-width="145px" :rules="rules" label-position="left" :disabled="isDisabled">
      <el-form-item label="Nombre" prop="userAd">

        <el-select v-model="ruleForm.userAd" filterable placeholder="Selecciona Nombre Empleado:" clearable>
          <el-option
            v-for="item in StaffAttendance"
            :label="item.name + ' ' +item.last_name "
            :value="item.usuario_ad"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Tipo Justificación" prop="typeJus">

        <el-select v-model="ruleForm.typeJus" filterable placeholder="Selecciona tipo de justificación:" clearable>
          <el-option
            v-for="item in typeJustificationsActive" 
            :label="item.description"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Descripción:" prop="Comentarios">
        <el-input
          v-model="ruleForm.Comentarios"
          type="textarea"
          maxlength="250"
          show-word-limit
          :rows="4"
          resize="none"
          clearable
        />
      </el-form-item>

      <el-form-item label="Fecha:" prop="FechaInicio">
        <el-date-picker
          v-model="ruleForm.FechaInicio"
          type="date"
          placeholder="Fecha"
          format="dd-MM-yyyy"
          value-format="dd-MM-yyyy"
        />
      </el-form-item>
      <!-- <el-form-item label="Archivo Evidencia:">-->
      <el-upload
        id="inputFileUpload"
        ref="upload"
        v-model="filename"
        class="upload-demo"
        action="#"
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
      </el-upload>
      <!--</el-form-item>-->
    </el-form>

    <br>
    <div style="text-align:right;">
      <el-button type="danger" @click="dialogVisible=false">Salir</el-button>
      <el-button v-if="dialogType=='new'" :loading="btnloading" type="primary" @click="confirmJustification('ruleForm')">Confirmar</el-button>

    </div>
  </el-dialog>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
// import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
export default {

  data() {
    var validate = (rule, value, callback) => {
      if (value == '' || value == null) {
        return callback(new Error('Por favor Ingresa titulo'))
      } else {
        return callback()
      }
    }
    var ValidateCheck = (rule, value, callback) => {
      if (value.length == 0) {
        return callback(new Error('Por favor Ingresa jornada'))
      } else {
        return callback()
      }
    }

    var ValidateDate = (rule, value, callback) => {
      if (value == '' || value == null) {
        return callback(new Error('Por favor Ingresa fecha'))
      } else {
        return callback()
      }
    }
    return {
      renderKey: 0,
      ruleForm: {
        userAd: '',
        typeJus: '',
        Comentarios: '',
        FechaInicio: ''
      },
      fileList: [],
      filename: [],

      rules: {
        userAd: [
          { required: true, message: 'Por favor Ingresa el Nombre de Empleado', trigger: 'change', validator: validate }
        ],
        typeJus: [
          { required: true, message: 'Por favor Ingresa el tipo de justificación', trigger: 'change', validator: validate }
        ],
        Comentarios: [
          { required: true, message: 'Por favor Ingresa Descripcion', trigger: 'blur', validator: validate }
        ],
        FechaInicio: [
          { required: true, message: 'Por favor Ingresa la Fecha de Inicio', trigger: 'blur', validator: ValidateDate }
        ]

      },
      dialogVisible: false,
      dialogType: 'new',
      btnloading: false,
      isDisabled:false,

    }
  },

  

  beforeMount() {
    this.$root.$refs.ModalJustification = this
  },
  created() {
    try {
       this.$store.dispatch('getTypeJustificationActive')
      this.$store.dispatch('getCommading_staff_att');
    } catch (error) {
      console.error(error)
    }
  },
  computed: {
    ...mapGetters([
      'StaffAttendance',
      'typeJustificationsActive'
    ])
        // TypeJustifications() {
    //   return this.$store.getters.
    // }
  },
  methods: {
  

    async confirmJustification(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'

          if (isEdit) {
            // this.editarUsuario();
          } else {
            this.addJustification(this.ruleForm)
          }
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    },
    async addJustification() {
      this.btnloading = true
      const currentObj = this
      const file = this.$refs.upload.uploadFiles
      const formData = new FormData()
      formData.append('user', this.ruleForm.userAd)
      formData.append('description', this.ruleForm.Comentarios)
      formData.append('date', this.ruleForm.FechaInicio)
      formData.append('type_id', this.ruleForm.typeJus)
      if (file != '') {
        formData.append('file', file[0].raw)
      }
      this.$store.dispatch('addJustification', formData).then(res => {
        this.$message({
          message: res.data.success,
          type: 'success'
        })
        this.btnloading = false
        this.$refs['ruleForm'].resetFields()
        this.$refs.upload.clearFiles()

         const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se agrego nueva justificación ->' + this.ruleForm.userAd + ' description:' + this.ruleForm.Comentarios)
        formAut.append('evento', 'addJustification()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
      }).catch(error => {
        this.$message({
          message: error,
          type: 'error'
        })
        this.btnloading = false
      })

      this.btnloading = false
      // if (currentObj.status === 200) {
      // //   const formAut = new FormData()
      // //   formAut.append('name_view', this.$route.name)
      // //   formAut.append('comentarios', 'Creo un nuevo usuario->' + this.ruleForm.usuario)
      // //   formAut.append('evento', 'addUsuario()')

      // //   this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      //       this.btnloading = false
      //       this.dialogVisible = false;
      // }
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
    handlePreview(file) {
     window.open(file.url, '_blank');
    },
    handleRemove(file, fileList) {
      Api.get('/deletefile/' + file.raw.name).then(res => {
        this.$message.warning(`El archivo ha sido removido correctamente`)
      })
    },
    handleSucces(response, file, fileList) {
      this.$message.success(`Archivo Cargado correctamente`)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`El límite es de un solo archivo intentas seleccionar ${files.length} archivo esta vez`)
    },
    handleChange(file) {
      this.beforeUpload(file)
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
