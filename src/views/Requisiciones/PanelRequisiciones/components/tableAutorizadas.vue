<template>
<div>
 <div class="filter-container">
     <!--<el-input  v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>-->
     <el-input  v-model="search" @change="handleSearch" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    </div>
    <el-table v-loading="tblLoading" :data="RequisitionsAutRech"  border fit highlight-current-row style="width: 100%">
      <el-table-column   align="center" label="No." width="80" property="id">
      </el-table-column>
      <el-table-column width="130px" align="center" label="Fecha Solicitud" property="date">
        <template slot-scope="props">
     {{ props.row.date  }}
   </template>
      </el-table-column>
      <el-table-column width="150" align="center" label="Solicitante" property="user">
      </el-table-column>
       <el-table-column width="300px" align="center" label="Vacante" property="vacancy">
      </el-table-column>
      <el-table-column width="140px" align="center" label="Tipo" property="type">
      </el-table-column>
   <!--   <el-table-column width="130px" label="Sueldo" >
        <template slot-scope="{row}">
      $ {{row.salary}} M.N.
       </template>
      </el-table-column>-->
       <el-table-column min-width="165px" label="Estatus de Solicitud">
        <template slot-scope="{row}">
      <el-tag v-if="row.status=='cancelada'" type="danger" effects="dark">{{row.status}}</el-tag>
      <el-tag v-if="row.status=='rechazada'" type="danger" effects="dark">{{row.status}}</el-tag>
       <el-tag v-if="row.status=='autorizada'" type="success" effects="dark">{{row.status}}</el-tag>
       </template>
      </el-table-column>
       <el-table-column width="400px"  align="center" label="Estatus de reclutamiento">
        <template slot-scope="{row}">
          <template v-if="row.edit">
          <el-select v-model="row.dmi_cat_status_recruitment.description" filterable class="w-75" style="right:6%" clearable placeholder="seleccionar:">
              <el-option
                v-for="item in StatusRecruitment"
                :label="item.description"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancelar
            </el-button>
       </template>
       <el-tag v-else>{{row.dmi_cat_status_recruitment.description}}</el-tag>
       </template>
      </el-table-column>
         <el-table-column width="165px" label="Fecha de Cobertura" property="date_estimate_coverage">
      </el-table-column>
         <el-table-column width="400px" label="Ubicación" property="personal_location">
      </el-table-column>
       <el-table-column width="150px" align="center" label="Acciones">
       <template slot-scope="{row}">
         <el-tooltip v-if="row.edit" content="Detalles" placement="top">
          <el-button

            :loading="loading"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Guardar
          </el-button>
        </el-tooltip>
         <el-tooltip  v-else content="Detalles" placement="top">
          <el-button

            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit;row.disabled=!row.disabled"
          >
            Editar
          </el-button>
        </el-tooltip>

            <el-tooltip v-if="row.document" content="Ver Documento" placement="top">
         <el-button icon="el-icon-view" circle @click="viewFile(row.document_url)"></el-button>
            </el-tooltip>
          </template>

      </el-table-column>

    </el-table>
    <!--<ModalRequisition ref="ModalRequisition" />-->
<pagination v-show="total>0" :total="total" :page-sizes="[100,200,500]" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="ConsultaRequisitions" />

  </div>
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
      loading: false,
      tblLoading:false,
      search:'',
     total: 0, 
    }
  },
   computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'RequisitionsAutRech',
      'StatusRecruitment'
    ])
  },
  created() {
     this.tblLoading=true;
      const formData = new FormData()
       formData.append('pagina',this.listQuery.page)
      formData.append('limite',this.listQuery.limit)
      this.$store.dispatch("getAutRechPersonalRequisitions",formData ).then(res=>{ 
      this.total=res.total
      this.tblLoading=false;
    });
      this.$store.dispatch('getEmailDomain');
      this.$store.dispatch('getStatusRecruitment');
  },
  methods: {
    ConsultaRequisitions(){
       this.tblLoading=true;
  const formData = new FormData()
       formData.append('pagina',this.listQuery.page)
      formData.append('limite',this.listQuery.limit)
      this.$store.dispatch("getAutRechPersonalRequisitions",formData ).then(res=>{ 
      this.total=res.total
      this.tblLoading=false;

    });
    },
    handleSearch() {
 this.tblLoading=true;
 if(this.search!=""){
  const formData = new FormData()
      formData.append('search',this.search)
    this.$store.dispatch("getAutRechPersonalRequisitionsSearch",formData).then(res=>{ 
     this.total=res.total
       this.tblLoading=false;
    });
 }else{
      this.ConsultaRequisitions();
 }
    },
    
 async handleValidateRequisition(scope) {

         const listArchivos = []
          this.$forceUpdate();
          
        this.$root.$refs.ModalRequisition.handleChangeTravel(true);
      this.$root.$refs.ModalRequisition.formRequisition= deepClone(scope.row);
      this.$root.$refs.ModalRequisition.handleChangeType(scope.row.type);
      this.$root.$refs.ModalRequisition.handleChangeTypeTemp(scope.row.type_vacancy);
      this.$root.$refs.ModalRequisition.search= scope.row.personal_substitution;
       this.$root.$refs.ModalRequisition.formRequisition.reason_replacement=scope.row.reason_replacement;
      this.$root.$refs.ModalRequisition.search= scope.row.personal_substitution;
      this.$root.$refs.ModalRequisition.formRequisition.personal_substitution= scope.row.personal_substitution;
      this.$root.$refs.ModalRequisition.formRequisition.vacancy= scope.row.vacancy;
      this.$root.$refs.ModalRequisition.formRequisition.user= scope.row.user;
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
      this.$root.$refs.ModalRequisition.dialogType = 'edit'
      this.$root.$refs.ModalRequisition.dialogVisible = true

    },
    viewFile(file){
        this.$root.$refs.ViewFile.ViewArchivo(file);
      },
          cancelEdit(row) {
      row.description = row.originaldescripcion
      row.deleted = row.originalborrado
      row.edit = false
      row.disabled = true
      this.$message({
        message: 'No se ha realizado ningun cambio',
        type: 'warning'
      })
    },
    async confirmEdit(row) {
      this.loading = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}

      const formData = new FormData()
      formData.append('status_recruitment_id', row.dmi_cat_status_recruitment.description)
      formData.append('id', row.id)
      // formData.append('deleted', row.deleted)
      // console.log(row.dmi_cat_status_recruitment.description)
      await Api.post('/personalRequisition/updateStatusRecruitment', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status

          row.edit = false
        row.disabled = true
        row.originaldescripcion = row.description
        this.tblLoading=true;
      this.$store.dispatch("getAutRechPersonalRequisitions");
        this.tblLoading=false;
        this.$notify({
          title: 'Requisicion Actualizada',
          message: currentObj.res.success,
          type: 'success',
          offset: 50
        });

      const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se actualizo estatus reclutamiento requisición -> ' + row.dmi_cat_status_recruitment.description)
        formAut.append('evento', 'updateStatusRecruitment()')
         formAut.append('id_afectado',  row.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
      }).catch(function(error) {
         this.$message({
          message: 'Ocurrio un error en el proceso',
          type: 'error'
        })
      })

        this.loading = false

    },

  }
}
</script>

<style scoped>

</style>
