<template>
  <div>
    <el-dialog
        :title="title_modal"
        :visible.sync="visible_modal"
        width="80%">

        <div v-if="modal_loading" class="text-center">
            <br>
            <br>
            <br>
            <md-progress-spinner :md-stroke="2" :md-diameter="40" md-mode="indeterminate"></md-progress-spinner>
            <br>
            <br>
            <br>
        </div>

        <div v-else class="m-2">
            <md-content>
              <el-row v-if="type_event != 'edit'" class="m-1" type="flex" justify="center">
                  <el-col class="col-md-10 col-sm-12 text-center">
                    <label><i class="fa-solid fa-magnifying-glass"></i> Empresa | Gerente | Contador <span class="input-required">*</span></label>
                    <el-select
                      v-model="search_result"
                      filterable
                      clearable
                      :remote="true"
                      placeholder="Por favor ingrese la empresa, gerenete o contador"
                      :remote-method="getCompanies"
                      :loading="search_loading">
                      <el-option
                        v-for="item in list_companies"
                        :key="item.id"
                        :label="item.business_name+' ('+item.erp_name+')'+' | '+item.manager_name+' | '+item.accountant_name"
                        :value="item">
                      </el-option>
                    </el-select>
                    <span class="input-error" v-if="form_validate.dmi_accounting_companies_id">{{form_validate.dmi_accounting_companies_id[0]}}</span>
                  </el-col>
              </el-row>
              <br>
              <el-row class="mt-2">
                <el-col class="col-sm-12 col-md-2">
                  <label>Número</label>
                  <el-input  placeholder="Número" disabled v-model="search_result.id"></el-input>
                </el-col>
                <el-col class="col-sm-12 col-md-3">
                  <label>Ubicación</label>
                  <el-input  placeholder="Ubicación" disabled v-model="search_result.work_station_name"></el-input>
                </el-col>
                <el-col class="col-sm-12 col-md-7">
                  <label>Empresa</label>
                  <el-input  placeholder="Empresa" disabled v-model="search_result.business_name+' ('+search_result.erp_name+')'"></el-input>
                </el-col>
              </el-row>

              <el-row class="mt-2">
                <el-col class="col-sm-12 col-md-6">
                  <label>Gerente</label>
                  <el-input  placeholder="Gerente" disabled v-model="search_result.manager_name"></el-input>
                </el-col>
                <el-col class="col-sm-12 col-md-6">
                  <label>Contador</label>
                  <el-input  placeholder="Contador" disabled v-model="search_result.accountant_name"></el-input>
                </el-col>
              </el-row>

              <el-row class="mt-2">
                <el-col class="col-sm-12 col-md-6">
                  <label>Mes <span class="input-required">*</span></label>
                  <el-select v-model="form_request.month" placeholder="Mes" :disabled="type_event == 'edit'">
                    <el-option label="Enero" value="01"></el-option>
                    <el-option label="Febrero" value="02"></el-option>
                    <el-option label="Marzo" value="03"></el-option>
                    <el-option label="Abril" value="04"></el-option>
                    <el-option label="Mayo" value="05"></el-option>
                    <el-option label="Junio" value="06"></el-option>
                    <el-option label="Julio" value="07"></el-option>
                    <el-option label="Agosto" value="08"></el-option>
                    <el-option label="Septiembre" value="09"></el-option>
                    <el-option label="Octubre" value="10"></el-option>
                    <el-option label="Noviembre" value="11"></el-option>
                    <el-option label="Diciembre" value="12"></el-option>
                    <el-option label="Anual" value="00"></el-option>
                  </el-select>
                  <span class="input-error" v-if="form_validate.month">{{form_validate.month[0]}}</span>
                </el-col>
                <el-col class="col-sm-12 col-md-6">
                  <label>Año <span class="input-required">*</span></label>
                  <el-input  placeholder="Año" v-model="form_request.year" :disabled="type_event == 'edit'"></el-input>
                  <span class="input-error" v-if="form_validate.year">{{form_validate.year[0]}}</span>
                </el-col>
              </el-row>

              <el-row class="mt-3">
                <el-col class="col-sm-12 col-md-6">
                  <label>Utilidad Contable ($)</label>
                  <el-input  placeholder="Utilidad Contable"  v-model="form_request.accounting_utility"  clearable></el-input>
                </el-col>
                <el-col class="col-sm-12 col-md-6">
                  <label>Utilidad Fiscal ($)</label>
                  <el-input  placeholder="Utilidad Fiscal"  v-model="form_request.tax_utility"  clearable></el-input>
                </el-col>
              </el-row>

              <el-row class="mt-2">
                <el-col class="col-md-12 col-sm-12">
                  <label>Comentarios</label>
                  <el-input type="textarea" v-model="form_request.comments"></el-input>
              </el-col>
              </el-row>

              <el-row class="mt-5" type="flex" justify="end">
                <el-col v-if="type_event != 'edit'" class="col-md-3 col-sm-12 text-right">
                  <el-button type="success" @click="saveRecord()">Guardar</el-button>
                </el-col>
                <el-col v-else class="col-md-3 col-sm-12 text-right">
                  <el-button type="success" @click="updateRecord()">Actualizar</el-button>
                </el-col>
              </el-row>

            </md-content>
        </div>


    </el-dialog>
  </div>
</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import store from '@/store' // Clase Api donde se declara Axios y la ruta al servidor
import moment from 'moment'
import Swal from 'sweetalert2'
import '@/styles/global_styles.css'


export default {
  name: 'Paperrecord_data',
  components: {

  },
  data() {
    return {
        modal_loading:false,
        search_loading:false,
        visible_modal: false,
        search_result:{
          business_name:"",
          erp_name:""
        },
        form_request:{
          dmi_accounting_companies_id:null,
          month:moment(new Date()).format('M'),
          year:moment(new Date()).format('Y'),
          accounting_utility:null,
          tax_utility:null,
          comments:null,
        },
        list_companies:[],
        fileList: [],
        form_validate:{
          dmi_accounting_companies_id:[],
          month:[],
          year:[],
        },
        title_modal:"Agregar Precierre Fiscal",
        type_event:"new",

    }
  },
  beforeMount() {
  },
  created() {

  },

  methods: {
    _tempCreated:function(_data){
      this.clearFormRequest();
      this.type_event = _data.type_event;
      if(_data.type_event == "edit"){
        this.search_result = _data.record.accounting_companies;
        this.form_request = _data.record;
        this.title_modal="Editar Precierre Fiscal";
      }else{
        this.type_event="new";
      }

      this.visible_modal = _data.visible_modal
      this.modal_loading = false;

    },

    async getCompanies(_search){
      this.search_loading= true;
      await Api.get('/accounting/get-companies?search='+_search)
      .then(response =>{

        if(response.data.success == 1){
          this.list_companies = response.data.data;
        }else{
          this.$notify({
            title: 'Error',
            message: response.data.message,
            type: 'error'
          });
        }

        this.search_loading = false;

      })
      .catch(error =>{
        this.search_loading = false;
        this.$notify({
            title: 'Error',
            message: 'Error al conectarse con el servidor, vuelva a intentarlo de nuevo',
            type: 'error'
          });
        console.log('request error => /accounting/get-companies?search='+_search,error);

      });

    },

    async saveRecord(){
      let formRequest = new FormData();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      this.form_request.dmi_accounting_companies_id = this.search_result.id;

      if(this.validateForm()){

        this.modal_loading = true;

        formRequest.append('dmi_accounting_companies_id',this.form_request.dmi_accounting_companies_id);
        formRequest.append('month',this.form_request.month);
        formRequest.append('year',this.form_request.year);
        formRequest.append('accounting_utility',this.form_request.accounting_utility);
        formRequest.append('tax_utility',this.form_request.tax_utility);
        formRequest.append('comments',this.form_request.comments);

        await Api.post('/accounting/fiscal-preclosing/add',formRequest,config)
        .then(response =>{
          if(response.data.success == 1){

            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Agregar Precierre Fiscal")
            formAut.append('id_afectado',response.data.data.id)
            formAut.append('evento', 'Precierre Fiscal -> saveRecord()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            this.$notify({
              title:"Excelente",
              message: "Registro realizado exitosamente.",
              type:"success",
            });
            this.clearFormRequest();
            this.$emit('listenChildComponent');

          }else{
            this.$notify({
              title:"Aviso",
              message: response.data.message,
              type:"error",
            });
          }

          this.modal_loading = false;

        })
        .catch(error =>{
          this.modal_loading = false;
          console.log(error);
          if(error.response.status && error.response.status == 422){
            this.form_validate = error.response.data.errors

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

    validateForm(){
      let cont = 0;

      if(this.form_request.dmi_accounting_companies_id == null){
        cont++
        this.form_validate.dmi_accounting_companies_id.push("El campo empresa es obligatorio.");
      }else{
        delete this.form_validate.dmi_accounting_companies_id;
      }

      if(this.form_request.month == ""){
        cont++
        this.form_validate.month.push("El campo mes es obligatorio.");
      }else{
        delete this.form_validate.month;
      }

      if(this.form_request.year == ""){
        cont++
        this.form_validate.year.push("El campo año es obligatorio.");
      }else{
        delete this.form_validate.year;
      }

      if(cont == 0){
        return true;
      }else{
        this.$notify({
          title: 'Aviso',
          message:"Complete los campos.",
          type: 'warning'
        });
        return false;
      }

    },

    async updateRecord(){
      let formRequest = new FormData();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      this.form_request.dmi_accounting_companies_id = this.search_result.id;

      if(this.validateForm()){

        this.modal_loading = true;

        formRequest.append('id',this.form_request.id);
        formRequest.append('dmi_accounting_companies_id',this.form_request.dmi_accounting_companies_id);
        formRequest.append('month',this.form_request.month);
        formRequest.append('year',this.form_request.year);
        formRequest.append('accounting_utility',this.form_request.accounting_utility);
        formRequest.append('tax_utility',this.form_request.tax_utility);
        formRequest.append('comments',this.form_request.comments);

        await Api.post('/accounting/fiscal-preclosing/update',formRequest,config)
        .then(response =>{
          if(response.data.success == 1){

             const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Actualizar Precierre Fiscal")
            formAut.append('id_afectado',this.form_request.id)
            formAut.append('evento', 'Precierre Fiscal -> updateRecord()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            this.$notify({
              title:"Excelente",
              message: "Actualización realizada exitosamente.",
              type:"success",
            });
            this.$emit('listenChildComponent');
            this.clearFormRequest();
            this.visible_modal=false;

          }else{
            this.$notify({
              title:"Aviso",
              message: response.data.message,
              type:"error",
            });
          }

          this.modal_loading = false;

        })
        .catch(error =>{
          this.modal_loading = false;
          console.log(error," => ",'/accounting/fiscal-preclosing/update');
          if(error.response.status && error.response.status == 422){
            this.form_validate = error.response.data.errors

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


    clearFormRequest(){
      this.form_request= {
          dmi_accounting_companies_id:null,
          month:moment(new Date()).format('M'),
          year:moment(new Date()).format('Y'),
          accounting_utility:null,
          tax_utility:null,
          comments:null,
        };

        this.search_result="";
    },


  },
  filters:{
  },
}
</script>

<style lang="scss" scoped>

</style>
