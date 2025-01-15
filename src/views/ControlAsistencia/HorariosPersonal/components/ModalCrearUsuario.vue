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
          <el-form-item label="Fecha Inicio:" prop="FechaInicio">
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
            <el-input
              type="textarea"
              :rows="3"
              placeholder="En caso de contar con una situación especial en el horarioa soliciar"
              v-model="ruleForm.Comentarios">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Jornada:" prop="arrJornada">
        <!-- <div style="" /> -->
        <!-- <el-checkbox-group v-model="ruleForm.arrJornada" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :key="city" :label="city">{{ city }}</el-checkbox>
        </el-checkbox-group> -->

        <el-checkbox-group v-model="ruleForm.arrJornada" @change="handleCheckedCitiesChange">
          <el-checkbox-button v-for="(city,key) in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
        </el-checkbox-group>

        <br>
      </el-form-item>

      <el-row type="flex" border>
        <el-col :sm="24" :md="3"  style="margin-right:3px;">
          <el-card v-if="vLunes">
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
        </el-col>
        <el-col :sm="24" :md="3"  style="margin-right:3px;">
          <el-card v-if="vMartes" >
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
        </el-col>
        <el-col :sm="24" :md="3"  style="margin-right:3px;">
          <el-card v-if="vMiercoles" >
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
        </el-col>
        <el-col :sm="24" :md="3"  style="margin-right:3px;">
          <el-card v-if="vJueves">
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
        </el-col>
        <el-col :sm="24" :md="3"  style="margin-right:3px;">
          <el-card v-if="vViernes">
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
        </el-col>
        <el-col :sm="24" :md="3"  style="margin-right:3px;">
          <el-card v-if="vSabado">
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
        </el-col>
        <el-col :sm="24" :md="3"  style="margin-right:3px;"></el-col>
          <el-card v-if="vDomingo">
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
        </el-col>

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
import moment from 'moment'

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
        FechaInicio: '',
        Idtime: 0,

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
      this.ruleForm.userAd='';
      this.ruleForm.Comentarios='';
      this.ruleForm.arrJornada=[];
      this.ruleForm.FechaInicio='';
      this.btnloading = false;

      this.vLunes = false;
      this.vMartes = false;
      this.vMiercoles = false;
      this.vJueves = false;
      this.vViernes = false;
      this.vSabado = false;
      this.vDomingo = false;
      this.LunesEntrada = '';
      this.LunesComida1 = '';
      this.LunesComida2 = '';
      this.LunesSalida = '';
      this.MartesEntrada = '';
      this.MartesComida1 = '';
      this.MartesComida2 = '';
      this.MartesSalida = '';
      this.MiercolesEntrada = '';
      this.MiercolesComida1 = '';
      this.MiercolesComida2 = '';
      this.MiercolesSalida = '';
      this.JuevesEntrada = '';
      this.JuevesComida1 = '';
      this.JuevesComida2 = '';
      this.JuevesSalida = '';
      this.ViernesEntrada = '';
      this.ViernesComida1 = '';
      this.ViernesComida2 = '';
      this.ViernesSalida = '';
      this.SabadoEntrada = '';
      this.SabadoComida1 = '';
      this.SabadoComida2 = '';
      this.SabadoSalida = '';
      this.DomingoEntrada = '';
      this.DomingoComida1 = '';
      this.DomingoComida2 = '';
      this.DomingoSalida = '';


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
      if(this.ruleForm.Idtime > 0){
        formData.append('Idtime', this.ruleForm.Idtime)
      }else{
        formData.append('Idtime', 0)
      }
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
    },

    assignScheduleReject(_schedule_reject){

      this.ruleForm.userAd = _schedule_reject.personal_intelisis_usuario_ad;
      this.ruleForm.FechaInicio = moment().format('yyyy-MM-DD')
      this.ruleForm.Comentarios = _schedule_reject.special_situation;  
      this.ruleForm.Idtime = _schedule_reject.Idtime;  
      this.ruleForm.arrJornada = [];

      if(_schedule_reject.lunes && _schedule_reject.lunes.length > 0){
        this.vLunes = true;
        this.ruleForm.arrJornada.push("Lunes");
        this.LunesEntrada = _schedule_reject.lunes[0].entrada;
        this.LunesComida1 = _schedule_reject.lunes[0].comida1;
        this.LunesComida2 = _schedule_reject.lunes[0].comida2;
        this.LunesSalida = _schedule_reject.lunes[0].salida;

      }

      if(_schedule_reject.martes && _schedule_reject.martes.length > 0){
        this.vMartes = true;
        this.ruleForm.arrJornada.push("Martes");
        this.MartesEntrada = _schedule_reject.martes[0].entrada;
        this.MartesComida1 = _schedule_reject.martes[0].comida1;
        this.MartesComida2 = _schedule_reject.martes[0].comida2;
        this.MartesSalida = _schedule_reject.martes[0].salida;

      }

      if(_schedule_reject.miercoles && _schedule_reject.miercoles.length > 0){
        this.vMiercoles = true;
        this.ruleForm.arrJornada.push("Miercoles");
        this.MiercolesEntrada = _schedule_reject.miercoles[0].entrada;
        this.MiercolesComida1 = _schedule_reject.miercoles[0].comida1;
        this.MiercolesComida2 = _schedule_reject.miercoles[0].comida2;
        this.MiercolesSalida = _schedule_reject.miercoles[0].salida;
        
      }

      if(_schedule_reject.jueves && _schedule_reject.jueves.length > 0){
        this.vJueves = true;
        this.ruleForm.arrJornada.push("Jueves");
        this.JuevesEntrada = _schedule_reject.jueves[0].entrada;
        this.JuevesComida1 = _schedule_reject.jueves[0].comida1;
        this.JuevesComida2 = _schedule_reject.jueves[0].comida2;
        this.JuevesSalida = _schedule_reject.jueves[0].salida;
        
      }

      if(_schedule_reject.viernes && _schedule_reject.viernes.length > 0){
        this.vViernes = true;
        this.ruleForm.arrJornada.push("Viernes");
        this.ViernesEntrada = _schedule_reject.viernes[0].entrada;
        this.ViernesComida1 = _schedule_reject.viernes[0].comida1;
        this.ViernesComida2 = _schedule_reject.viernes[0].comida2;
        this.ViernesSalida = _schedule_reject.viernes[0].salida;
        
      }

      if(_schedule_reject.sabado && _schedule_reject.sabado.length > 0){
        this.vSabado = true;
        this.ruleForm.arrJornada.push("Sabado");
        this.SabadoEntrada = _schedule_reject.sabado[0].entrada;
        this.SabadoComida1 = _schedule_reject.sabado[0].comida1;
        this.SabadoComida2 = _schedule_reject.sabado[0].comida2;
        this.SabadoSalida = _schedule_reject.sabado[0].salida;
        
      }
      
      if(_schedule_reject.domingo && _schedule_reject.domingo.length > 0){
        this.vDomingo = true;
        this.ruleForm.arrJornada.push("Domingo");
        this.DomingoEntrada = _schedule_reject.domingo[0].entrada;
        this.DomingoComida1 = _schedule_reject.domingo[0].comida1;
        this.DomingoComida2 = _schedule_reject.domingo[0].comida2;
        this.DomingoSalida = _schedule_reject.domingo[0].salida;
        
      }



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
