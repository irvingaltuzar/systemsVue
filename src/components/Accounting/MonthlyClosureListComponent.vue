<template>
    <div class="app-container">
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <el-row type="flex" justify="end">
            <el-col class="m-1 col-md-10 col-sm-12">
              <h3>Cierre Mensual</h3>
            </el-col>
            <el-col class="m-1 col-md-2 col-sm-12 text-right">
              <el-button type="success" @click="viewModal()"> <i class="fa-solid fa-circle-plus"></i></el-button>
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

        <el-row class="m-1" type="flex" justify="end">
          <el-col class="m-1 col-md-2 col-sm-12" >
            <el-select v-model="headers.month" placeholder="Mes" @change="getList()">
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
          </el-col>
          <el-col class="m-1 col-md-2 col-sm-12" >
            <el-input placeholder="Año" v-model="headers.year" @input="getList()"></el-input>
          </el-col>
        </el-row>

        <br>

          <el-table
            class="m-1"
            style="width: 100%"
            :data="general_data.data"
            v-loading="loading_get_list">
            <el-table-column
              prop="id"
              label="Folio"
              width="70">
            </el-table-column>
            <el-table-column
              prop="work_station_name"
              label="Ubicación"
              width="120">
              <template slot-scope="scope">
                <span class="label">{{scope.row.accounting_companies.work_station_name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="Empresa"
              width="280">
                <template slot-scope="scope">
                  <span class="label">{{scope.row.accounting_companies.business_name}} ({{scope.row.accounting_companies.erp_name}})</span>
                </template>
            </el-table-column>
            <el-table-column
              prop="start_date"
              width="180"
              label="Gerente">
              <template slot-scope="scope">
                <span class="label">{{scope.row.accounting_companies.manager_name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="return_date"
              label="Contador"
              width="180">
              <template slot-scope="scope">
                <span class="label">{{scope.row.accounting_companies.accountant_name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="date_accounting"
              label="Contabilidad"
              width="110"
              align="center">
              <template slot-scope="scope">
                <span class="label">{{scope.row.date_accounting | date}}</span>
                <div v-if="scope.row.file_accounting != null">
                  <br>
                  <a :href="scope.row.api_document_accounting" class="text-danger icon-document" target="_blank"><i class="fa-solid fa-file-pdf"></i></a>
                  <a href="#" class="text-danger icon-document p-2" @click="deleteFile(scope.row.id,'accounting')"><i class="fa-solid fa-trash"></i></a>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="date_fiscal"
              label="Fiscal"
              width="100"
              align="center">
              <template slot-scope="scope">
                <span class="label">{{scope.row.date_fiscal | date}}</span>
                <div v-if="scope.row.file_fiscal != null">
                  <br>
                  <a :href="scope.row.api_document_fiscal" class="text-danger icon-document" target="_blank"><i class="fa-solid fa-file-pdf"></i></a>
                  <a href="#" class="text-danger icon-document p-2" @click="deleteFile(scope.row.id,'fiscal')"><i class="fa-solid fa-trash"></i></a>

                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="date_payment"
              label="Pago"
              width="100"
              align="center">
              <template slot-scope="scope">
                <span class="label">{{scope.row.date_payment | date}}</span>
                <div v-if="scope.row.file_payment != null">
                  <br>
                  <a :href="scope.row.api_document_payment" class="text-danger icon-document" target="_blank"><i class="fa-solid fa-file-pdf"></i></a>
                  <a href="#" class="text-danger icon-document p-2" @click="deleteFile(scope.row.id,'payment')"><i class="fa-solid fa-trash"></i></a>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="observations"
              label="Observaciones"
              width="200">
              <template slot-scope="scope">
                <span class="label">{{scope.row.observations}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Acciones"
              width="100"
              fixed="right"
              >
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="Editar" placement="bottom">
                  <el-button
                    size="mini"
                    type="primary"
                    circle
                    @click="editRecord(scope.row.id)">
                      <i class="fa-solid fa-pencil"></i>
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
      <!-- <add_record ref="addMonthlyClosure"  @listenChildComponent="getList" ></add_record> -->
      <add-record-component ref="addMonthlyClosure"  @listenChildComponent="getList" />
      <!-- <monthly-closure-charts-component /> -->
    </div>
  </template>

  <script>

  import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
  import Swal from 'sweetalert2'
  import moment from 'moment'
  import '@/styles/global_styles.css'
//   import add_record from './addRecord.vue'

  export default {
    name: 'MonthlyClosureListComponent',
    // components: {
    //   add_record
    // },
    data() {
      return {
        general_data:{},
        headers:{
          limit:20,
          page:1,
          order_by:'desc',
          search:"",
          month:moment(new Date()).format('MM'),
          year:moment(new Date()).format('YYYY'),
        },
        loading_get_list:false,
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
        await Api.get('/accounting/monthly-closure/list',{
          params:this.headers
        })
        .then(response =>{
          this.general_data = response.data
          this.loading_get_list= false
        })
        .catch(error =>{
          console.log(error," => ",'/accounting/monthly-closure/list');
          this.loading_get_list= false

        });

      },

      handleCurrentChange(val){
        this.getList(val);
      },

      /* *************************************************** */
      async editRecord(_id){
          this.loading_get_list= true;

          await Api.get("/accounting/monthly-closure/single/"+_id)
          .then(response =>{
              console.log("ajax",response.data.data);
              this.loading_get_list= false;
              this.$refs.addMonthlyClosure._tempCreated({
                "visible_modal":true,
                "type_event":"edit",
                "record":response.data.data
              });

          })
          .catch(error =>{
            this.loading_get_list= false;
            console.log("error => ","/accounting/monthly-closure/single/"+_id,error);
            this.$notify({
                  title:"Aviso",
                  message: "A ocurrido un error, intente de nuevo",
                  type:"error",
                });
          });


          //orderSignatures

      },


      /* *************************************************** */

      viewModal(){
        this.$refs.addMonthlyClosure._tempCreated({"visible_modal":true});
      },

      deleteFile(_id_mounthly_closure,_field){

        Swal.fire({
          title: 'Estas seguro que desea eliminar el documento?',
          text: "¡No podrás revertir esta acción!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading_get_list= true;
            Api.get("/accounting/monthly-closure/delete-file/"+_id_mounthly_closure+"/"+_field)
            .then(response =>{
              if(response.data.success == 1){
                this.$notify({
                    title:"Eliminado!",
                    message: response.data.message,
                    type:"success",
                  });
              }else{
                this.$notify({
                    title:"Error!",
                    message: response.data.message,
                    type:"error",
                  });
              }
              this.loading_get_list= false;
              this.getList();

            })
            .catch(error =>{
              this.loading_get_list= false;
              console.log(error,"/accounting/monthly-closure/list"+_id_mounthly_closure+"/"+_field);
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
      date(_date){
        return _date != null ?moment(_date).format('DD-MM-YYYY') : '';
      }

    },
  }
  </script>

  <style lang="scss" scoped>

  </style>
