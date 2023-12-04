<template>
  <div class="app-container">
    <md-content class="p-3">
      <div class="nine">
        <h1>Consulta Horarios<span>Mi Personal</span></h1>
      </div>

      <div class="filter-container" style="margin-left: 25%;">
        <el-form ref="formRep" label-position="left" label-width="100px" :rules="rules" :model="formRep">
        <el-container>
        <el-form-item label="" prop="FechaReporte">

        <span class="demonstration">Generar Reporte del </span>
        <el-date-picker
          v-model="formRep.FechaReporte"
          type="week"
          range-separator="al"
          start-placeholder="Fecha Inicio"
          end-placeholder="Fecha Final"
          format="Week WW"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        />
    </el-form-item>

        <el-button class="filter-item" :loading="isloading" style="margin-left: 20px;" type="primary"
        icon="el-icon-s-comment" plain @click="confirmReporte('formRep')">Generar Reporte</el-button>
 </el-container>
 </el-form>
      </div>
      <div class="filter-container">
        <el-input v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
        <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-s-claim" plain @click="handleJustification">Justificar</el-button>
        <el-tag type="success" effect="dark" style="margin-left: 10%">Puntualidad</el-tag>
        <el-tag type="info" effect="dark" style="margin-left: 15px">Tolerancia</el-tag>
        <el-tag type="warning" effect="dark" style="margin-left: 15px">Retardo</el-tag>
        <el-tag type="danger" effect="dark" style="margin-left: 15px">Suspensión</el-tag>
        <el-tag effect="dark" style="margin-left: 15px">Día Justificado</el-tag>
      </div>

      <el-table
        v-loading="listLoading"
        :data="HorariosList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) ||
          (data.last_name && data.last_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1) )"
        style="width: 100%; height:100vh"
        border
        stripe
        :max-height="510"
        :header-row-style="{textAlign: 'center'}"
      >
        <el-table-column fixed header-align="center" align="center" label="No Empleado" width="115">
          <template slot-scope="scope">
            {{ scope.row.personal_id }}
          </template>
        </el-table-column>

        <el-table-column fixed header-align="center" align="justify" label="Nombre" width="255">
          <template slot-scope="scope" class="second">
            {{ scope.row.name +" "+scope.row.last_name }}
          </template>
        </el-table-column>

        <el-table-column label="Ubicación" width="150">
          <template slot-scope="scope">
            {{ scope.row.location }}
          </template>
        </el-table-column>
         <el-table-column label="Horario Base" width="115">
          <template slot-scope="scope">
            {{ scope.row.horariobase }}
          </template>
        </el-table-column>
        <el-table-column header-align="center" label="Fecha" width="90">
          <template slot-scope="scope">
            {{ scope.row.fecha }}
          </template>
        </el-table-column>
        <el-table-column header-align="center" label="Entrada" width="100">
          <template slot-scope="scope">
            {{ scope.row.entrada }}
          </template>
        </el-table-column>
        <el-table-column header-align="center" label="Comidas" width="165">
          <template slot-scope="scope">
            {{ scope.row.comida }}
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="Salida" width="100">
          <template slot-scope="scope">
            {{ scope.row.salida }}
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="Tiempo Trabajo" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.extra=='Completa'" type="success" effect="dark">{{ scope.row.trabajo + " "+scope.row.extra }}</el-tag>
            <el-tag v-if="scope.row.extra=='Incompleta'" type="info" effect="dark">   {{ scope.row.trabajo + " "+scope.row.extra }}</el-tag>
            <el-tag v-if="scope.row.extra=='Extra'" effect="dark">   {{ scope.row.trabajo + " "+scope.row.extra }}</el-tag>
            <el-tag v-if="scope.row.extra=='Suspensión'" type="danger" effect="plain">{{ scope.row.extra }}</el-tag>

          </template>

        </el-table-column>

        <el-table-column header-align="center" align="center" label="Tiempo Comida" width="130">
          <template slot-scope="scope">
            {{ scope.row.timecomida }}

          </template>
        </el-table-column>

        <el-table-column header-align="center" align="center" label="Estatus" width="110" fixed="right">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.estatus=='Puntualidad'" type="success" effect="dark">Puntualidad</el-tag>
            <el-tag v-if="scope.row.estatus=='Tolerancia'" type="info" effect="dark">Tolerancia</el-tag>
            <el-tag v-if="scope.row.estatus=='Retardo'" type="warning" effect="dark">Retardo</el-tag>
            <el-tag v-if="scope.row.estatus=='Suspensión'" type="danger" effect="dark">Suspension</el-tag>
             <el-button size="mini" type="danger" v-if="scope.row.estatus=='Vacaciones' " @click="clickVacation(scope)">{{scope.row.estatus}}<svg-icon icon-class="pdf" /></el-button>
          <el-button size="mini" type="primary" icon='el-icon-document-copy' v-if="scope.row.estatus=='Permiso'" @click="clickPermiso(scope)">{{scope.row.estatus}}</el-button>
          <el-button v-if="scope.row.estatus=='Justificado'" type="primary" size="small" effect="dark" @click="handleDetailJustification(scope)">Justificado</el-button>
          </template>
        </el-table-column>

      </el-table>

    </md-content>
    <ModalJustification ref="ModalJustification" />
  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'
import moment from 'moment'
import ModalJustification from './components/ModalJustification'
export default {
  components: {
    ModalJustification
  },
  data() {
    var ValidateCheck = (rule, value, callback) => {
      if (value.length == 0) {
        return callback(new Error('Por favor Ingresa jornada'))
      } else {
        return callback()
      }
    }
    var validate = (rule, value, callback) => {
      if (value.trim() == '') {
        return callback(new Error('Por favor Ingresa titulo'))
      } else {
        return callback()
      }
    }
    var ValidateDate = (rule, value, callback) => {
      console.log("dv")
      if (value == '' || value == null) {
        return callback(new Error('Por favor Ingresa fecha'))
      } else {
        return callback()
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        firstDayOfWeek: 1
      },
      renderKey: 0,
      arrHorPersonal: [],
      HorariosList: [],
      btnAdd: true,
      timeId: '',
      search: '',
      formRep:{
      FechaReporte:  moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
      },
       rules: {
          FechaReporte: [
              { required: true, message: 'Ingresa fecha reporte', trigger: 'blur', validator: ValidateDate }
            ],
       },
      listLoading: false,
      isloading: false

    }
  },
  computed: {

  },
  beforeMount() {
    this.$root.$refs.AdminUsuarios = this
  },
  created() {
    try {
this.handleGenerateReport();
    } catch (error) {
      console.error(error)
    }
  },
  mounted() {
  },
  methods: {

    handleJustification() {
      this.$root.$refs.ModalJustification.dialogType = 'new'
      this.$root.$refs.ModalJustification.dialogVisible = true
    },
     clickPermiso(file) {
        window.open(file.row.document, '_blank');
    },
       clickVacation(file) {
        window.open(file.row.document, '_blank');
    },
     handleDetailJustification(scope){
      this.$root.$refs.ModalJustification.ruleForm.userAd = scope.row.justification.user
      this.$root.$refs.ModalJustification.ruleForm.typeJus = scope.row.justification.type_id
      this.$root.$refs.ModalJustification.ruleForm.Comentarios = scope.row.justification.description
      this.$root.$refs.ModalJustification.ruleForm.FechaInicio = scope.row.justification.date
      this.$root.$refs.ModalJustification.filename = scope.row.justification.file
      this.$root.$refs.ModalJustification.isDisabled =true;
      this.$root.$refs.ModalJustification.dialogType = 'edit'
      this.$root.$refs.ModalJustification.dialogVisible = true
    },
    confirmReporte(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {
            this.handleGenerateReport()
        } else {
          this.$notify({
          title: 'Información Incompleta',
          message: 'Falta capturar Informacion',
          type: 'warning',
          offset: 50
        });
          // this.$message.warning('')
          return false
        }
      })
    },
    async handleGenerateReport() {
      this.listLoading = true
      this.isloading = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('fechas', this.formRep.FechaReporte)
console.log(this.formRep.FechaReporte)
      await Api.post('/controlAsistencia/getReporteAsistenciaMiPersonal', formData, config).then(res => {
        currentObj.data = res.data
        this.HorariosList = res.data
        this.listLoading = false
        this.isloading = false


        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Genero Reporte de Asistencia -> fechas: ' + this.formRep.FechaReporte)
        formAut.append('evento', 'handleGenerateReportPersonal()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    }

  }
}
</script>

<style scoped>

.box-card {
    width: 11.5vw;
  }
  .form-item {
    bottom: 20px !important;
    margin-bottom: 2px;
}
 .el-form-item__error {
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 40% !important;
    left: 0;
}
/* Style 9
   ----------------------------- */
.nine h1 {
  text-align:center; font-size:40px; text-transform:uppercase; color:#222; letter-spacing:1px;
  font-family:Helvetica,Arial,sans-serif; font-weight:400;
}
.nine h1 span {
  margin-top: 5px;
    font-size:15px; color:#444; word-spacing:1px; font-weight:normal; letter-spacing:2px;
    text-transform: uppercase; font-family:"Raleway", sans-serif; font-weight:500;

    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-template-rows: 27px 0;
    grid-gap: 20px;
    align-items: center;
}

.nine h1 span:after,.nine h1 span:before {
    content: " ";
    display: block;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
    height: 5px;
  background-color:#f8f8f8;
}
</style>
