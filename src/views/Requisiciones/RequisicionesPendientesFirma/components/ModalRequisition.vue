<template>

  <el-dialog width="85%" center top="5vh" :visible.sync="dialogVisible" :title="dialogType==='edit'?'Validación Requisición':'Detalle Requisición'">

    <el-form ref="formRequisition" :label-position="labelPosition" label-width="100px" :rules="rules" :disabled="isDisabled" :model="formRequisition">
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <center>SOLICITUD DE REQUISICION</center>
        </div>
        <el-container style="">
          <el-form-item label="Fecha Solicitud:" class="ml-5" prop="date">
              <el-date-picker
              v-model="formRequisition.date"
              type="date"
             format="dd/MM/yyyy"
              value-format="dd-MM-yyyy"
              placeholder="Fecha Solicitud"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Fecha de Validación RH:" class="ml-5">
            <el-input
            
              placeholder="00/00/0000"
              suffix-icon="el-icon-date"
              v-model="formRequisition.date_validation_rh" disabled></el-input>
          </el-form-item>
          <el-form-item label="Fecha Recepción RH:" class="ml-5">
            <el-input
              placeholder="00/00/0000"
              suffix-icon="el-icon-date"
              v-model="formRequisition.date_received_rh" disabled> </el-input>
          </el-form-item>
          <el-form-item label="Presupuesto:" class="ml-5">
            <el-select v-model="formRequisition.estimate" class="w-50" clearable placeholder="">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-container>
      </el-card>
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <center>VACANTE</center>
        </div>
        <el-container class="ml-5">
          <el-form-item label="Tipo:" class="ml-5" prop="type">
            <el-select v-model="formRequisition.type" @change="handleChangeType" clearable  placeholder="seleccionar:">
              <el-option
                v-for="item in optionsType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Temporalidad:" class="ml-5" prop="type_vacancy">
            <el-select v-model="formRequisition.type_vacancy"  @change="handleChangeTypeTemp" clearable :disabled="showSelectTypeVac" placeholder="seleccionar:">
              <el-option
                v-for="item in optionsTypeVacancy"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Sueldo:" class="ml-5" prop="salary">
            <el-input-number v-model="formRequisition.salary" :precision="2" :step="1" ></el-input-number>
          </el-form-item>
          <el-form-item label="Numero de Vacantes:" class="ml-5">
            <el-input-number v-model="formRequisition.num_vacancy" controls-position="right" :min="1" clearable ></el-input-number>
          </el-form-item>
        </el-container>

        <el-container class="ml-5">
          <el-form-item label="Nivel de Posición:" class="ml-5" prop="level_position">
            <el-select v-model="formRequisition.level_position" clearable placeholder="seleccionar:">
              <el-option
                v-for="item in optionsLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Departamento:" class="ml-5">
           <el-input v-model="formRequisition.department" disabled></el-input>
           </el-form-item>
          <el-form-item label="Razon Social:" class="ml-5" prop="company_name">
            <el-select v-model="formRequisition.company_name" clearable placeholder="seleccionar:" filterable>
              <el-option
                v-for="item in CompanyName"
                :label="item.company_name"
                :value="item.company_name">
              </el-option>
            </el-select>
          </el-form-item>         
          <el-form-item label="Numero de Sucursal:" class="ml-5"  prop="branch_code"> 
            <el-select v-model="formRequisition.branch_code" clearable placeholder="seleccionar:" filterable>
              <el-option
                v-for="item in BranchCode"
                :label="item.branch_code"
                :value="item.branch_code">
              </el-option>
            </el-select>
          </el-form-item>          
        </el-container>
        <el-container class="ml-5" v-if="showVacancy" >
        <el-form-item label="Nombre del puesto a crear:" class="ml-5  w-50" prop="vacancy">
            <el-input v-model="formRequisition.vacancy" placeholder="Puesto de la vacante" ></el-input>
        </el-form-item>
      </el-container>
        
        <el-container class="ml-5" v-if="showReplacement" >
        <el-form-item label="Selecciona Colaborador que sustituye:" class="" >
          <el-input v-model="search" clearable style="width: 50%;" class="mb-3" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
          <el-table
              ref="singleTable"
              :data="PersonalStaffAll_Panel.filter(data => !search || (data.personal_id && data.personal_id.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
               (data.name && data.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1) || (data.last_name && data.last_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1) 
               || (data.plaza_id && data.plaza_id.toLowerCase().indexOf(this.search.toLowerCase()) > -1) 
               || (data.position_company_full_plazas && data.position_company_full_plazas.toLowerCase().indexOf(this.search.toLowerCase()) > -1))"
              highlight-current-row
              style="width: 80%"
              @current-change="handleCurrentChange"
              border>
              <el-table-column
                type="index"
                width="35"
                >
              </el-table-column>
               <el-table-column
                property="position_company_full_plazas" 
                label="Puesto"
                width="300">
              </el-table-column>
              <el-table-column
                property="personal_id"
                label="No Empleado"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                property="name"
                label="Nombre"
                width="200">
              </el-table-column>
              <el-table-column
                property="last_name" 
                label="Apellidos"
                width="200">
              </el-table-column>
             
             
              <el-table-column
                property="company_name"
                label="Empresa"
                width="400">
              </el-table-column>
            </el-table>
        </el-form-item>
      </el-container>

      </el-card>
      <el-container>
        <el-card class="box-card w-50" shadow="always">
          <div slot="header" class="clearfix">
            <center>MOTIVO DE REEMPLAZO</center>
          </div>
          <el-form-item label="Tipo:" class="ml-5 d-inline-block" v-if="showMotivoReemplazo" prop="reason_replacement">
            <el-radio-group v-model="formRequisition.reason_replacement">
            <el-radio label="Baja" class="d-block mt-2">Por Renuncia/Baja</el-radio>
            <el-radio label="Promocion" class="d-block mt-3">Por Promoción</el-radio>
          </el-radio-group>
          </el-form-item>


        </el-card>
        <el-card class="box-card w-50" shadow="always">
          <div slot="header" class="clearfix">
            <center>PERSONAL TEMPORAL</center>
          </div>
          <el-container class="w-50 ml-5"> 
            <el-form-item label="Tipo:" class="ml-5 d-inline-block" v-if="showPersonalTemporal" prop="temp_reason">
            <el-radio-group v-model="formRequisition.temp_reason" >
            <el-radio label="Incapacidad" class="d-block mt-2 h2">Incapacidad</el-radio> 
            <el-radio label="Trabajo" class="d-block mt-2 h4">Carga de Trabajo</el-radio>
            <el-radio label="Proyecto" class="d-block mt-2 h4">Proyecto</el-radio>
          </el-radio-group>
          </el-form-item>
       
           <el-form-item label="Duración:" class="ml-5 d-inline-block" v-if="showPersonalTemporal">
             <el-input-number class="d-block mb-1" v-model="formRequisition.days_temp_reason" controls-position="right" :min="1"  size="mini"></el-input-number>
            
        
          </el-form-item>
        </el-container>
        </el-card>
      </el-container>
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <center>REQUISITOS</center>
        </div>

<el-container class="ml-5">
  <el-form-item label="Lugar de Trabajo:" class="w-50">
      <el-input
        type="textarea"
        placeholder=""
        v-model="formRequisition.personal_location"
        maxlength="200"
        :rows="2"
        show-word-limit>
    </el-input>
</el-form-item>
<el-form-item label="Disponibilidad para Viajar:" class="ml-5">
  <div>
  <el-checkbox  @change="handleChangeTravel" class="d-inline-block" :checked="chktravel">Si</el-checkbox>
  <el-input-number class="d-inline-block ml-5" v-model="formRequisition.days_travel" :disabled="showDaysTravel" controls-position="right" :min="0"  size="small"></el-input-number>
  <el-select v-model="formRequisition.time_travel" class="d-inline-block ml-5" style="width: 35%;" :disabled="showTimeTravel" clearable placeholder="seleccionar:">
              <el-option
                v-for="item in optionsTravel"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
</div>
</el-form-item>

</el-container>
<el-form-item label="Adjuntar Archivo Descripción de Puesto:" class="ml-5">
        <el-upload
        ref="upload"
        class="upload-demo"
        id="inputFileUpload"
        action="#"
        v-model="formRequisition.filename"
        :auto-upload="false"
        :on-preview="handlePreview"
        :on-exceed="handleExceed"
        :on-success="handleSucces"
        :on-change="beforeUploadFile"
        :thumbnail-mode="true"
        list-type="text"
        :limit="1"
        :file-list="fileList">
        <el-button size="medium" type="primary">Clic para subir archivo</el-button>
        <div slot="tip" class="el-upload__tip">Solo archivos pdf </div>
      </el-upload><br>

</el-form-item>
      </el-card>
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <center>SISTEMAS</center>
        </div>
        <center >
    <p >En caso de solicitar una posición de nueva creación es indispensable considerar las herramientas que requiere.</p>
    <el-container>
    <el-checkbox-group v-model="formRequisition.resources" class="ml-5 mt-4">
     <el-checkbox v-for="resource in optionsResources" :label="resource.id" :key="resource.id">{{resource.label}}</el-checkbox>
     <el-checkbox :label="4" @change="handleChangeEmail">Cuenta Correo</el-checkbox>
  </el-checkbox-group>
   <el-form-item label="" class="mt-4" >
      <el-select v-model="formRequisition.email_domain_id" value-key="id" class="d-inline-block ml-5 w-75" :disabled="showSelectEmail" clearable placeholder="seleccionar:">
              <el-option
                v-for="item in EmailDomain"
                :key="item.id"
                :label="item.domain"
                :value="String(item.id)"
                
               >
              </el-option>
            </el-select>
      </el-form-item>
      </el-container>
  <el-form-item label="Software Adicional (Especifique):" class="w-100 mt-4">
      <el-input
        type="textarea"
        placeholder=""
        v-model="formRequisition.software_aditional"
        maxlength="200"
        :rows="2"
        show-word-limit class="w-75">
    </el-input>
    <p class="text-muted">Nota: **En caso de requerir software especializado, solicitarlo vía ticket apegándose al proceso de autorización establecido***</p>
</el-form-item>
        </center>
      </el-card>
      <el-card class="box-card W-75" shadow="always">
        <div slot="header" class="clearfix">
          <center>AUTORIZACIONES</center>
        </div>

          <el-table
              class="mt-2 ml-3"
              :data="personalFirmas"
              style=""
              border
            >
              </el-table-column>
              <el-table-column
                property="position_company"
                label="Puesto"
                width="400"
                align="center">
              </el-table-column>
              <el-table-column
                property="name"
                label="Nombre"
                align="center"
                width="400">
              </el-table-column>
              </el-table-column>
              <el-table-column
                label="Firmas"
                width="300">
                 <template slot-scope="scope">
         <el-tag v-if="scope.row.Firma=='firmado' || scope.row.Firma=='completada'" type="success" effects="dark">Estatus:  {{scope.row.Firma}}</el-tag><br>
         <el-tag v-if="scope.row.Firma=='pendiente'" type="warning" effects="dark">Estatus:  {{scope.row.Firma}}</el-tag><br>
         <el-tag v-if="scope.row.Firma=='rechazada'" type="danger" effects="dark">Estatus:  {{scope.row.Firma}}</el-tag><br>
         <el-tag v-if="scope.row.signed_date">Firma Digital:  {{scope.row.Firma_Digital}}</el-tag><br>
         <el-tag v-if="scope.row.signed_date" type="info" effects="dark">Fecha:  {{scope.row.signed_date}}</el-tag>
          </template>
              </el-table-column>
            </el-table>
            
      </el-card>

    </el-form>

    <div style="text-align:right;">
      <el-button type="info" @click="CancelarModal()">Cerrar</el-button>
      <el-button type="danger" v-if="this.formRequisition.status=='recaudar firmas' && this.formRequisition.sign_status=='pendiente'" :loading="btnloading" @click="RechRequisition">Rechazar Requisición <i class="el-icon-close el-icon-right" /></el-button>
      <el-button v-if="this.formRequisition.status=='recaudar firmas' && this.formRequisition.sign_status=='pendiente'" type="success" icon="el-icon-check" @click="handleFirmarRequisition" >Firmar Requisición</el-button>
        <!-- <el-button type="primary" :loading="btnloading" @click="ValidateRequisition">Validar Requisición <i class="el-icon-check el-icon-right" /></el-button>
    <el-button type="primary">Subir Archivo</el-button> -->
    </div>
  </el-dialog>

</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { mapGetters} from 'vuex'
export default {
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
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
      dialogType: 'new',
      dialogVisible: false,
      labelPosition: 'top',
      checked:'',
      fileList: [],
      currentRow:'',
      search:'',
      higher:false,
      showVacancy:false,
      showReplacement:false,
      showSelectTypeVac:true,
      showDaysTravel:true,
      showTimeTravel:true,
      showSelectEmail:true,
      showMotivoReemplazo:false,
      showPersonalTemporal:false,
      btnloading:false,
      chktravel:false,
      isDisabled:false,
      emailselected:[],
      formRequisition:{
        id:'',
        date: '',
        date_reception:'',
        date_delivered:'',
        department:'',
        estimate:'',
        type:'',
        type_vacancy:'',
        num_vacancy:'',
        vacancy:'',
        salary:'',
        level_position:'',
        company_name:'',
        personal_location:'',
        days_travel:0,
        time_travel:'',
        filename:'',
        reason_replacement:'',
        temp_reason:'',
        days_temp_reason:'',
        branch_code:'',
        email_domain_id:'',
        software_aditional:'',
        resources:[],
        user:'',
        status:'',
        personal_substitution:'',
        plaza_id:''
      },
       rules: {
          date: [
              { required: true, message: 'Ingresa fecha solicitud', trigger: 'blur', validator: ValidateDate }
            ],
            type: [
              { required: true, message: 'Ingresa tipo de vacante', trigger: 'change', validator: validate }
            ],
            type_vacancy: [
              { required: true, message: 'Ingresa temporalidad', trigger: 'change', validator: validate }
            ],
            salary: [
              { required: true, message: 'Ingresa salario', trigger: 'blur', validator: validate }
            ],
             vacancy: [
              { required: true, message: 'Ingresa nombre vacante', trigger: 'blur', validator: validate }
            ],
              reason_replacement: [
              { required: true, message: 'Ingresa motivo reemplazo', trigger: 'change', validator: validate }
            ],
              temp_reason: [
              { required: true, message: 'Ingresa motivo temporal', trigger: 'change', validator: validate }
            ],
             level_position: [
              { required: true, message: 'Ingresa nivel de posición', trigger: 'change', validator: validate }
            ],
            company_name: [
              { required: true, message: 'Ingresa razón social', trigger: 'change', validator: validate }
            ],
             branch_code: [
              { required: true, message: 'Ingresa sucursal', trigger: 'change', validator: validate }
            ],
            //   email_domain: [
            //   { required: true, message: 'Ingresa dominio correo', trigger: 'change', validator: validate }
            // ]

      },       
      options: [{
          value: 'Con',
          label: 'Con'
        }, {
          value: 'Sin',
          label: 'Sin'
        }
      ],
      optionsType: [{
          value: 'Nueva creacion',
          label: 'Nueva creación'
        }, {
          value: 'Reemplazo',
          label: 'Reemplazo'
        }
      ],
      optionsTypeVacancy: [{
          value: 'Permanente',
          label: 'Permanente'
        }, {
          value: 'Temporal',
          label: 'Temporal',
          disabled: false
        }
      ],
      optionsLevel: [{
          value: 'Operativo',
          label: 'Operativo'
        }, {
          value: 'Administrativo',
          label: 'Administrativo'
        }, {
          value: 'Gerente',
          label: 'Gerente'
        }, {
          value: 'Directivo',
          label: 'Directivo'
        }, {
          value: 'Promocion Interna',
          label: 'Promocion Interna'
        }
      ],
      optionsTravel: [{
          value: 'veces Anual',
          label: 'veces Anual'
        }, {
          value: 'veces Mensual',
          label: 'veces Mensual'
        }, {
          value: 'veces Semanal',
          label: 'veces Semanal'
        }
      ],
      optionsResources:[
        {  id:1, value: 'Telefono',label: 'Telefono'},
        {  id:2,  value: 'Laptop',  label: 'Laptop' },
        {  id:3, value: 'Soft Phone(diadema)',label: 'Soft Phone(diadema)'},
        // {  id:4,  value: 'Cuenta Correo', label: 'Cuenta Correo' }
        ],
personalFirmas:[],

    }
  },
  beforeMount() {
     this.$root.$refs.ModalRequisition = this
  },
  mounted(){
  },
  created() {
 
    this.$store.dispatch('getVw_CompanyName');
    this.$store.dispatch('getVw_BranchCode');
    // this.$store.dispatch('getCommading_staff_All');
    // this.formRequisition.deparment= this.$store.getters.deparment;

   
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'deparment',
      'CompanyName',
      'BranchCode',
      'PersonalStaffAll_Panel',
      // 'PersonalStaffHigher',
      'EmailDomain',
      // 'RequisitionValidationId'
    ])
  },
  methods: {
  
 CancelarModal() {
      this.dialogVisible = false
    },
  resetForm() {
   this.$refs[formName].resetFields();
   },
    handleCurrentChange(val) {
          this.currentRow = val;
    this.formRequisition.personal_substitution="";
    this.formRequisition.plaza_id="";
    if(val.personal_id !=null){
        this.formRequisition.personal_substitution=val.personal_id;

        }else{
        this.formRequisition.plaza_id=val.plaza_id;
        }
        this.formRequisition.vacancy= val.position_company_full_plazas
   
      },
    handleRemove(file, fileList) {
      Api.get('/deletefile/' + file.raw.name).then(res => {
        this.$message.warning(`El archivo ha sido removido correctamente`)
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSucces(response, file, fileList) {
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
    
    async beforeUploadFile(file, fileList) {
      const currentObj = this
      const fileType = file.raw.type
      const isLt2M = file.size
       const isPDF =  'application/pdf'
      let bool = false
      const ext = []
      let split
      await Api.get('/getCatTipoAdjunto').then(res => {
        currentObj.data = res.data
        for (var i = 0; i < currentObj.data.length; i++) {
          split = currentObj.data[i].extension.split('.')
          ext.push(split[1])
          if (currentObj.data[i].mimeType == fileType && isPDF==fileType) {
            if (isLt2M >= currentObj.data[i].tamanioPermitido) {
              this.$message.error('El archivo supera el peso maximo admitido para este formato es: ' + this.bytesToSize(currentObj.data[i].tamanioPermitido))
              fileList.pop()
            }
            bool = true
          }
        }
        if (!bool) {
          this.$message.error('El archivo debe contener los siguientes formatos pdf' )
          fileList.pop()
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
    handleChangeType(val){
      if(val=="Nueva creacion"){
        this.getAuthorizationsbyUser();
        this.showVacancy= true;
        this.showReplacement= false;
        this.showMotivoReemplazo=false;
        this.showPersonalTemporal=false;
        
        for (let index = 0; index < this.optionsTypeVacancy.length; index++) {
            if(Object.keys(this.optionsTypeVacancy[index]).indexOf("disabled") !== -1){
              this.optionsTypeVacancy[index].disabled=false;
            }
      }
        this.showSelectTypeVac=false;
        this.formRequisition.type_vacancy='';

      }else if(val=="Reemplazo"){
        this.getAuthorizationsbyUser();
        this.showReplacement= true;
        this.showVacancy= false;
         this.showMotivoReemplazo=true;
        this.showPersonalTemporal=false;

        for (let index = 0; index < this.optionsTypeVacancy.length; index++) {
            if(Object.keys(this.optionsTypeVacancy[index]).indexOf("disabled") !== -1){
              this.optionsTypeVacancy[index].disabled=true;
            } 
        }
        this.showSelectTypeVac=false;
        this.formRequisition.type_vacancy='';

      }else{
        this.showSelectTypeVac=true;
        this.showReplacement= false;
        this.showVacancy= false;
        this.showMotivoReemplazo=false;
         this.showPersonalTemporal=false;

      }
         this.search='';
        this.formRequisition.reason_replacement='';
         this.formRequisition.personal_substitution='';
         this.formRequisition.plaza_id='';

    },
   handleChangeTypeTemp(val){
    if(val=="Temporal"){
      this.showMotivoReemplazo=false;
    this.showPersonalTemporal=true;

    }else if(val=="Permanente" && this.formRequisition.type=="Reemplazo"){
      this.showMotivoReemplazo=true;
    }else{
      this.showPersonalTemporal=false;
      this.showMotivoReemplazo=false;
    }
     this.formRequisition.reason_replacement='';
     this.formRequisition.personal_substitution='';
     this.formRequisition.temp_reason='';
     this.formRequisition.days_temp_reason='';
   },
    handleChangeTravel(val){
      if(val){
        this.showDaysTravel=false;
        this.showTimeTravel=false;
      }else{
       this.showDaysTravel=true;
        this.showTimeTravel=true;
        this.formRequisition.days_travel=0;
        this.formRequisition.time_travel='';
      }
    },
    handleChangeEmail(val){
      if(val){
        this.showSelectEmail=false;
      }else{
        this.showSelectEmail=true;
        this.formRequisition.email_domain_id='';
      }
    },
    getAuthorizationsbyUser(){
        const formAut = new FormData()
        formAut.append('type', this.formRequisition.type);
        formAut.append('user', this.formRequisition.user);
        formAut.append('id_req', this.formRequisition.id);
      //get Data signatures Authorizations depending of type requisition
         this.$store.dispatch('getHigher_StaffConsulta',formAut).then(res => {
         this.personalFirmas= res
       });

    },
    confirmRequisition(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {
          // const isEdit = this.dialogType === 'edit'

          // if (isEdit) {
            // this.editarUsuario();
          // } else {
            this.updateRequisition()
          // }
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    },
    async updateRequisition() {
       this.btnloading = true
      const file = this.$refs.upload.uploadFiles
      const formData = new FormData()
      formData.append('id', this.formRequisition.id)
      formData.append('type', this.formRequisition.type)
      formData.append('deparment', this.formRequisition.department)
      formData.append('date', this.formRequisition.date)
      formData.append('level', this.formRequisition.level_position)
      formData.append('vacancy', this.formRequisition.vacancy)
      formData.append('type_vacancy', this.formRequisition.type_vacancy)
      formData.append('num_vacancy', this.formRequisition.num_vacancy)
      formData.append('time_travel', this.formRequisition.time_travel)
      if(this.formRequisition.days_travel==null){
       this.formRequisition.days_travel='';
      }
      formData.append('days_travel', this.formRequisition.days_travel)
      if(this.formRequisition.temp_reason==null){
        this.formRequisition.temp_reason='';
      }
      formData.append('temp_reason', this.formRequisition.temp_reason)
      formData.append('personal_substitution', this.formRequisition.personal_substitution)
      formData.append('plaza_id', this.formRequisition.plaza_id)
      if(this.formRequisition.reason_replacement==null){
        this.formRequisition.reason_replacement='';
      }
      formData.append('reason_replacement', this.formRequisition.reason_replacement)
      if(this.formRequisition.days_temp_reason==null){
       this.formRequisition.days_temp_reason='';
      }
      formData.append('temp_days', this.formRequisition.days_temp_reason)
      formData.append('salary', this.formRequisition.salary)
      formData.append('estimate', this.formRequisition.estimate)
      formData.append('email_domain', this.formRequisition.email_domain_id)
      formData.append('resourcesList', this.formRequisition.resources)
        if(this.formRequisition.days_temp_reason==null){
          this.formRequisition.days_temp_reason='';
        }
      formData.append('software_aditional', this.formRequisition.software_aditional)

      formData.append('personal_location', this.formRequisition.personal_location)
      formData.append('company_name', this.formRequisition.company_name)
      formData.append('branch_code', this.formRequisition.branch_code)
      formData.append('user', this.formRequisition.user)

    if (file != '') {
          formData.append('file', file[0].raw);
      }
    this.$store.dispatch('updateRequisition',formData).then(res => {
         this.$notify({
          title: 'Requisicion Actualizada',
          message: res.data.success,
          type: 'success',
          offset: 50
        });
          this.$store.dispatch("getMyRequisitions").then(res => {
          this.btnloading = false
           this.dialogVisible = false;

          })

         const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Edito esta requisición')
        formAut.append('evento', 'updateRequisition()')
         formAut.append('id_afectado', this.formRequisition.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
    })
  
  },
//  async CancelRequisition(){
//         this.$confirm('Se validara requisición de personal, estas seguro de continuar, no podrás realizar cambios posteriormente?', 'Confirmar Validación', {
//           confirmButtonText: 'Validar',
//           cancelButtonText: 'Cancelar',
//           type: 'warning',
//           center: true
//         }).then(() => {
//           // this.$message({
//           //   type: 'success',
//           //   message: 'Delete completed'
//           // });

//         const formData = new FormData()
//         formData.append('id', this.formRequisition.id)
//            this.$store.dispatch('CancelPersonalRequisition',formData).then(res => {
//             this.$message({
//               message: res.data.success,
//               type: 'success'
//             })
//            })
//         this.$store.dispatch("getMyRequisitions").then(res => {
//            this.dialogVisible = false;

//           })

          
//          const formAut = new FormData()
//         formAut.append('name_view', this.$route.name)
//         formAut.append('comentarios', 'Canceló esta requisición')
//         formAut.append('evento', 'CancelRequisition()')
//          formAut.append('id_afectado', this.formRequisition.id)

//         this.$store.dispatch('auditoria/addEventAuditoria', formAut)
//         }).catch(() => {
//           this.$message({
//             type: 'info',
//             message: 'Validación Cancelada'
//           });
//         });
//       },
      async RechRequisition(){
        this.$confirm('Se rechazara requisición de personal, estas seguro de continuar, no podrás realizar cambios posteriormente?', 'Confirmar Rechazar', {
          confirmButtonText: 'Rechazar',
          cancelButtonText: 'Cancelar',
          type: 'warning',
          center: true
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: 'Delete completed'
          // });

        const formData = new FormData()
            formData.append('id', this.formRequisition.id)
        formData.append('user', this.$store.getters.user);
        formData.append('status', false);
      // formData.append('personal_autorizations',  JSON.stringify(this.$store.getters.PersonalStaffHigher))

            this.$store.dispatch('SignRequisition',formData).then(res => {
         this.$notify.error({
          title: 'Requisicion Rechazada',
          message: res.data.success,
        });

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se rechazó esta requisición')
        formAut.append('evento', 'RechRequisición()')
         formAut.append('id_afectado', this.formRequisition.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
           })
        this.$store.dispatch("getRequisitionsMyPersonalPendientes").then(res => {
        this.listLoading=false;
        this.CancelarModal();
         this.$store.dispatch("getRequisitionsMyPersonal");
        });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Firma Cancelada'
          });
        });
      },
             handleFirmarRequisition(){
        // this.$confirm('Se cancelara requisición de personal, estas seguro de continuar?', 'Confirmar Cancelación', {
        //   confirmButtonText: 'Aceptar',
        //   cancelButtonText: 'Cancelar',
        //   type: 'warning',
        //   center: true
        // }).then(() => {
          this.listLoading=true;
        const formData = new FormData()
        formData.append('id', this.formRequisition.id)
        formData.append('user', this.$store.getters.user);
        formData.append('status', true);
           this.$store.dispatch('SignRequisition',formData).then(res => {
           
             this.$notify({
          title: 'Requisicion Firmada',
          message: res.data.success,
          type: 'success',
          offset: 50
        });
          const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se firmó requisicion -> Detalles: ' + this.$store.getters.user)
        formAut.append('evento', 'handleFirmarRequisition()')
         formAut.append('id_afectado', this.formRequisition.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$store.dispatch("getRequisitionsMyPersonalPendientes").then(res => {
        this.listLoading=false;
        this.CancelarModal();
        });
         this.$store.dispatch("getRequisitionsMyPersonal");

           })

     

      },
  
  }
}
</script>

<style lang="scss" scoped>
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
.clearfix {
  background: #3f5465 !important;
  color: white;
}
  .clearfix:before,
  .clearfix:after {
    // display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
    .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
/* Style 9
   ----------------------------- */
   .nine h1 {
  text-align:center; font-size:40px; text-transform:uppercase; color:#222; letter-spacing:1px;
  font-family:"Playfair Display", serif; font-weight:400;
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
