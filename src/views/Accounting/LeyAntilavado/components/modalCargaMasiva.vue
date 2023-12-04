<template>

  <el-dialog title="Carga Masiva - Ley Antilavado" width="65%" :visible.sync="dialog_form_visible">
    <el-form v-loading="loading_dialog" >
      <el-steps :active="active_step" finish-status="success" align-center>
        <el-step title="Seleccionar Empresa"></el-step>
        <el-step title="Cargar Excel"></el-step>
        <el-step title="Previsualización"></el-step>
        <el-step title="Cargar Datos"></el-step>
      </el-steps>
      <br>

      <!-- ########   Paso 0   ####### -->
      <div class="m-1 mt-4" v-if="active_step == 0">
        <el-form >
          <div class="row justify-content-center">
            <div class="col-sm-12 col-md-9">
              <span>Empresa</span>
              <el-select v-model="form_bulk_load.company_id" filterable placeholder="Empresa">
                <el-option
                  v-for="item in CompaniesLaw"
                  :key="item.id"
                  :label="item.business_name"
                  :value="item.id">
                </el-option>
              </el-select>
              <!-- <span class="input-error" v-if="form_bulk_load_validate.company_id">{{form_bulk_load_validate.company_id[0]}}</span> -->
              <br>
            </div>
          </div>
        </el-form>
      </div>

      <!-- ########   Paso 1  ####### -->
      <div class="m-1 mt-4" v-if="active_step == 1">
        <el-form v-loading="steps_loading.excel_read_flag">
          <div class="row justify-content-center">
            <div class="col-sm-12 col-md-9">
              <h5>Seleccione el excel con los movimientos a cargar</h5>
              <br>
              <br>
              <el-upload
                  action="#"
                  class="upload-demo"
                  ref="excel_selected"
                  accept=".xlsx"
                  :auto-upload="false"
                  :on-change="handleChange"
                  :file-list="fileList"
                  :before-upload="beforeAvatarUpload">
                  <el-button slot="trigger" size="small" type="primary">Selecciona un archivo</el-button>
                  <div slot="tip" class="el-upload__tip">Solo archivos Excel(.XLSX) con un tamaño menor de 5Mb</div>
                </el-upload>
                <!-- <span class="input-error" v-if="form_bulk_load_validate.excel_selected">{{form_bulk_load_validate.excel_selected[0]}}</span> -->
                <br>
            </div>
          </div>
        </el-form>
      </div>

      <!-- ########   Paso 2   ####### -->
      <!-- <div class="m-1 mt-4" v-if="active_step == 2">
        <el-form v-loading="steps_loading.excel_read_flag">

          <div class="mb-2 row justify-content-center" v-for="item in required_fields" v-bind:key>
            <div class="col-sm-12 col-md-6">
              <span>Selecciona cuál columan pertenece a <strong>{{item.title}}</strong>?</span>
            </div>
            <div class="col-sm-12 col-md-6">
              <el-select v-model="item.column_position_excel" filterable placeholder="Columna">
                <el-option
                  v-for="(option,key) in excel_file.headers"
                  :key="key"
                  :label="option"
                  :value="key">
                </el-option>
              </el-select>
              <span class="input-error" v-if="item.column_position_excel == null">{{item.valid_message}}</span>
            </div>
          </div>
        </el-form>
      </div> -->

      <!-- ########   Paso 3   ####### -->
      <div class="m-1 mt-4" v-if="active_step == 2">
        <el-form v-if="form_bulk_load.excel_data.length > 0">
          <el-table
            :data="form_bulk_load.excel_data"
            height="250"
            style="width: 100%">
            <el-table-column
              prop="folio"
              label="FOLIO"
              width="120">
            </el-table-column>
            <el-table-column
              prop="month"
              label="MES"
              width="100">
            </el-table-column>
            <el-table-column
              prop="status"
              label="ESTATUS DEL ENVIO"
              width="130">
            </el-table-column>
            <el-table-column
              prop="notice_type"
              label="TIPO DE AVISO"
              width="180">
            </el-table-column>
            <el-table-column
              prop="complete_record"
              label="EXPEDIENTE COMPLETO"
              width="120">
            </el-table-column>
            <el-table-column
              prop="send_date"
              label="FECHA DE ENVIO"
              width="100">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="MONTO"
              width="150">
            </el-table-column>
            <el-table-column
              prop="object_delivery"
              label="PERSONA OBJETO DEL ENVIO"
              width="240">
            </el-table-column>
            <el-table-column
              prop="vulnerable_activity"
              label="ACTIVIDAD VULNERABLE"
              width="210">
            </el-table-column>
          </el-table>
        </el-form>
        <div v-else class="row">
          <div class="col-sm-12 col-md-12 text-center" >
            <md-icon class="md-size-5x action-design text-danger">cancel</md-icon>
            <h3>No existen datos a cargar</h3>
          </div>
        </div>
      </div>

      <!-- ########   Paso 4   ####### -->
      <div class="m-1 mt-4" v-if="active_step == 3">
        <el-form v-loading="steps_loading.bulk_load_flag">
          <div class="mb-2 row justify-content-center">
            <div v-if="steps_loading.success_load.status == 1" class="col-sm-12 col-md-12 text-center">
              <div>
                <md-icon class="md-size-5x action-design text-success">cloud_done</md-icon>
              </div>
              <h3>{{steps_loading.success_load.message}}</h3>
            </div>
            <div v-else-if="steps_loading.success_load.status == 0" class="col-sm-12 col-md-12 text-center">
              <div>
                <md-icon class="md-size-5x action-design text-danger">cloud_off</md-icon>
              </div>
              <h3>{{steps_loading.success_load.message}}</h3>
            </div>
          </div>
        </el-form>
      </div>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog_form_visible = false">Cancel</el-button>
      <el-button v-if="active_step > 0 && active_step < 3"  type="primary" @click="previous_step(active_step)" :disabled="loading_dialog">Anterior</el-button>
      <el-button v-if="active_step < 2" type="primary" @click="next_step(active_step)" :disabled="loading_dialog">Siguiente</el-button>
      <el-button v-if="active_step == 2 && form_bulk_load.excel_data.length > 0" type="primary" @click="saveBulkLoad();" :disabled="loading_dialog">Guardar</el-button>
    </span>
  </el-dialog>

</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import Swal from 'sweetalert2'
import '@/styles/global_styles.css'
import moment from 'moment'
import { mapGetters} from 'vuex'
import readXlsxFile from 'read-excel-file'

export default {
  data() {
    return {
      dialog_form_visible: false,
      loading_dialog: false,
      active_step:0,
      form_bulk_load:{
        company_id:null,
        excel_data:[],
        save_bulk_load_flag:false,
      },
      /* form_bulk_load_validate:{
        company_id:null,
        excel_selected:null,
      }, */
      form_bulk_load_validate:[],
      excel_file:{
        hearders:[],
        data:[],
      },
      required_fields:[
        {
          title:"FOLIO",
          column_position_excel:null,
          valid_message:null,
        },
        {
          title:"MES",
          column_position_excel:null,
          valid_message:null,
        },
        {
          title:"ESTATUS DEL ENVIO",
          column_position_excel:null,
          valid_message:null,
        },
        {
          title:"TIPO DE AVISO",
          column_position_excel:null,
          valid_message:null,
        },
        {
          title:"EXPEDIENTE COMPLETO",
          column_position_excel:null,
          valid_message:null,
        },
        {
          title:"FECHA DE ENVIO",
          column_position_excel:null,
          valid_message:null,
        },
        {
          title:"MONTO",
          column_position_excel:null,
          valid_message:null,
        },
        {
          title:"PERSONA OBJETO DEL ENVIO",
          column_position_excel:null,
          valid_message:null,
        },
        {
          title:"ACTIVIDAD VULNERABLE",
          column_position_excel:null,
          valid_message:null,
        },

      ],
      steps_loading:{
        excel_read_flag:false,
        bulk_load_flag:false,
        success_load:{
          status:-1,
          message:"",
        },

      }


    }
  },
  beforeMount() {
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
  methods:{
    next_step(_step){
      let next_step_flag = false;
      next_step_flag = this.form_validate_step(_step);

      if(next_step_flag == true){
        this.active_step++;
      }

    },
    previous_step(){
      this.active_step--;

      if(this.active_step == 1){
        delete this.form_bulk_load_validate.excel_selected;
      }

    },
    form_validate_step(_step){
      let cont=0;
      let ths = this;
      if(_step == 0){
        if(this.form_bulk_load.company_id != null && this.form_bulk_load.company_id > 0){
          delete this.form_bulk_load_validate.company_id;
        }else{
          this.form_bulk_load_validate.company_id =["Complete la información."]
          this.$message({
            message: 'Seleccione una empresa',
            type: 'error'
          });
          cont++;
        }
      }else if(_step == 1){
        if(this.$refs.excel_selected.uploadFiles.length == 1){
          delete this.form_bulk_load_validate.excel_selected;
          //this.readExcelData(this.$refs.excel_selected.uploadFiles[0].raw);
        }else{
          this.form_bulk_load_validate.excel_selected =["Seleccione el excel a cargar."]
          this.$message({
            message: 'Seleccione el excel a cargar.',
            type: 'error'
          });
          cont++;
        }
      }else if(_step == 2){
        this.required_fields.forEach((item,key) =>{
          if(item.column_position_excel == null){
            ths.required_fields[key].valid_message= "Selecciona una opción";
            cont++;
          }else{
            ths.required_fields[key].valid_message = null;
          }
        })
        this.extractData();
      }



      if(cont > 0){
        return false;
      }else{
        return true;
      }

    },
    /* Archivos */
    handleChange(file,fileList) {
      this.beforeAvatarUpload(file,fileList);

    },
    beforeAvatarUpload(file,fileList){

        let extension = ['xlsx'];
        let nameFile = file.name.split('.');
        // Se valida el peso
        if(((file.size/1024)/1024) < 5){
            // Se valida el tipo de archivo
            if(extension.indexOf(nameFile[1]) != -1){
              this.readExcelData(this.$refs.excel_selected.uploadFiles[0].raw);
            }else{
                this.$notify({
                  title: 'Aviso',
                  message:"Seleccione solamente archivos Excel.",
                  type: 'warning'
                });
                fileList.pop()
            }
        }else{
            this.$notify({
                  title: 'Aviso',
                  message:"El archivo supera el limite de 5 MB.",
                  type: 'warning'
                });
                fileList.pop()
        }
    },
    clearFormBulkLoad(){
      this.form_bulk_load= {
        company_id:null,
        excel_data:[],
        save_bulk_load_flag:false,
      },
      this.form_bulk_load_validate=[],
      this.active_step=0;
      this.loading_dialog= false;
    },
    async readExcelData(_excel){
      this.steps_loading.excel_read_flag= true;
      this.excel_file = await readXlsxFile(_excel,{ dateFormat: 'mm/dd/yyyy' });


    },

    extractData(){
      let ths = this;
      let array =[];

      this.excel_file.data.forEach(row =>{

        array.push({
          folio: row[0],
          month: row[1],
          status: row[2],
          notice_type: row[3],
          complete_record: row[4],
          send_date: moment(moment(row[5]).add(1,"days")).format('DD-MM-YYYY'),
          amount: row[6],
          object_delivery: row[7],
          vulnerable_activity: row[8],
        })

      })
      this.form_bulk_load.excel_data=array;

    },

    /* extractData(){
      let ths = this;
      let array =[];

      this.excel_file.data.forEach(row =>{

        array.push({
          folio: row[ths.required_fields[0].column_position_excel],
          month: row[ths.required_fields[1].column_position_excel],
          status: row[ths.required_fields[2].column_position_excel],
          notice_type: row[ths.required_fields[3].column_position_excel],
          complete_record: row[ths.required_fields[4].column_position_excel],
          send_date: moment(row[ths.required_fields[5].column_position_excel]).format('DD-MM-YYYY'),
          amount: row[ths.required_fields[6].column_position_excel],
          object_delivery: row[ths.required_fields[7].column_position_excel],
          vulnerable_activity: row[ths.required_fields[8].column_position_excel],
        })

      })
      this.form_bulk_load.excel_data=array;

    }, */
    async saveBulkLoad(){
      this.active_step++;
      this.steps_loading.bulk_load_flag = true;

      await Api.post("/accounting/save-bulk-load-anti-laundering",{data:this.form_bulk_load})
      .then(response =>{
        if(response.data.success == 1){
          this.steps_loading.success_load ={
            status:response.data.success,
            message:response.data.message
          };
          const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', "se realizo una carga masiva")
          formAut.append('id_afectado',null)
          formAut.append('evento', 'Ley Antilavado -> saveBulkLoad()')

          this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        }else if(response.data.success == 2){
          this.steps_loading.success_load = {
            status:response.data.success,
            message:response.data.message
          };
        }else{
          this.steps_loading.success_load ={
            status:response.data.success,
            message:response.data.message
          };
        }

        this.steps_loading.bulk_load_flag = false;

      })
      .catch(error =>{
        this.steps_loading.bulk_load_flag = false;
        this.steps_loading.success_load ={
            status:0,
            message:"Error al cargar los datos"
          };
      });



    },

  },
  watch:{
    excel_file:function(_excel){
      this.excel_file.headers = _excel[0];
      this.excel_file.data = _excel.slice(1,_excel.length);
      this.extractData();
      this.steps_loading.excel_read_flag= false;

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
