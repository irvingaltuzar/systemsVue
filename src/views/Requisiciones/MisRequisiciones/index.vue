<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div class="nine">
        <h1>Mis Requisiciones<span>de Personal</span></h1>
      </div>
<el-table :data="MyRequisitions" border highlight-current-row style="" default-expand-all responsive class="table-responsive">
      <el-table-column  label="No." width="50"  property="id">
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
      <el-table-column width="130px" label="Sueldo" >
        <template slot-scope="scope">
      $ {{scope.row.salary}} M.N.
       </template>
      </el-table-column>
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
          <el-tooltip  v-if="!scope.row.status=='cancelada'" content="Cancelar" placement="top">
        <el-button type="danger" icon="el-icon-document-delete" @click="handleCancelarRequisition(scope)" circle></el-button>
        </el-tooltip>
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


    </el-card>
        <ModalRequisition  :key="componentKey" ref="ModalRequisition" />
        <viewFile  ref="viewFile" />

  </div>
</template>

<script>
import { mapGetters} from 'vuex'
import { deepClone } from '@/utils'
import ModalRequisition from './components/ModalRequisition'
import viewFile from '../components/viewFile'
// import moment from 'moment'
export default {
  components: { ModalRequisition,viewFile },

  data() {
    return {
       componentKey: 0,
      search: '',
      btnloading: false,
      btnloading2: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
    }
  },
  beforeMount() {
    this.$root.$refs.ViewHorariosPersonal = this
  },
   computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'MyRequisitions',
    ])
  },
  created() {
   this.$store.dispatch("getMyRequisitions");
      this.$store.dispatch('getEmailDomain');
  },
  methods: {
     forceRerender() {
      this.componentKey += 1;
    },
   handleValidateRequisition(scope) {

      this.$forceUpdate();
         const listArchivos = []
      // await this.$store.dispatch("getRequisitionValidationbyId",formData)

      //  this.$root.$refs.ModalRequisition.resetForm('formRequisition');
       if(scope.row.status == "recaudar firmas" || scope.row.status == "autorizada" || scope.row.status == "cancelada" || scope.row.status == "rechazada" ){
      this.$root.$refs.ModalRequisition.isDisabled=true;
      }else{
      this.$root.$refs.ModalRequisition.isDisabled=false;

      }
      this.$root.$refs.ModalRequisition.formRequisition= deepClone(scope.row);
         this.$root.$refs.ModalRequisition.handleChangeType(scope.row.type);
      this.$root.$refs.ModalRequisition.handleChangeTypeTemp(scope.row.type_vacancy);
        this.$root.$refs.ModalRequisition.handleChangeTravel(true);
      this.$root.$refs.ModalRequisition.formRequisition.reason_replacement=scope.row.reason_replacement;
      this.$root.$refs.ModalRequisition.search= scope.row.personal_substitution;
      this.$root.$refs.ModalRequisition.formRequisition.personal_substitution= scope.row.personal_substitution;
      this.$root.$refs.ModalRequisition.formRequisition.vacancy= scope.row.vacancy;

      this.$root.$refs.ModalRequisition.formRequisition.type_vacancy= scope.row.type_vacancy;
      this.$root.$refs.ModalRequisition.formRequisition.temp_reason= scope.row.temp_reason;
      if(scope.row.dmi_control_email_domain){
      this.$root.$refs.ModalRequisition.handleChangeEmail(true);

      }else{
          this.$root.$refs.ModalRequisition.handleChangeEmail(false);
      }

      if(scope.row.file!=null && scope.row.file !=""){
        listArchivos.push({ name: scope.row.file, url: scope.row.url })
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
       this.$store.dispatch('getCommading_staff_All');
        }

      this.$root.$refs.ModalRequisition.dialogType = 'new'
      this.$root.$refs.ModalRequisition.dialogVisible = true
    },
    async handleCancelarRequisition(scope){
        this.$confirm('Se cancelara requisición de personal, estas seguro de continuar?', 'Confirmar Cancelación', {
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          type: 'warning',
          center: true
        }).then(() => {

        const formData = new FormData()
        formData.append('id', scope.row.id)
           this.$store.dispatch('CancelRequisition',formData).then(res => {
            this.$message({
              message: res.data.success,
              type: 'success'
            })

              const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se canceló requisición')
        formAut.append('evento', 'handleCancelarRequisition()')
         formAut.append('id_afectado', scope.row.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
           })

        this.$store.dispatch("getMyRequisitions").then(res => {

          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Operación'
          // });
        });
      },
       handleFirmarRequisition(scope){
        // this.$confirm('Se cancelara requisición de personal, estas seguro de continuar?', 'Confirmar Cancelación', {
        //   confirmButtonText: 'Aceptar',
        //   cancelButtonText: 'Cancelar',
        //   type: 'warning',
        //   center: true
        // }).then(() => {

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
        formAut.append('comentarios', 'Se firmó requisición -> user: ' + this.$store.getters.user)
        formAut.append('evento', 'handleCancelarRequisition()')
         formAut.append('id_afectado', scope.row.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
           })

        this.$store.dispatch("getMyRequisitions");
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: 'Operación'
        //   });
        // });
      },
      viewFile(file){
        this.$root.$refs.ViewFile.ViewArchivo(file);
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

</style>
