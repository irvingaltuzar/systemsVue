<template>
<div >
<div class="filter-container">
     <el-input  v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    </div>
    <el-table :data="RequisitionValidation.filter(data => !search || data.id.toString().includes(search.toString()) ||  data.department.toLowerCase().includes(search.toLowerCase()) ||
     data.user.toLowerCase().includes(search.toLowerCase()) ||  (data.type && data.type.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
     (data.vacancy && data.vacancy.toLowerCase().indexOf(this.search.toLowerCase()) > -1) || (data.estimate && data.estimate.toLowerCase().indexOf(this.search.toLowerCase()) > -1) 
      || data.date.toLowerCase().includes(search.toLowerCase()) || data.status.toLowerCase().includes(search.toLowerCase()))" border highlight-current-row style="" default-expand-all responsive class="table-responsive">
      <el-table-column  label="No." width="50"  property="id">
      </el-table-column>
      <el-table-column width="140" align="center" label="Fecha Solicitud"  property="date" >
      <template slot-scope="props">
     {{ props.row.date }}
   </template>
      </el-table-column>
      <el-table-column width="150" align="center" label="Solicitante" property="user">
      </el-table-column>
      <el-table-column width="350" align="center" label="Departamento" property="department">
      </el-table-column>
      <el-table-column width="300" align="center" label="Vacante" property="vacancy">
      </el-table-column>
      <el-table-column class-name="status-col" label="Tipo" width="130" property="type">
      </el-table-column>
      <el-table-column min-width="120" label="Presupuesto" property="estimate">
      </el-table-column>
      <!-- <el-table-column min-width="120" label="Sueldo" property="salary">
          <template slot-scope="{row}">
      $ {{row.salary}} M.N.
       </template>
      </el-table-column>-->
       <el-table-column min-width="120" align="center" label="Estatus">
       <template slot-scope="scope">
       <el-tag>{{scope.row.status}}</el-tag>
       </template>
      </el-table-column>
       <el-table-column min-width="130" align="center" label="Acciones">
         <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" @click="handleValidateRequisition(scope)" circle></el-button>
          </template>
      </el-table-column>

    </el-table>
    <!--<ModalRequisition ref="ModalRequisition" />-->

  </div>

</template>

<script>
import { mapGetters} from 'vuex'
import ModalRequisition from './ModalRequisition'
import { deepClone } from '@/utils'
// import moment from 'moment'
export default {
  name: 'tableValidation',
  components: { ModalRequisition },
  filters: {
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'info',
    //     deleted: 'danger'
    //   }
    //   return statusMap[status]
    // }
  },
  data() {
    return {
      // total: 0,
      // listLoading: true,
      // listQuery: {
      //   page: 1,
      //   limit: 20
      // }
      search:''
    }
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'RequisitionValidation',
    ])
  },
  created() {
   this.$store.dispatch("getRequisitionValidation");
   this.$store.dispatch("getSuperValidator");
      this.$store.dispatch('getEmailDomain');
  },
  methods: {
      formatColDate (row, col, value, index) {
      // return moment(value).Format("yyyy-mm-dd");
 return this.formatDate(value)
      },
     async handleValidateRequisition(scope) {
          //  const formData = new FormData()
      // formData.append('id',id)
         const listArchivos = []
          this.$forceUpdate();
          
      // await this.$store.dispatch("getRequisitionValidationbyId",formData)
        this.$root.$refs.ModalRequisition.handleChangeTravel(true);
      this.$root.$refs.ModalRequisition.formRequisition= deepClone(scope.row);
      this.$root.$refs.ModalRequisition.handleChangeType(scope.row.type);
    // this.$root.$refs.ModalRequisition.formRequisition.date= scope.row.date;
      this.$root.$refs.ModalRequisition.formRequisition.vacancy= scope.row.vacancy;
      this.$root.$refs.ModalRequisition.formRequisition.type_vacancy= scope.row.type_vacancy;
      this.$root.$refs.ModalRequisition.handleChangeTypeTemp(scope.row.type_vacancy);
     this.$root.$refs.ModalRequisition.formRequisition.reason_replacement=scope.row.reason_replacement;
     
      this.$root.$refs.ModalRequisition.formRequisition.temp_reason= scope.row.temp_reason;
      this.$root.$refs.ModalRequisition.formRequisition.days_temp_reason= scope.row.days_temp_reason;

      if(scope.row.dmi_control_email_domain){
      this.$root.$refs.ModalRequisition.handleChangeEmail(true);

      }else{
          this.$root.$refs.ModalRequisition.handleChangeEmail(false);
      }
     if(scope.row.file!=null && scope.row.file !=""){
        listArchivos.push({ name: scope.row.file, url: scope.row.file_url })
         this.$root.$refs.ModalRequisition.fileList = listArchivos
      }else{
         this.$root.$refs.ModalRequisition.fileList=[];
      }

 
      var reso=Object.values(scope.row.resources);
      this.$root.$refs.ModalRequisition.formRequisition.resources= reso;
      if( scope.row.time_travel ){
        this.$root.$refs.ModalRequisition.chktravel=true;
      }

      if(scope.row.type=="Reemplazo"){
            if(scope.row.personal_substitution !== null && scope.row.personal_substitution !== "null"){
      this.$root.$refs.ModalRequisition.formRequisition.personal_substitution= scope.row.personal_substitution;
     this.$root.$refs.ModalRequisition.search= scope.row.personal_substitution;

        }else{
      this.$root.$refs.ModalRequisition.formRequisition.plaza_id= scope.row.plaza_id;
     this.$root.$refs.ModalRequisition.search= scope.row.plaza_id;

        }
            const formData = new FormData()
      formData.append('user', scope.row.user)
    this.$store.dispatch('getCommading_staff_All_Panel',formData);
          }
    this.$root.$refs.ModalRequisition.dialogType = 'edit'
      this.$root.$refs.ModalRequisition.dialogVisible = true

    },
    handleCancelRequisition(scope){

    }
  }
}
</script>

<style scoped>

</style>
