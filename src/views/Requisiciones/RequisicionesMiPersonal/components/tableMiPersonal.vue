<template>
<div >
   <div class="filter-container">
     <el-input  v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    </div>
<el-table v-loading="listLoading" :data="RequisitionsMyPersonal.filter(data => !search || data.id.toString().includes(search.toString()) ||  (data.user && data.user.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
(data.date && data.date.toLowerCase().indexOf(this.search.toLowerCase()) > -1) || (data.vacancy && data.vacancy.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
||  (data.type && data.type.toLowerCase().indexOf(this.search.toLowerCase()) > -1))" border highlight-current-row style="" default-expand-all responsive class="table-responsive">
      <el-table-column  label="No." width="50"  property="id">
      </el-table-column>
        <el-table-column width="140" align="center" label="Usuario"  property="user">
      </el-table-column>
      <el-table-column width="140" align="center" label="Fecha Solicitud"  property="date">
           <template slot-scope="props">
     {{ props.row.date }}
   </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="Vacante" property="vacancy">
      </el-table-column>
      <el-table-column class-name="status-col" label="Tipo" width="130" property="type">
      </el-table-column>
       <!--<el-table-column min-width="80" label="Sueldo" property="salary">
      </el-table-column>-->
       <el-table-column min-width="150" align="center" label="Estatus">
       <template slot-scope="scope">
       <el-tag v-if="scope.row.status=='cancelada'" type="danger" effects="dark">{{scope.row.status}}</el-tag>
        <el-tag v-if="scope.row.status=='rechazada'" type="danger" effects="dark">{{scope.row.status}}</el-tag>
       <el-tag v-if="scope.row.status=='recaudar firmas'" type="warning" effects="dark">{{scope.row.status}}</el-tag>
       <el-tag v-if="scope.row.status=='autorizada'" type="success" effects="dark">{{scope.row.status}}</el-tag>
       <el-tag v-if="scope.row.status=='validacion'" type="info" effects="dark">{{scope.row.status}}</el-tag>
       </template>
      </el-table-column>
         <el-table-column min-width="250" align="center" label="Estatus reclutamiento">
       <template slot-scope="scope">
       <el-tag v-if="scope.row.dmi_cat_status_recruitment!=null" effects="dark">{{scope.row.dmi_cat_status_recruitment.description}}</el-tag>
       </template>
      </el-table-column>
      <el-table-column min-width="250" align="" label="Fecha Cobertura">
       <template slot-scope="scope">
       <el-tag>{{scope.row.date_estimate_coverage}}</el-tag>
       </template>
      </el-table-column>
       <el-table-column min-width="160"  fixed="right"  align="center" label="Acciones">
         <template slot-scope="scope">
            <el-tooltip content="Detalles" placement="top">
        <el-button type="primary" icon="el-icon-edit" @click="handleValidateRequisition(scope)" circle></el-button>
        </el-tooltip>
         <el-tooltip content="Firmar" v-if="scope.row.status=='recaudar firmas' && scope.row.sign_status=='pendiente'"  placement="top">
        <el-button type="primary" icon="el-icon-edit-outline" @click="handleFirmarRequisition(scope)" circle></el-button>
                </el-tooltip>
         <el-tooltip v-if="scope.row.document" content="Ver Documento" placement="top">
         <el-button icon="el-icon-view" circle @click="viewFile(scope.row.document_url)"></el-button>
            </el-tooltip>
          </template>
      </el-table-column>

    </el-table>
  </div>

</template>

<script>
import { mapGetters} from 'vuex'
import ModalRequisition from './ModalRequisition'
import { deepClone } from '@/utils'
// import moment from 'moment'

export default {
  name: 'tableMiPersonal',
  components: { ModalRequisition },
  data() {
    return {
      search:'',
      listLoading:false,
    }
  },
  computed: {
    // mix the getters into computed with object spread operator
     ...mapGetters([
      'RequisitionsMyPersonal',
    ])
  },
  created() {
   this.$store.dispatch("getRequisitionsMyPersonal");
      this.$store.dispatch('getEmailDomain');
  },
  methods: {
   async handleValidateRequisition(scope) {
          //  const formData = new FormData()
      // formData.append('id',id)
         const listArchivos = []
      // await this.$store.dispatch("getRequisitionValidationbyId",formData)
        this.$root.$refs.ModalRequisition.handleChangeTravel(true);
      this.$root.$refs.ModalRequisition.formRequisition= deepClone(scope.row);
      this.$root.$refs.ModalRequisition.formRequisition.vacancy= scope.row.vacancy;
      this.$root.$refs.ModalRequisition.handleChangeType(scope.row.type);
      this.$root.$refs.ModalRequisition.handleChangeTypeTemp(scope.row.type_vacancy);
      this.$root.$refs.ModalRequisition.search= scope.row.personal_substitution;
      this.$root.$refs.ModalRequisition.formRequisition.personal_substitution= scope.row.personal_substitution;
      this.$root.$refs.ModalRequisition.formRequisition.reason_replacement= scope.row.reason_replacement;
      this.$root.$refs.ModalRequisition.formRequisition.type_vacancy= scope.row.type_vacancy;
      this.$root.$refs.ModalRequisition.formRequisition.temp_reason= scope.row.temp_reason;
      if(scope.row.dmi_control_email_domain){
      this.$root.$refs.ModalRequisition.handleChangeEmail(true);

      }else{
          this.$root.$refs.ModalRequisition.handleChangeEmail(false);
      }
      if(scope.row.file){
        listArchivos.push({ name: scope.row.file, url: scope.row.url })
         this.$root.$refs.ModalRequisition.fileList = listArchivos
      }

      var reso=Object.values(scope.row.resources);
      this.$root.$refs.ModalRequisition.formRequisition.resources= reso;
      if( scope.row.time_travel ){
        this.$root.$refs.ModalRequisition.chktravel=true;
      }
      if(scope.row.status == "Recaudar Firmas" || scope.row.status == "autorizado" || scope.row.status == "Cancelada"){
      this.$root.$refs.ModalRequisition.isDisabled=true;
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
      this.$root.$refs.ModalRequisition.dialogType = 'new'
      this.$root.$refs.ModalRequisition.higher = true;
      this.$root.$refs.ModalRequisition.dialogVisible = true

    },
  
       handleFirmarRequisition(scope){
        // this.$confirm('Se cancelara requisición de personal, estas seguro de continuar?', 'Confirmar Cancelación', {
        //   confirmButtonText: 'Aceptar',
        //   cancelButtonText: 'Cancelar',
        //   type: 'warning',
        //   center: true
        // }).then(() => {
      this.listLoading=true;
        const formData = new FormData()
        formData.append('id', scope.row.id)
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
         formAut.append('id_afectado', scope.row.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

           })

        this.$store.dispatch("getRequisitionsMyPersonal").then(res => {
        this.listLoading=false;

        });
      },
      viewFile(file){
        this.$root.$refs.ViewFile.ViewArchivo(file);
      }
  }
}
</script>

<style scoped>

</style>
