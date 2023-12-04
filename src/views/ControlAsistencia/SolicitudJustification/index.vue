<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div class="nine">
        <h1>Mis Justificaciones<span>-</span></h1>
      </div>
      <div class="filter-container">
        <el-input v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
       <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-s-claim" plain @click="handleJustification">Solicitar</el-button>
      </div>
      <div class="filter-container" />
      <el-table
        v-loading="listLoading"
        :data="MyJustifications.filter(data => !search || data.description.toLowerCase().includes(search.toLowerCase()) )"
        style="width: 100%;"
        border
      >
       <el-table-column  align="center" label="No." width="80" prop="id">
        </el-table-column>
          <el-table-column align="center" label="Status" width="110">
          <template slot-scope="scope">
            <el-tag   v-if="scope.row.approved_by==null && scope.row.status==null" type="warning" effect="dark">Pendiente</el-tag>
           <el-tooltip v-if="scope.row.approved_by!=null && scope.row.status==0" :content="'por: '+scope.row.approved_by" placement="top">
               <el-tag  type="danger" effect="dark">Rechazada</el-tag>
            </el-tooltip>
            <el-tooltip v-if="(scope.row.approved_by!=null && scope.row.status==1) || (scope.row.type_id==6)" :content="'por: '+scope.row.approved_by" placement="top">
               <el-tag  type="success" effect="dark">Autorizado</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="Fecha" width="150" prop="date">
        </el-table-column>
  <el-table-column  align="center" label="Tipo" width="220" >
   <template slot-scope="scope">
            {{ scope.row.dmirh_cat_type_justification.description }}
          </template>
  
        </el-table-column>
        <el-table-column  label="Descripción" width="700" prop="description">
        </el-table-column>
       
    <el-table-column fixed='right' align="center" label="Acciones" width="115">
          <template slot-scope="scope">
            <el-tooltip content="Detalles" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle :loading="btnloading" @click="handleDetailJustification(scope)" />
            </el-tooltip>
           
          </template>
        </el-table-column>
      </el-table>
    </el-card>
 <ModalJustification ref="ModalJustification" />
  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'
import ModalJustification from './components/ModalJustification'
import { mapGetters} from 'vuex'
export default {
  components: {
  ModalJustification
  },
  data() {
    return {
      search: '',
      listLoading:false,
      btnloading: false,
      btnloading2: false
    }
  },
  beforeMount() {
    // this.$refs.ViewHorariosPersonal = this
  },
  created() {
        this.listLoading=true;

      this.$store.dispatch('getMyJustifications').then(res =>{
        this.listLoading=false;
      });
  },
computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'MyJustifications',
    ])
  },
  methods: {

    handleJustification() {
      this.$refs.ModalJustification.resetForm()
      this.$refs.ModalJustification.dialogType = 'new'
      this.$refs.ModalJustification.dialogVisible = true
      this.$refs.ModalJustification.isDisabled =false;
    },

 handleDetailJustification(scope){
         const listArchivos = []
      this.$refs.ModalJustification.ruleForm.typeJus = scope.row.dmirh_cat_type_justification.description
      this.$refs.ModalJustification.ruleForm.Comentarios = scope.row.description
      this.$refs.ModalJustification.ruleForm.FechaInicio = scope.row.date
       if(scope.row.file!=null && scope.row.file !=""){
        listArchivos.push({ name: scope.row.file, url: scope.row.file_url })
            this.$refs.ModalJustification.fileList = listArchivos
      }else{
         this.$refs.ModalJustification.fileList=[];
      }
      this.$refs.ModalJustification.isDisabled =true;
      this.$refs.ModalJustification.dialogType = 'edit'
      this.$refs.ModalJustification.dialogVisible = true
    },
    async rechazarHorario(IdTime) {
      const currentObj = this
      const id = IdTime
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('IdTime', id)

      await Api.post('/controlAsistencia/rechazarHorarioPersonal', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se rechazó Horario con Id' + id)
        formAut.append('evento', 'autorizarHorario()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$notify({
          title: 'Proceso Exitoso',
          message: currentObj.res['success'],
          type: 'success'
        })
        this.btnloading = false
        this.getHorariosPersonal()
      }
    }

  }
}
</script>

<style lang="scss" scoped>
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
