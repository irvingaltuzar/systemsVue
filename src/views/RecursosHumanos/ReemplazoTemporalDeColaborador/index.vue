<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="end">
          <el-col class="m-1 col-md-10 col-sm-12">
            <h3>Delegar Permisos de Colaborador</h3>
          </el-col>
          <el-col class="m-1 col-md-2 col-sm-12 text-right">
            <el-button type="success" @click="showDialogAsignacion()"> <i class="fa-solid fa-circle-plus"></i></el-button>
          </el-col>
        </el-row>
      </div>

      <el-row class="m-1" type="flex" justify="end">
        <el-col class="m-1 col-md-4 col-sm-12">
          <el-input placeholder="Buscar..." v-model="headers.search" @input="getList()"></el-input>
        </el-col>
        <el-col class="m-1 col-md-2 col-sm-12" >
          <el-select v-model="headers.order_by" placeholder="Ordenar" @change="getList()">
            <el-option label="Ascendente" value="desc"></el-option>
            <el-option label="Descendente" value="asc"></el-option>
          </el-select>
        </el-col>
        <el-col class="m-1 col-md-2 col-sm-12">
          <el-select v-model="headers.limit" placeholder="Mostrar" @change="getList()">
            <el-option label="20" value="20"></el-option>
            <el-option label="50" value="50"></el-option>
            <el-option label="100" value="100"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <br>

      <el-table
        class="m-1"
        style="width: 100%"
        :data="general_data.data"
        v-loading="loading_get_list">
        <el-table-column
          prop="replaced"
          label="Delegado actual">
            <template slot-scope="scope">
              <span >{{scope.row.replaced.full_name}}</span>
            </template>
        </el-table-column>
        <el-table-column
          prop="replace_collaborator"
          label="Delegado designado">
          <template slot-scope="scope">
              <span >{{scope.row.replace.full_name}}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="Acciones">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Eliminar" placement="bottom">
              <el-button
                size="mini"
                type="danger"
                circle
                @click="deleteReplacedCollaborator(scope.row.id)">
                <md-icon style="color:white;" class="size-xsmall">delete</md-icon>
              </el-button>

            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-row class="m-3" type="flex" justify="center">
        <el-pagination
          :page-size="headers.limit"
          :pager-count="9"
          layout="prev, pager, next"
          :total="general_data.total"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-row>

      <br>
    </el-card>

    <!-- Modal Asignación -->
    <el-dialog title="Nuevo registro" :visible.sync="dialogFormVisible">

      <el-form v-loading="loading_dialog" >
        <span>Delegado actual</span>
        <el-select v-model="form_dialog.replaced_collaborator" filterable placeholder="Colaborador">
          <el-option
            v-for="item in personal_intelisis_all"
            :key="item.id"
            :label="item.full_name"
            :value="item.plaza_id">
          </el-option>
        </el-select>
        <span class="input-error" v-if="form_dialog_validate.replaced_collaborator">{{form_dialog_validate.replaced_collaborator[0]}}</span>
        <br>
        <br>
        <span>Delegado designado</span>
        <el-select v-model="form_dialog.replace_collaborator" filterable placeholder="Colaborador">
          <el-option
            v-for="item in personal_intelisis_all"
            :key="item.id"
            :label="item.full_name"
            :value="item.plaza_id">
          </el-option>
        </el-select>
        <span class="input-error" v-if="form_dialog_validate.replace_collaborator">{{form_dialog_validate.replace_collaborator[0]}}</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveRecord()" :disabled="loading_dialog">Guardar</el-button>
      </span>
    </el-dialog>

  </div>


</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import Swal from 'sweetalert2'
import '@/styles/global_styles.css'
import moment from 'moment'

export default {
  name: 'TableSearch',
  components: {
  },
  data() {
    return {
      general_data:{},
      headers:{
        limit:20,
        page:1,
        order_by:'desc',
        search:""
      },
      form_dialog:{
        replaced_collaborator:null,
        replace_collaborator:null,
      },
      loading_get_list:false,
      loading_dialog:false,
      dialogFormVisible:false,
      personal_intelisis_all:[],
      form_dialog_validate:{
        replaced_collaborator:null,
        replace_collaborator:null,
      },
    }
  },
  beforeMount() {
    this.getList();
    this.getAllActiveUsers();


  },
  created() {

  },

  methods: {
    async getList(_page = 1){
      this.headers.page = _page;
      this.loading_get_list= true;
      await Api.get('/rh/replace-collaborator/list',{
        params:this.headers
      })
      .then(response =>{

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', "Remplazo Temporal de Colaborador")
        formAut.append('id_afectado',"")
        formAut.append('evento', 'Remplazo Temporal de Colaborador -> getList()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.general_data = response.data
        this.loading_get_list = false
      })
      .catch(error =>{
        console.log(error);
        this.loading_get_list = false

      });

    },

    async getAllActiveUsers(_page = 1){
      this.headers.page = _page;
      this.loading_dialog= true;
      await Api.get('/rh/personal-intelisis/all-active')
      .then(response =>{

        this.personal_intelisis_all = response.data
        this.loading_dialog = false
      })
      .catch(error =>{
        console.log(error);
        this.loading_dialog = false

      });

    },

    async saveRecord(){

      let isValid = this.validateForm();

      if(isValid){
        this.loading_dialog = true;
        await Api.post("/rh/replace-collaborator/add",this.form_dialog)
        .then(response =>{
          if(response.data.success == 1){
            this.$notify({
              title:"Excelente",
              message: "Registro realizado exitosamente.",
              type:"success",
            });

            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Se creo nuevo registro")
            formAut.append('id_afectado',response.data.data.id)
            formAut.append('evento', 'Recursos Humanos - Delegar Permisos -> saveRecord()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            this.getList();
            this.dialogFormVisible=false;

          }else if(response.data.success == 2){

            this.$notify({
              title:"Aviso",
              message: response.data.message,
              type:"warning",
            });

            this.has_requests = true;

          }else{
            this.$notify({
              title:"Aviso",
              message: response.data.message,
              type:"error",
            });
          }

          this.loading_dialog = false;

        })
        .catch(error =>{
          this.loading_dialog = false;
          if(error.response.status && error.response.status == 422){
            this.form_dialog_validate = error.response.data.errors

            this.$notify({
              title:"Aviso",
              message: "Los datos proporcionados no son válidos.",
              type:"error",
            });

          }else{
              this.$notify({
                title:"Aviso",
                message: "A ocurrido un error, intente de nuevo",
                type:"error",
              });
          }
        });
      }
    },

    showDialogAsignacion(){

      this.form_dialog={
        replaced_collaborator:"",
        replace_collaborator:"",
      };
      this.form_dialog_validate={
        replaced_collaborator:[],
        replace_collaborator:[],
      },

      this.dialogFormVisible = true;

    },

    validateForm(){
      let cont=0;

      if(this.form_dialog.replaced_collaborator != "" && this.form_dialog.replaced_collaborator != null){
          delete this.form_dialog_validate.replaced_collaborator;
      }else{
        cont++;
        this.form_dialog_validate.replaced_collaborator =["Seleccione un colaborador."]


      }

      if(this.form_dialog.replace_collaborator != "" && this.form_dialog.replace_collaborator != null){
          delete this.form_dialog_validate.replace_collaborator;
      }else{
        cont++;
        this.form_dialog_validate.replace_collaborator =["Seleccione un colaborador."]


      }

      if(cont > 0){
        return false;
      }else{
        return true
      }

    },

    handleCurrentChange(val){
      this.getList(val);
    },
    deleteReplacedCollaborator(replaced_id){

      Swal.fire({
        title: 'Estas seguro que desea eliminar el registro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {

          Api.post("/rh/replace-collaborator/delete",{"id":replaced_id})
          .then(response =>{

            if(response.data.success == 1){
              const formAut = new FormData()
              formAut.append('name_view', this.$route.name)
              formAut.append('comentarios', "Se elimino un registro")
              formAut.append('id_afectado',replaced_id)
              formAut.append('evento', 'Recursos Humanos - Delegar Permisos  -> deleteRecord()')

              this.$store.dispatch('auditoria/addEventAuditoria', formAut)

              this.$notify({
                  title:"Cancelado!",
                  message: "Ha sido cancelado correctamente.",
                  type:"success",
                });

            }else if(response.data.success == 2){
              this.$notify({
                  title:"Alerta!",
                  message: response.data.message,
                  type:"warning",
                });
            }else{
              this.$notify({
                  title:"Error!",
                  message: response.data.message,
                  type:"error",
                });
            }

            this.getList();


          })
          .catch(error =>{
            console.log(error,"/rh/replace_collaborator-coordinator/delete/"+replaced_id);
            this.$notify({
                  title:"Aviso",
                  message: "A ocurrido un error, intente de nuevo",
                  type:"error",
                });
          });


        }
      })




    },



  },
  filters:{

  },
}
</script>

<style lang="scss" scoped>

</style>
