<template>
  <el-dialog :key="renderKey" width="95vw" :visible.sync="dialogVisible" center top="5vh" :title="dialogType==='edit'?'Editar Horario Personal':'Nuevo Horario Personal'">
    <el-form ref="ruleForm" :model="ruleForm" label-width="150px" :rules="rules" label-position="left">
      <el-form-item label="Nombre Empleado" prop="userAd">

        <el-select v-model="ruleForm.userAd" filterable placeholder="Selecciona:" clearable>
          <el-option
            v-for="item in objPersonal"
            :key="item.personal_id"
            :label="item.name + ' ' +item.last_name "
            :value="item.usuario_ad"
          />
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="9">
          <el-form-item label="Vigencia:" prop="FechaInicio">
            <el-date-picker
              v-model="ruleForm.FechaInicio"
              type="date"
              placeholder="Fecha Inicio"
              format="dd-MM-yyyy"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="Comentarios:">
            <el-input v-model="ruleForm.Comentarios" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Jornada:" prop="arrJornada">
        <div style="" />
        <el-checkbox-group v-model="ruleForm.arrJornada" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :key="city" :label="city">{{ city }}</el-checkbox>
        </el-checkbox-group>
        <br>
      </el-form-item>

      <el-row :gutter="10" border>
        <el-card v-if="vLunes" class="box-card d-inline-block">
          <div slot="header" class="clearfix ">
            <span>LUNES</span>
          </div>
          <div>
            Hora Entrada:
            <el-time-picker
              v-model="LunesEntrada"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Entrada"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 1:
            <el-time-picker
              v-model="LunesComida1"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 1"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 2:
            <el-time-picker
              v-model="LunesComida2"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 2"
              size="small"
              value-format="HH:mm"
            />
            Hora Salida:
            <el-time-picker
              v-model="LunesSalida"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Salida"
              size="small"
              value-format="HH:mm"
            />
          </div>
        </el-card>
        <el-card v-if="vMartes" class="box-card d-inline-block">
          <div slot="header" class="clearfix">
            <span>MARTES</span>
          </div>
          <div>
            Hora Entrada:
            <el-time-picker
              v-model="MartesEntrada"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Entrada"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 1:
            <el-time-picker
              v-model="MartesComida1"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 1"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 2:
            <el-time-picker
              v-model="MartesComida2"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 2"
              size="small"
              value-format="HH:mm"
            />
            Hora Salida:
            <el-time-picker
              v-model="MartesSalida"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Salida"
              size="small"
              value-format="HH:mm"
            />
          </div>
        </el-card>
        <el-card v-if="vMiercoles" class="box-card d-inline-block">
          <div slot="header" class="clearfix">
            <span>MIERCOLES</span>
          </div>
          <div>
            Hora Entrada:
            <el-time-picker
              v-model="MiercolesEntrada"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Entrada"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 1:
            <el-time-picker
              v-model="MiercolesComida1"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 1"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 2:
            <el-time-picker
              v-model="MiercolesComida2"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 2"
              size="small"
              value-format="HH:mm"
            />
            Hora Salida:
            <el-time-picker
              v-model="MiercolesSalida"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Salida"
              size="small"
              value-format="HH:mm"
            />
          </div>
        </el-card>
        <el-card v-if="vJueves" class="box-card d-inline-block">
          <div slot="header" class="clearfix">
            <span>JUEVES</span>
          </div>
          <div>
            Hora Entrada:
            <el-time-picker
              v-model="JuevesEntrada"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Entrada"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 1:
            <el-time-picker
              v-model="JuevesComida1"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 1"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 2:
            <el-time-picker
              v-model="JuevesComida2"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 2"
              size="small"
              value-format="HH:mm"
            />
            Hora Salida:
            <el-time-picker
              v-model="JuevesSalida"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Salida"
              size="small"
              value-format="HH:mm"
            />
          </div>
        </el-card>
        <el-card v-if="vViernes" class="box-card d-inline-block">
          <div slot="header" class="clearfix">
            <span>VIERNES</span>
          </div>
          <div>
            Hora Entrada:
            <el-time-picker
              v-model="ViernesEntrada"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Entrada"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 1:
            <el-time-picker
              v-model="ViernesComida1"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 1"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 2:
            <el-time-picker
              v-model="ViernesComida2"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 2"
              size="small"
              value-format="HH:mm"
            />
            Hora Salida:
            <el-time-picker
              v-model="ViernesSalida"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Salida"
              size="small"
              value-format="HH:mm"
            />
          </div>
        </el-card>
        <el-card v-if="vSabado" class="box-card d-inline-block">
          <div slot="header" class="clearfix">
            <span>SABADO</span>
          </div>
          <div>
            Hora Entrada:
            <el-time-picker
              v-model="SabadoEntrada"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Entrada"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 1:
            <el-time-picker
              v-model="SabadoComida1"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 1"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 2:
            <el-time-picker
              v-model="SabadoComida2"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 2"
              size="small"
              value-format="HH:mm"
            />
            Hora Salida:
            <el-time-picker
              v-model="SabadoSalida"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Salida"
              size="small"
              value-format="HH:mm"
            />
          </div>
        </el-card>

        <el-card v-if="vDomingo" class="box-card d-inline-block">
          <div slot="header" class="clearfix">
            <span>DOMINGO</span>
          </div>
          <div>
            Hora Entrada:
            <el-time-picker
              v-model="DomingoEntrada"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Entrada"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 1:
            <el-time-picker
              v-model="DomingoComida1"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 1"
              size="small"
              value-format="HH:mm"
            />
            Hora Comida 2:
            <el-time-picker
              v-model="DomingoComida2"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Comida 2"
              size="small"
              value-format="HH:mm"
            />
            Hora Salida:
            <el-time-picker
              v-model="DomingoSalida"
              format="HH:mm"
              style="width:100%"
              placeholder="Hora Salida"
              size="small"
              value-format="HH:mm"
            />
          </div>
        </el-card>

      </el-row>
    </el-form>
    <br>
    <div style="text-align:right;">
      <el-button type="danger" @click="dialogVisible=false;ClearModal()">Cancelar</el-button>
      <el-button :loading="btnloading" type="primary" @click="confirmUsuario('ruleForm')">Confirmar</el-button>

    </div>
  </el-dialog>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {

  data() {
    var validate = (rule, value, callback) => {
      if (value.trim() == '') {
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
    const cityOptions = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
    return {
      renderKey: 0,
      checkAll: false,

      cities: cityOptions,
      vLunes: false,
      vMartes: false,
      vMiercoles: false,
      vJueves: false,
      vViernes: false,
      vSabado: false,
      vDomingo: false,
      LunesEntrada: '',
      LunesComida1: '',
      LunesComida2: '',
      LunesSalida: '',
      MartesEntrada: '',
      MartesComida1: '',
      MartesComida2: '',
      MartesSalida: '',
      MiercolesEntrada: '',
      MiercolesComida1: '',
      MiercolesComida2: '',
      MiercolesSalida: '',
      JuevesEntrada: '',
      JuevesComida1: '',
      JuevesComida2: '',
      JuevesSalida: '',
      ViernesEntrada: '',
      ViernesComida1: '',
      ViernesComida2: '',
      ViernesSalida: '',
      SabadoEntrada: '',
      SabadoComida1: '',
      SabadoComida2: '',
      SabadoSalida: '',
      DomingoEntrada: '',
      DomingoComida1: '',
      DomingoComida2: '',
      DomingoSalida: '',
      objPersonal: [],
      ruleForm: {
        userAd: '',
        Comentarios: '',
        arrJornada: [],
        FechaInicio: ''

      },
      rules: {
        userAd: [
          { required: true, message: 'Por favor Ingresa el Nombre de Empleado', trigger: 'change', validator: validate }
        ],
        Comentarios: [
          { required: true, message: 'Por favor Ingresa el Apellido Paterno', trigger: 'blur', validator: validate }
        ],
        FechaInicio: [
          { required: true, message: 'Por favor Ingresa la Fecha de Inicio', trigger: 'change', validator: ValidateDate }
        ],
        arrJornada: [
          { required: true, message: 'Por favor Ingresa Jornada', trigger: 'change', validator: ValidateCheck }
        ]
      },
      dialogVisible: false,
      dialogType: 'new',
      btnloading: false

    }
  },

  beforeMount() {
    this.$root.$refs.ModalCrearUsuario = this
  },
  created() {
    // this.getPersonalIntelisis();
  },
  methods: {
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.vLunes = false
      this.vMartes = false
      this.vMiercoles = false
      this.vJueves = false
      this.vViernes = false
      this.vSabado = false
      this.vDomingo = false

      value.forEach(row => {
        if (row == 'Lunes') {
          this.vLunes = !this.vLunes
        } else if (row == 'Martes') {
          this.vMartes = !this.vMartes
        } else if (row == 'Miercoles') {
          this.vMiercoles = !this.vMiercoles
        } else if (row == 'Jueves') {
          this.vJueves = !this.vJueves
        } else if (row == 'Viernes') {
          this.vViernes = !this.vViernes
        } else if (row == 'Sabado') {
          this.vSabado = !this.vSabado
        } else if (row == 'Domingo') {
          this.vDomingo = !this.vDomingo
        }
      })
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },

    async getPersonalIntelisis() {
      const currentObj = this
      await Api.get('/controlAsistencia/getPersonalIntelisis').then(res => {
        currentObj.data = res.data
        this.objPersonal = res.data

      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    },
    ClearModal() {

    },

    handleAddRole() {
      this.ClearModal()
      this.getSubsecciones()
      this.getTipoPermisos()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.methodThatForcesUpdate()
      this.ClearModal()
      this.getSubsecciones()
      this.getTipoPermisos()
      this.getSubseccionesUsuario(scope)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.usuarioId = scope.row.usuarioId
      this.ruleForm = deepClone(scope.row)
    },

    async confirmUsuario(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'

          if (isEdit) {
            // this.editarUsuario();
          } else {
            this.addHorario()
          }
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    },
    async addHorario() {
      this.btnloading = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('user', this.ruleForm.userAd)
      formData.append('jornada', this.ruleForm.arrJornada)
      formData.append('comentarios', this.ruleForm.Comentarios)
      formData.append('vigencia', this.ruleForm.FechaInicio)
      formData.append('LunesEntrada', this.LunesEntrada)
      formData.append('LunesComida1', this.LunesComida1)
      formData.append('LunesComida2', this.LunesComida2)
      formData.append('LunesSalida', this.LunesSalida)
      formData.append('MartesEntrada', this.MartesEntrada)
      formData.append('MartesComida1', this.MartesComida1)
      formData.append('MartesComida2', this.MartesComida2)
      formData.append('MartesSalida', this.MartesSalida)
      formData.append('MiercolesEntrada', this.MiercolesEntrada)
      formData.append('MiercolesComida1', this.MiercolesComida1)
      formData.append('MiercolesComida2', this.MiercolesComida2)
      formData.append('MiercolesSalida', this.MiercolesSalida)
      formData.append('JuevesEntrada', this.JuevesEntrada)
      formData.append('JuevesComida1', this.JuevesComida1)
      formData.append('JuevesComida2', this.JuevesComida2)
      formData.append('JuevesSalida', this.JuevesSalida)
      formData.append('ViernesEntrada', this.ViernesEntrada)
      formData.append('ViernesComida1', this.ViernesComida1)
      formData.append('ViernesComida2', this.ViernesComida2)
      formData.append('ViernesSalida', this.ViernesSalida)
      formData.append('SabadoEntrada', this.SabadoEntrada)
      formData.append('SabadoComida1', this.SabadoComida1)
      formData.append('SabadoComida2', this.SabadoComida2)
      formData.append('SabadoSalida', this.SabadoSalida)
      formData.append('DomingoEntrada', this.DomingoEntrada)
      formData.append('DomingoComida1', this.DomingoComida1)
      formData.append('DomingoComida2', this.DomingoComida2)
      formData.append('DomingoSalida', this.DomingoSalida)

      await Api.post('/controlAsistencia/addHorarioPersonal', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se agrego nuevo horario -> Detalles: ' + this.ruleForm.userAd)
        formAut.append('evento', 'addHorario()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$message({
          message: 'Se ha agregado correctamente',
          type: 'success'
        })
    
        this.dialogVisible = false
        this.$root.$refs.ViewHorariosPersonal.getHorariosPersonal()
      }).catch(function(error) {
         this.$message({
          message: 'Ocurrio un error en el proceso',
          type: 'error'
        })
      })
    this.btnloading = false
    },
   
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}

.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .table-border{
    border-style:solid;
  }

  .box-card {
    width: 13vw;
  }
</style>
