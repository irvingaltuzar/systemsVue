<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="end">
          <el-col class="m-1 col-md-12 col-sm-12">
            <h3>Fechas de Corte - Cierre mensual</h3>
          </el-col>
        </el-row>
      </div>

      <br>

      <el-table
        class="m-1"
        style="width: 100%"
        :data="general_data"
        v-loading="loading_get_list">
        <el-table-column
          prop="month"
          label="Mes">
        </el-table-column>
        <el-table-column
          prop="day"
          label="Día de corte">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.day" @change="handleChange(scope.row.position)" :disabled="scope.row.flag_edit" :min="1" :max="31"></el-input-number>
            <el-button v-if="scope.row.flag_edit" class="ml-2" type="success" icon="el-icon-loading" plain>Guardando...</el-button>
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
      general_data:[],
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
      form_dialog_validate:{
        replaced_collaborator:null,
        replace_collaborator:null,
      },
      arrayMonth:["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre","","Anual"]
    }
  },
  beforeMount() {
    this.getList();

  },
  created() {

  },

  methods: {
    async getList(_page = 1){
      this.headers.page = _page;
      this.loading_get_list= true;
      await Api.get('/accounting/monthly-closure/cutoff-date-list',{
        params:this.headers
      })
      .then(response =>{

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', "Fechas de Corte")
        formAut.append('id_afectado',"")
        formAut.append('evento', 'Contabilidad - Fecha de corte -> getList()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        //this.general_data = response.data
        this.formatDates(response.data);
        this.loading_get_list = false
      })
      .catch(error =>{
        console.log(error);
        this.loading_get_list = false

      });

    },

    formatDates(_data){

      let ths = this;

      _data.forEach((month,index) =>{
        let num_month = month.key.split('-')[0].split(' ')[2];
        ths.general_data.push({
          "id":month.id,
          "key":month.key,
          "month": ths.arrayMonth[parseInt(num_month)],
          "day": month.value,
          "flag_edit":false,
          "position":index,

        });
      });

      //this.general_data
    },

    handleCurrentChange(val){
      this.getList(val);
    },

    handleChange(_position){

      let record = this.general_data[_position];
      record.flag_edit = true;

      Api.post("/accounting/monthly-closure/cutoff-date-edit",{"id":record.id,"day":record.day})
          .then(response =>{

            if(response.data.success == 1){
              const formAut = new FormData()
              formAut.append('name_view', this.$route.name)
              formAut.append('comentarios', "Se edito un registro")
              formAut.append('id_afectado',record.id)
              formAut.append('evento', 'Contabilidad - Fecha de corte -> editDate()')

              this.$store.dispatch('auditoria/addEventAuditoria', formAut)

              this.$notify({
                  title:"Editado!",
                  message: "Ha sido editado correctamente.",
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

            record.flag_edit = false;
            //this.getList();


          })
          .catch(error =>{
            console.log(error,"/accounting/monthly-closure/cutoff-date-edit",{"key":_id,"day":_day});
            this.$notify({
                  title:"Aviso",
                  message: "A ocurrido un error, intente de nuevo",
                  type:"error",
                });
          });
    }



  },
  filters:{

  },
}
</script>

<style lang="scss" scoped>

</style>
