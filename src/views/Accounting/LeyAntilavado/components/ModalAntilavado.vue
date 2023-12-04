<template>

  <el-dialog width="70%"  center top="5vh" :visible.sync="dialogVisible" :title="dialogType==='edit'?'Editar Registro':'Nuevo Registro'">

    <el-form ref="formAntilavado" :label-position="labelPosition" label-width="200px" :rules="rules"  :model="formAntilavado">
    <el-container>
      <el-form-item v-if="dialogType=='new'" label="Empresa:" prop="company_id">
       <el-select  v-model="formAntilavado.company_id" filterable style="width:150%" clearable placeholder="seleccionar:">
              <el-option
                v-for="item in CompaniesLaw"
                :label="item.business_name"
                :value="item.id">
              </el-option>
            </el-select>
    </el-form-item>
<el-form-item v-else  label="Empresa:" prop="get_company.id">
        <el-select v-model="formAntilavado.get_company.id" filterable style="width:150%" clearable placeholder="seleccionar:">
              <el-option
                v-for="item in CompaniesLaw"
                :label="item.business_name"
                :value="item.id">
              </el-option>
            </el-select>
      </el-form-item>
  <el-form-item  label="No. Folio" prop="no_folio">
              <el-input-number class="ml-4" v-model="formAntilavado.no_folio" :step="1" ></el-input-number>

      </el-form-item>
       </el-container>

  <el-container>
      <el-form-item label="Mes" prop="month">
        <el-select  v-model="formAntilavado.month" filterable class="ml-3" style=""  clearable placeholder="seleccionar:">
              <el-option
                v-for="item in arrYear"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </el-form-item>
       <el-form-item label="Estatus del envío" prop="status_send">
        <el-select  v-model="formAntilavado.status_send" filterable class="ml-3" clearable placeholder="seleccionar:">
              <el-option
                v-for="item in optionsStatus"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </el-form-item>
      </el-container>

      <el-container >
      <el-form-item  label="Tipo de Aviso:" prop="type">
  <el-select  v-model="formAntilavado.type" filterable class="ml-3"   clearable placeholder="seleccionar:">
              <el-option
                v-for="item in optionsType"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </el-form-item>
      <el-form-item  label="Expediente Completo" label-position="right" prop="full_expedient">
     <el-select  v-model="formAntilavado.full_expedient" filterable class="ml-3"   clearable placeholder="seleccionar:">
              <el-option
                v-for="item in optionsFullExpendient"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </el-form-item>
 </el-container>
  <el-container >
      <el-form-item  label="Fecha envío:" prop="date_send">
          <el-date-picker
          class="ml-3"
                v-model="formAntilavado.date_send"
                type="date"
                placeholder="Fecha Envío"
               format="dd/MM/yyyy"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
              </el-date-picker>
      </el-form-item>
      <el-form-item label="Monto:" prop="amount">
       <el-input-number class="ml-2" v-model="formAntilavado.amount" :precision="2" :step="1" ></el-input-number>
      </el-form-item>

  </el-container>
    <el-form-item label="Persona Objeto del Envio:" prop="person_object_send">
        <el-input  v-model="formAntilavado.person_object_send"  clearable placeholder="" />
      </el-form-item>
      <el-form-item  label="Actividad Vulnerable" prop="vulnerable_activity">
       <el-select v-model="formAntilavado.vulnerable_activity" filterable class=""   clearable placeholder="seleccionar:">
              <el-option
                v-for="item in optionsVulnerable"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </el-form-item>

     </el-form>

    <div style="text-align:right;">
      <el-button type="danger" @click="CancelarModal()">Cancelar</el-button>
      <el-button type="success" :loading="btnloading" @click="confirmRequisition('formAntilavado')">Guardar Cambios </el-button>
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
      labelPosition: 'right',
      btnloading:false,
      formAntilavado:{
        id:'',
        no_folio: '',
        company_id:'',
        date_send:'',
        amount:'',
        month:'',
        status_send:'',
        type:'',
        person_object_send:'',
        full_expedient:'',
        vulnerable_activity:'',
        get_company:{
          business_name:'',
          id:'',
        }
      },
       rules: {
          date_send: [
              { required: true, message: 'Ingresa fecha de envío', trigger: 'blur', validator: ValidateDate }
            ],
            type: [
              { required: true, message: 'Ingresa tipo de aviso', trigger: 'change', validator: validate }
            ],
            status_send: [
              { required: true, message: 'Ingresa estatus de envío', trigger: 'change', validator: validate }
            ],
            no_folio: [
              { required: true, message: 'Ingresa No folio', trigger: 'blur', validator: validate }
            ],
            company_id: [
              { required: true, message: 'Ingresa empresa', trigger: 'blur', validator: validate }
            ],
            get_company:{
                id:[
              { required: true, message: 'Ingresa empresa', trigger: 'blur', validator: validate }
            ],
            },
             person_object_send: [
              { required: true, message: 'Ingresa persona objecto de envío', trigger: 'blur', validator: validate }
            ],
             amount: [
              { required: true, message: 'Ingresa Monto', trigger: 'blur', validator: validate }
            ],
              month: [
              { required: true, message: 'Ingresa mes', trigger: 'change', validator: validate }
            ],
              vulnerable_activity: [
              { required: true, message: 'Ingresa actividad vulnerable', trigger: 'change', validator: validate }
            ],
             full_expedient: [
              { required: true, message: 'Ingresa expediente completo', trigger: 'change', validator: validate }
            ],


      },
        arrYear: [{
          value: 'ENERO',
          label: 'ENERO'
        }, {
          value: 'FEBRERO',
          label: 'FEBRERO'
        },
        {
          value: 'MARZO',
          label: 'MARZO'
        },
        {
          value: 'ABRIL',
          label: 'ABRIL'
        },
        {
          value: 'MAYO',
          label: 'MAYO'
        },
        {
          value: 'JUNIO',
          label: 'JUNIO'
        },
        {
          value: 'JULIO',
          label: 'JULIO'
        },
        {
          value: 'AGOSTO',
          label: 'AGOSTO'
        },
        {
          value: 'SEPTIEMBRE',
          label: 'SEPTIEMBRE'
        },
        {
          value: 'OCTUBRE',
          label: 'OCTUBRE'
        },
        {
          value: 'NOVIEMBRE',
          label: 'NOVIEMBRE'
        },
         {
          value: 'DICIEMBRE',
          label: 'DICIEMBRE'
        },

      ],
      options: [{
          value: 'Con',
          label: 'Con'
        }, {
          value: 'Sin',
          label: 'Sin'
        }
      ],
      optionsType: [
        {
          value: 'NORMAL',
          label: 'NORMAL'
        },
        {
          value: 'MODIFICATORIO',
          label: 'MODIFICATORIO'
        }
        ,{
          value: 'SIN DATOS',
          label: 'SIN DATOS'
        }

      ],
      optionsFullExpendient: [
        {
          value: 'SI',
          label: 'SI',
        },
         {
          value: 'NO APLICA',
          label: 'NO APLICA',
        }
      ],
      optionsStatus: [{
          value: 'ACEPTADO',
          label: 'ACEPTADO'
        }, {
          value: 'NO ACEPTADO',
          label: 'NO ACEPTADO'
        }
      ],
      optionsVulnerable: [{
          value: 'Derechos personales de uso o goce de inmuebles',
          label: 'Derechos personales de uso o goce de inmuebles'
        }, {
          value: 'Transmisión de derechos sobre bienes inmuebles',
          label: 'Transmisión de derechos sobre bienes inmuebles'
        }, {
          value: 'Donativos',
          label: 'Donativos'
        }, {
          value: 'Prestamos',
          label: 'Prestamos'
        }, {
          value: 'Vehículos Aéreos, Marítimos o Terrestres',
          label: 'Vehículos Aéreos, Marítimos o Terrestres'
        }
      ],
    }
  },
  beforeMount() {
     this.$root.$refs.ModalAntilavado = this
  },
  mounted(){
  },
  created() {
      this.$store.dispatch("getCompaniesLaw");

  },
  computed: {
    ...mapGetters([
      'CompaniesLaw'
    ])
  },
  methods: {

 CancelarModal() {
      this.dialogVisible = false
    },
  resetForm() {
      this.$refs['formAntilavado'].resetFields();
      this.formAntilavado.id=''
      this.formAntilavado.no_folio=''
      this.formAntilavado.company_id=''
      this.formAntilavado.date_send=''
      this.formAntilavado.amount=''
      this.formAntilavado.month=''
      this.formAntilavado.status_send=''
      this.formAntilavado.type=''
      this.formAntilavado.person_object_send=''
      this.formAntilavado.full_expedient=''
      this.formAntilavado.vulnerable_activity=''
   },



    confirmRequisition(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'

          if (isEdit) {
            this.updateAntilavado();
          } else {
            this.addAntilavado()
          }
        } else {
          this.$message.warning('Falta capturar Información')
          return false
        }
      })
    },

    async addAntilavado(){
      this.btnloading = true
      const formData = new FormData()

      // formData.append('id', this.formAntilavado.id)
      formData.append('type', this.formAntilavado.type)
      formData.append('date_send', this.formAntilavado.date_send)
      formData.append('amount', this.formAntilavado.amount)
      formData.append('status_send', this.formAntilavado.status_send)
      formData.append('vulnerable_activity', this.formAntilavado.vulnerable_activity)
      formData.append('company_id', this.formAntilavado.company_id)
      formData.append('no_folio', this.formAntilavado.no_folio)
      formData.append('full_expedient', this.formAntilavado.full_expedient)
      formData.append('month', this.formAntilavado.month)
      formData.append('person_object_send', this.formAntilavado.person_object_send)


    this.$store.dispatch('addAntilavado',formData).then(res => {
         this.$notify({
          title: 'Nuevo Registro',
          message: res.data.success,
          type: 'success',
          offset: 50
        });
             const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se agregó registro Antilavado')
        formAut.append('evento', 'addAntilavado()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
          this.btnloading = false
           this.dialogVisible = false;
    })

    // this.$store.dispatch("getDataAntilavado").then(res => {


    //       })

    },
    async updateAntilavado() {
       this.btnloading = true
      const formData = new FormData()
    formData.append('id', this.formAntilavado.id)
      formData.append('company_id', this.formAntilavado.get_company.id)
      formData.append('type', this.formAntilavado.type)
      formData.append('date_send', this.formAntilavado.date_send)
      formData.append('amount', this.formAntilavado.amount)
      formData.append('status_send', this.formAntilavado.status_send)
      formData.append('vulnerable_activity', this.formAntilavado.vulnerable_activity)
      formData.append('no_folio', this.formAntilavado.no_folio)
      formData.append('full_expedient', this.formAntilavado.full_expedient)
      formData.append('month', this.formAntilavado.month)
      formData.append('person_object_send', this.formAntilavado.person_object_send)


    this.$store.dispatch('updateAntilavado',formData).then(res => {
         this.$notify({
          title: 'Registro Actualizado',
          message: res.data.success,
          type: 'success',
          offset: 50
        });
          const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se modificó registro Antilavado')
        formAut.append('evento', 'updateAntilavado()')
       formAut.append('id_afectado', this.formAntilavado.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

          this.$root.$refs.LeyAntilavado.searchData();
          this.btnloading = false
           this.dialogVisible = false;
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
