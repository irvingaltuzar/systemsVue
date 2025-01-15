<template>
  <div class="app-container">
      <div class="filter-container">
   <el-form ref="formRep" label-position="left" label-width="100px" :rules="rules" :model="formRep">
    <el-container>
      <el-form-item label="" prop="FechaReporte">
      <span class="demonstration">Generar Reporte del </span>
      <el-date-picker
        v-model="formRep.FechaReporte"
        type="daterange"
        range-separator="al"
        start-placeholder="Fecha Inicio"
        end-placeholder="Fecha Final"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      ></el-date-picker>
      </el-form-item>
    <el-form-item label="" style="margin-left: -3%;" prop="ubications">
      <el-select
        v-model="formRep.ubications"
        multiple
        collapse-tags
        filterable
        allow-create
        placeholder="Ubicación"
      >
        <el-option
          v-for="item in dataUbications"
          :key="item.ubiccionId"
          :label="item.descripcion"
          :value="item.descripcion"
        />
      </el-select>
        </el-form-item>
      <el-button class="filter-item ml-3" :loading="isloading"  type="primary" icon="el-icon-s-comment" plain @click="confirmReporte('formRep')">Generar Reporte</el-button>
</el-container>
    </el-form>
  </div>
    <div class="filter-container">
      <el-input v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
      <!-- <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-s-claim" plain @click="handleJustification">Justificar</el-button> -->
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-s-claim" plain @click="handleTipoJustification">Tipos Justificación</el-button>
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-date" plain @click="handleDaysOff">Dias Puente</el-button>
      <el-button class="filter-item" :loading="downloadLoading" style="margin-left: 20px;" type="primary" icon="el-icon-document" plain @click="handleDownload"> Export Excel</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="HorariosList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) ||
        (data.deparment && data.deparment.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
        (data.location && data.location.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
        || (data.payment_period && data.payment_period.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
        (data.extra && data.extra.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
        (data.message && data.message.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
        (data.exc && data.exc.toLowerCase().indexOf(this.search.toLowerCase()) > -1))"
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

      <el-table-column fixed header-align="center" label="No Empleado Anterior" width="115">
        <template slot-scope="scope">
          {{ scope.row.previous_personal_id }}
        </template>
      </el-table-column>

      <el-table-column fixed header-align="center" align="justify" label="Nombre" width="220">
        <template slot-scope="scope" class="second">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="Departamento" width="220">
        <template slot-scope="scope">
          {{ scope.row.deparment }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="Ubicación" width="140">
        <template slot-scope="scope">
          {{ scope.row.location }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="Periodo de Pago" width="135">
        <template slot-scope="scope">
          {{ scope.row.payment_period }}
        </template>
      </el-table-column>
      <el-table-column label="Horario Base" width="110">
        <template slot-scope="scope">
          {{ scope.row.horariobase }}
        </template>
      </el-table-column>
        <el-table-column label="Entrada" width="110">
        <template slot-scope="scope">
          {{ scope.row.hourentry }}
        </template>
      </el-table-column>
        <el-table-column label="Salida a Comer" width="130">
        <template slot-scope="scope">
          {{ scope.row.hourfood1 }}
        </template>
      </el-table-column>
        <el-table-column label="Regreso Comida" width="140">
        <template slot-scope="scope">
          {{ scope.row.hourefood2 }}
        </template>
      </el-table-column>
        <el-table-column label="Salida" width="110">
        <template slot-scope="scope">
          {{ scope.row.hourexit }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="Fecha" width="90">
        <template slot-scope="scope">
          {{ scope.row.fecha }}
        </template>
      </el-table-column>
          <el-table-column header-align="center" align="center" label="Status Jornada" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.extra=='Jornada Completa'" type="success" effect="dark">{{ scope.row.extra  }}</el-tag>
          <el-tag v-if="scope.row.extra=='Jornada Incompleta'" type="info" effect="dark">   {{ scope.row.extra }}</el-tag>
         <!-- <el-tag v-if="scope.row.extra=='Extra'" effect="dark">   {{ scope.row.trabajo }}</el-tag>
          <el-tag v-if="scope.row.extra=='Suspensión'" type="danger" effect="plain">{{ scope.row.extra }}</el-tag>-->

        </template>

      </el-table-column>
      <el-table-column header-align="center" label="Entrada" width="100">
        <template slot-scope="scope">
          {{ scope.row.entrada }}
        </template>
      </el-table-column>
    
      <el-table-column header-align="center" align="center" label="Salida" width="100">
        <template slot-scope="scope">
          {{ scope.row.salida }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="Tiempo Oficina" width="140">
        <template slot-scope="scope">
          {{ scope.row.timeoffice }}
        </template>
      </el-table-column>
        <el-table-column header-align="center" label="Comidas" width="150">
        <template slot-scope="scope">
          {{ scope.row.comida }}
        </template>
      </el-table-column>
        <el-table-column header-align="center" align="center" label="Tiempo Comida" width="130">
        <template slot-scope="scope">
          {{ scope.row.timecomida }}

        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="Tiempo Trabajo" width="150" prop="trabajo" />
    
        <!--<el-table-column header-align="center" align="center" label="Dif. Trabajo" width="100">
          <template slot-scope="scope">
            {{ scope.row.diff }}

          </template>
        </el-table-column>-->
      <el-table-column header-align="center" align="center" label="Documento" width="110">
        <template slot-scope="scope">
          <!--<el-tag v-if="scope.row.estatus=='Puntualidad'" type="success" effect="dark">Puntualidad</el-tag>
          <el-tag v-if="scope.row.estatus=='Tolerancia'" type="info" effect="dark">Tolerancia</el-tag>
          <el-tag v-if="scope.row.estatus=='Retardo'" type="warning" effect="dark">Retardo</el-tag>
          <el-tag v-if="scope.row.estatus=='Suspensión'" type="danger" effect="dark">Suspension</el-tag>-->
          <el-button size="mini" type="danger" v-if="scope.row.estatus=='Vacaciones' " @click="clickVacation(scope)">{{scope.row.estatus}}<svg-icon icon-class="pdf" /></el-button>
          <el-button size="mini" type="primary" icon='el-icon-document-copy' v-if="scope.row.estatus=='Permiso'" @click="clickPermiso(scope)">{{scope.row.estatus}}</el-button>
          <el-button v-if="scope.row.estatus=='Justificado'" type="primary" size="small" effect="dark" @click="handleDetailJustification(scope)">Justificado</el-button>
        </template>
      </el-table-column>
 <el-table-column header-align="center" align="center" label="Checada 1" width="100" prop="c1"/>
 <el-table-column header-align="center" align="center" label="Checada 2" width="100" prop="c2"/>
 <el-table-column header-align="center" align="center" label="Checada 3" width="100" prop="c3"/>
 <el-table-column header-align="center" align="center" label="Checada 4" width="100" prop="c4"/>
 <el-table-column header-align="center" align="center" label="Checada 5" width="100" prop="c5"/>
 <el-table-column header-align="center" align="center" label="Checada 6" width="100" prop="c6"/>
 <el-table-column header-align="center" align="center" label="Checada 7" width="100" prop="c7"/>

 <el-table-column header-align="center" align="center" label="Mensaje" width="170" prop="message" />
 <el-table-column header-align="center" align="center" label="Excepción" width="170" prop="exc" />
    </el-table>

    <ModalJustification ref="ModalJustification" />
    <ModalTipoJustification ref="ModalTipoJustification" />
    <ModalDaysOff ref="ModalDaysOff" />

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone,parseTime } from '@/utils'
// import 'semantic-ui-css/semantic.min.css';
import ModalJustification from './components/ModalJustification'
import ModalTipoJustification from './components/ModalTipoJustificacion'
import ModalDaysOff from './components/ModalDaysOff'
// import ModalCatStatus from './components/ModalCatStatus'
export default {
  components: {
    ModalJustification,
    ModalTipoJustification,
    ModalDaysOff
  },
   data() {

    var validate = (rule, value, callback) => {
      if (value == '' || value == null) {
        return callback(new Error('Por favor Ingresa titulo'))
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
      formRep:{
         FechaReporte: '',
         ubications: [],
      },
       rules: {
          FechaReporte: [
              { required: true, message: 'Ingresa fecha reporte', trigger: 'blur', validator: ValidateDate }
            ],
            ubications: [
              { required: true, message: 'Ingresa ubicación', trigger: 'change', validator: validate }
            ],
       },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: 'Ult. Semana',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Ult. Mes',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
          },
      HorariosList: [],
      search: '',
      FechaReporte: '',
      dataUbications: [],
      ubications: [],
      listLoading: false,
      isloading: false,
      downloadLoading: false,
    }
  },
  beforeMount() {
  // this.$root.$refs.ReporteAsistencia = this
  },
  created() {
    // this.getHorariosPersonal();
    this.getUbications()
  },

  methods: {

    async getHorariosPersonal() {
      this.isloading = true
      this.listLoading = true
      const currentObj = this
      await Api.get('/controlAsistencia/getHorariosPersonal').then(res => {
        currentObj.data = res.data
        this.HorariosList = res.data
        this.listLoading = false
        this.isloading = false
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    },
    clickPermiso(file) {
        window.open(file.row.document, '_blank');
    },
       clickVacation(file) {
        window.open(file.row.document, '_blank');
    },
    handleJustification() {
         this.$store.dispatch('getTypeJustificationActive')
      this.$root.$refs.ModalJustification.getPersonalIntelisis()
       this.$root.$refs.ModalJustification.isDisabled =false;
      this.$root.$refs.ModalJustification.dialogType = 'new'
      this.$root.$refs.ModalJustification.dialogVisible = true
    },
   handleDetailJustification(scope){
   this.$root.$refs.ModalJustification.getPersonalIntelisis()
      this.$root.$refs.ModalJustification.ruleForm.userAd = scope.row.justification.user
      this.$root.$refs.ModalJustification.ruleForm.typeJus = scope.row.justification.type_id
      this.$root.$refs.ModalJustification.ruleForm.Comentarios = scope.row.justification.description
      this.$root.$refs.ModalJustification.ruleForm.FechaInicio = scope.row.justification.date
      this.$root.$refs.ModalJustification.filename = scope.row.justification.file
      this.$root.$refs.ModalJustification.isDisabled =true;
      this.$root.$refs.ModalJustification.dialogType = 'edit'
      this.$root.$refs.ModalJustification.dialogVisible = true
    },
    handleTipoJustification() {
      this.$store.dispatch('getTypeJustification')
    this.$root.$refs.ModalTipoJustification.dialogType = 'new'
      this.$root.$refs.ModalTipoJustification.dialogVisible = true
    },
     handleDaysOff() {
      this.$store.dispatch('getDaysOff')
       this.$root.$refs.ModalDaysOff.dialogType = 'new'
      this.$root.$refs.ModalDaysOff.dialogVisible = true
    },

    async getUbications() {
      this.listLoading = true
      const currentObj = this
      await Api.get('/controlAsistencia/getUbications').then(res => {
        currentObj.data = res.data
        this.dataUbications = res.data
        this.listLoading = false
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
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
      formData.append('ubications', this.formRep.ubications)

      await Api.post('/controlAsistencia/getReporteAsistencia', formData, config).then(res => {
        currentObj.data = res.data
        this.HorariosList = res.data
        // this.$root.$refs.VueTables.localData=res.data;
        this.listLoading = false
        this.isloading = false
        
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Genero Reporte de Asistencia -> fechas: ' + this.formRep.FechaReporte + ' ubication:' +this.formRep.ubications)
        formAut.append('evento', 'handleGenerateReport()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    },

     handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['No Empleado', 'No Empleado Anterior','Nombre','Departamento','Ubicación','Periodo de Pago',
        'Horario Base','Entrada','Salida a Comer','Regreso Comida','Salida','Fecha','Status Jornada','Entrada','Salida','Tiempo Oficina','Comidas','Tiempo Comida','Tiempo Trabajo','Checada1','Checada2'
        ,'Checada3','Checada4','Checada5','Checada6','Checada7','Mensaje','Excepción']
        const filterVal = ['personal_id', 'previous_personal_id','name','deparment','location','payment_period',
      'horariobase','hourentry','hourfood1','hourefood2','hourexit','fecha','extra','entrada','salida','timeoffice','comida','timecomida','trabajo','c1'
      ,'c2','c3','c4','c5','c6','c7','message','exc']
        const list = this.HorariosList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "Report_asistencia_"+ this.formRep.FechaReporte,
         autoWidth: true, //Optional
         bookType: 'xlsx' //Optional
        })
        this.downloadLoading = false
      })
    },
  formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
  
}
</script>

<style lang="scss" scoped>
.greenClass {
  background: green;
}
.redClass {
  background: red;
}
</style>
