<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <el-row type="flex">
          <el-col class="m-1 col-sm-12 col-md-6 col-sm-12">
            <h3>Ley de Antilavado</h3>
          </el-col>
          <el-col class="m-1 col-sm-12 col-md-6 col-sm-12">
            <el-button  style="margin-left: 20px;" type="primary" icon="el-icon-s-custom" @click="handleAddRecord" plain>Crear Nuevo</el-button>
            <el-tooltip class="item" effect="dark" content="Carga de Masiva" placement="bottom">
              <el-button  style="margin-left: 20px;" type="primary" icon="el-icon-upload" @click="showModalCargaMasiva()" plain> Carga de Masiva</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Plantilla" placement="bottom">
              <!-- <el-button  style="margin-left: 20px;" type="primary" icon="el-icon-document-checked" href="/PLANTILLA%20-%20LEY%20ANTILAVADO.xlsx" plain> Plantilla </el-button> -->
              <el-link style="margin-left: 20px;"  icon="el-icon-download" href="/PLANTILLA%20-%20LEY%20ANTILAVADO.xlsx" target="_blank">Plantilla</el-link>
            </el-tooltip>


          </el-col>
        </el-row>
      </div>
      <br>

    <div class="filter-container">
      <span class="mr-1" style="margin-right: -30px;margin-top: 3px;font-size: 18px;">Reporte de </span>
      <el-input v-model="search"  clearable style="width: 30%;" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>

      <el-date-picker
       class="ml-2"
       style="width: 10%;"
        v-model="year"
        type="year"
        value-format="yyyy"
        placeholder="Año:">
      </el-date-picker>
      <el-select v-model="month" filterable class="mr-2" style="width: 10%;margin-left: 20px;"  clearable placeholder="seleccionar:">
                <el-option
                  v-for="item in arrYear"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

      <el-button class="mr-2" style="" type="primary" icon="el-icon-search" @click="searchData" circle></el-button>
      <!-- <label style="float: right;margin-right: -30px;margin-top: 3px;font-size: 18px; font-style: oblique;font-family: math;">Reporte de </label><br>

      <label style="float: right;margin-right: 30px;margin-top: 3px;font-size: 18px; font-style: oblique;font-family: math;">Información de {{mes}} de {{ye}}</label><br>
 -->
    </div>
    <!-- <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-upload" @click="" plain> Carga Masiva </el-button>
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-document-checked" @click="" plain>Plantilla </el-button>
    </div> -->

<br>
<el-table :data="dataAntilavado.filter(data => !search || (data.month && data.month.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
(data.type && data.type.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
(data.no_folio && data.no_folio.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
(data.get_company.manager_name && data.get_company.manager_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
(data.get_company.business_name && data.get_company.business_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
(data.person_object_send && data.person_object_send.toLowerCase().indexOf(this.search.toLowerCase()) > -1))" v-loading="tblLoading" border highlight-current-row style="" default-expand-all responsive class="table-responsive">
      <el-table-column  label="No." width="50" >
       <template v-if="scope.row.get_company!== null" slot-scope="scope">
        {{scope.row.get_company.id}}
        </template>
         <template v-else slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="Empresa"  property="">
        <template v-if="scope.row.get_company !== null" slot-scope="scope">
        {{scope.row.get_company.business_name}}
        </template>
         <template v-else slot-scope="scope">
        </template>
      </el-table-column>
            <el-table-column width="200" align="center" label="Gerente"  >
              <template v-if="scope.row.get_company!== null" slot-scope="scope">
        {{scope.row.get_company.manager_name}}
        </template>
        <template v-else slot-scope="scope">
        </template>
      </el-table-column>
         <el-table-column width="140" align="center" label="Mes"  property="month">
      </el-table-column>
        <el-table-column width="140" align="center" label="Fecha envío"  property="date_send">
          <template slot-scope="props">
     {{ props.row.date_send | moment("DD-MM-YYYY") }}
   </template>
      </el-table-column>
      <el-table-column width="150" align="center" label="Tipo de aviso" property="type">
      </el-table-column>
      <el-table-column  label="No Folio" width="110" property="no_folio">
      </el-table-column>
       <el-table-column min-width="300" label="Persona Objecto del aviso" property="person_object_send">
      </el-table-column>
            <el-table-column min-width="150" label="Monto">
             <template slot-scope="scope">
            $ {{  formatPrice(scope.row.amount) }}
             </template>
      </el-table-column>
       <el-table-column min-width="150" align="center" label="Estatus">
       <template slot-scope="scope">
       <el-tag v-if="scope.row.status_send=='NO ACEPTADO'" type="danger" effects="dark">{{scope.row.status_send}}</el-tag>
       <el-tag v-if="scope.row.status_send=='ESPERA'" type="warning" effects="dark">{{scope.row.status_send}}</el-tag>
       <el-tag v-if="scope.row.status_send=='PENDIENTE'" type="warning" effects="dark">{{scope.row.status_send}}</el-tag>
       <el-tag v-if="scope.row.status_send=='ACEPTADO'" type="success" effects="dark">{{scope.row.status_send}}</el-tag>
       <el-tag v-if="scope.row.status_send=='No Aplica'" type="info" effects="dark">{{scope.row.status_send}}</el-tag>
       </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" label="Expediente Completo" property="full_expedient">
      </el-table-column>
            <el-table-column min-width="220" align="center" label="Actividad Vulnerable" property="vulnerable_activity">
      </el-table-column>
       <el-table-column width="130"  fixed="right"  align="center" label="Acciones">
         <template slot-scope="scope">

            <el-tooltip content="Editar" placement="top">
        <el-button type="primary" icon="el-icon-edit" @click="handleEditRecord(scope)" circle></el-button>
        </el-tooltip>
          </template>
      </el-table-column>

    </el-table>

    <ModalAntilavado ref="ModalAntilavado" />
    <modalCargaMasiva ref="modalCargaMasiva" />
    </el-card>

  </div>
</template>

<script>
import { mapGetters} from 'vuex'
import { deepClone } from '@/utils'
import ModalAntilavado from './components/ModalAntilavado'
import modalCargaMasiva from './components/modalCargaMasiva'
import moment from 'moment'
export default {
  components: { ModalAntilavado,modalCargaMasiva },

  data() {
    return {
       componentKey: 0,
      search: '',
      year:'',
      month:'',
      mes:'',
      ye:'',
      tblLoading:false,
      btnloading: false,
      btnloading2: false,
      dialog_carga_masiva: false,
      dataAntilavado:[],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
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
    }
  },
  beforeMount() {
    this.$root.$refs.LeyAntilavado = this
  },
   computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'MyRequisitions',
    ])
  },
  created() {
  },
  methods: {
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace(',', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
     forceRerender() {
      this.componentKey += 1;
    },
  async searchData(){
      this.tblLoading= true;
   const formData = new FormData()
        formData.append('year', this.year)
        formData.append('month', this.month)
    await this.$store.dispatch('searchDataAntilavado',formData).then(res => {
      const data= res.data.data
      this.ye= res.data.year;
      this.mes= res.data.month;
           this.dataAntilavado=data;
            this.tblLoading=false;
           })
    },
   handleAddRecord() {
      this.$root.$refs.ModalAntilavado.dialogVisible = true
      this.$root.$refs.ModalAntilavado.dialogType = 'new'
      this.$root.$refs.ModalAntilavado.resetForm();

    },

       handleEditRecord(scope){

         this.$root.$refs.ModalAntilavado.formAntilavado= deepClone(scope.row);
        this.$root.$refs.ModalAntilavado.dialogType = 'edit'
      this.$root.$refs.ModalAntilavado.dialogVisible = true

      },

    showModalCargaMasiva(){
      this.$refs.modalCargaMasiva.clearFormBulkLoad();
      this.$refs.modalCargaMasiva.dialog_form_visible = true;
    }

  }
}
</script>

<style lang="scss" scoped>
/* Style 9
   ----------------------------- */
.nine h1 {
  text-align:center; font-size:25px; text-transform:uppercase; color:#222; letter-spacing:1px;
  font-family:Helvetica,Arial,sans-serif; font-weight:400;
}
.nine h1 span {
  margin-top: 5px;
    font-size:13px; color:#444; word-spacing:1px; font-weight:normal; letter-spacing:2px;
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
.buscador{
  width: 30%;
  float: right;
}
</style>
