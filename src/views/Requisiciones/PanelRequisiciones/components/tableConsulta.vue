<template>
<div>
 <div class="filter-container">
      <el-input  v-model="search" @change="handleSearch" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    </div>
    <el-table v-loading="listLoading" :data="RequisitionsConsulta"  border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="No." width="80" property="id">
      </el-table-column>
      <el-table-column width="130px" align="center" label="Fecha Solicitud" >
       <template slot-scope="props">
     {{ props.row.date}}
   </template>
      </el-table-column>
       <el-table-column width="300px" align="center" label="Vacante" >
         <template slot-scope="scope">
       {{scope.row.vacancy}} 
       </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="Tipo" >
      <template slot-scope="scope">
       {{scope.row.type}} 
       </template>
      </el-table-column>
     <!-- <el-table-column width="130px" label="Sueldo" >
        <template slot-scope="scope">
      $ {{scope.row.salary}} M.N.
       </template>
      </el-table-column>-->
       <el-table-column min-width="165px" label="Estatus de Solicitud">
        <template slot-scope="scope">
      <el-tag v-if="scope.row.status=='cancelada'" type="danger" effects="dark">{{scope.row.status}}</el-tag>
      <el-tag v-if="scope.row.status=='rechazada'" type="danger" effects="dark">{{scope.row.status}}</el-tag>
       <el-tag v-if="scope.row.status=='recaudar firmas'" type="warning" effects="dark">{{scope.row.status}}</el-tag>
       <el-tag v-if="scope.row.status=='autorizada'" type="success" effects="dark">{{scope.row.status}}</el-tag>
       <el-tag v-if="scope.row.status=='validacion'" type="info" effects="dark">{{scope.row.status}}</el-tag>
       </template>
      </el-table-column>
       <el-table-column width="195px"  label="Estatus de reclutamiento">
        <template slot-scope="scope">
       <el-tag v-if="scope.row.dmi_cat_status_recruitment!=null">{{scope.row.dmi_cat_status_recruitment.description}}</el-tag>
       </template>
      </el-table-column>
         <el-table-column width="165px" label="Fecha de Cobertura" >
             <template slot-scope="scope">
       {{scope.row.date_estimate_coverage}} 
       </template>
      </el-table-column>
       <el-table-column  min-width="150px" align="center" label="Acciones">
        <template slot-scope="scope">
         <el-tooltip content="Detalles" placement="top">
        <el-button type="primary" icon="el-icon-edit" @click="handleValidateRequisition(scope)" circle></el-button>
        </el-tooltip>
            <el-tooltip v-if="scope.row.document" content="Ver Documento" placement="top">
         <el-button icon="el-icon-view" circle @click="viewFile(scope.row.document_url)"></el-button>
            </el-tooltip>
              <el-tooltip v-if="scope.row.status=='recaudar firmas'" content="Generar Documento Temporal" placement="top">
         <el-button icon="el-icon-edit-outline" type="warning" circle @click="GenerateRequisitionTemp(scope.row.id)"></el-button>
            </el-tooltip>
          </template>

      </el-table-column>

    </el-table>
    <!--<ModalRequisition ref="ModalRequisition" />-->
<pagination v-show="total>0" :total="total" :page-sizes="[100,200,500]" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="ConsultaRequisitions" />

  </div>
  
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import viewFile from '../../components/viewFile'
import { mapGetters} from 'vuex'
import ModalRequisition from './ModalRequisition'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { deepClone } from '@/utils'
// import moment from 'moment'
export default {
  name: 'tableConsulta',
  components: { ModalRequisition,viewFile,Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 100,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      search:'',
      listLoading:false,
      total: 0, 
    }
  },
   computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'RequisitionsConsulta',
    ])
  },
  created() {
       this.listLoading=true;
    const formData = new FormData()
       formData.append('pagina',this.listQuery.page)
      formData.append('limite',this.listQuery.limit)
      this.$store.dispatch("getConsultaPersonalRequisitions",formData ).then(res=>{ 
      this.total=res.total
          this.listLoading=false;
    });
      this.$store.dispatch('getEmailDomain');
  },
  methods: {
    ConsultaRequisitions(){
       this.listLoading=true;
  const formData = new FormData()
       formData.append('pagina',this.listQuery.page)
      formData.append('limite',this.listQuery.limit)
      this.$store.dispatch("getConsultaPersonalRequisitions",formData ).then(res=>{ 
      this.total=res.total
      this.listLoading=false;

    });
    },
     handleSearch() {
 this.listLoading=true;
 if(this.search!=""){
  const formData = new FormData()
      formData.append('search',this.search)
    this.$store.dispatch("getConsultaPersonalRequisitionsSearch",formData).then(res=>{ 
     this.total=res.total
       this.listLoading=false;
    });
 }else{
      this.ConsultaRequisitions();
 }
    },
 async handleValidateRequisition(scope) {
          //  const formData = new FormData()
      // formData.append('id',id)
         const listArchivos = []
          this.$forceUpdate();
     
        this.$root.$refs.ModalRequisition.handleChangeTravel(true);
      this.$root.$refs.ModalRequisition.formRequisition= deepClone(scope.row);
      this.$root.$refs.ModalRequisition.handleChangeType(scope.row.type);

      this.$root.$refs.ModalRequisition.formRequisition.vacancy= scope.row.vacancy;
      this.$root.$refs.ModalRequisition.formRequisition.user= scope.row.user;
          this.$root.$refs.ModalRequisition.formRequisition.type_vacancy= scope.row.type_vacancy;
      this.$root.$refs.ModalRequisition.handleChangeTypeTemp(scope.row.type_vacancy);
             this.$root.$refs.ModalRequisition.formRequisition.reason_replacement=scope.row.reason_replacement;
      this.$root.$refs.ModalRequisition.search= scope.row.personal_substitution;
      this.$root.$refs.ModalRequisition.formRequisition.personal_substitution= scope.row.personal_substitution;
         this.$root.$refs.ModalRequisition.formRequisition.temp_reason= scope.row.temp_reason;
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
    viewFile(file){
        this.$root.$refs.ViewFile.ViewArchivo(file);
      },
     async GenerateRequisitionTemp(id){
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('id',id)
    await Api.post('/personalRequisition/GenerateRequisitionTemp',formData, config).then(res => {
      // console.log(res)
        this.$root.$refs.ViewFile.ViewArchivo(res.data.url);
      })
      
      }
  }
}
</script>

<style scoped>

</style>
