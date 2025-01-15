<template>
    <div>
      <el-dialog
          title="Configuraciones de usuario"
          :visible.sync="visible_modal"
          width="80%">
  
          <div v-if="fullscreenLoading" class="text-center">
              <br>
              <br>
              <br>
              <md-progress-spinner :md-stroke="2" :md-diameter="40" md-mode="indeterminate"></md-progress-spinner>
              <br>
              <br>
              <br>
          </div>
  
          <div v-else class="m-2">
              <md-content class="m-3">
                <el-row>
                  <el-col class="col-sm-12 col-md-12 text-center">
                    <el-tag type="success"><h5><i class="fa-solid fa-user"></i> {{ user_name }}</h5></el-tag>
                  </el-col>
                </el-row>
                <el-tabs v-model="activeName" @tab-click="handleClick()">
                    <el-tab-pane label="Proceso de Incidencia" name="first" v-loading="loadings_tabs.incident_process">
                        <el-row>
                            <el-col class="col-sm-12 col-md-3">
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix text-center">
                                        <span> <strong>Excluir</strong> </span>
                                    </div>
                                    <div class="text-center">
                                        <el-switch v-model="tabs.incident_process.exclude" inactive-text="No" active-text="Sí" @change="excludeIncidentProcess()"></el-switch> 
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>  
              </md-content>

          </div>
  
  
      </el-dialog>
    </div>
  </template>
  
  <script>
  
  import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
  import store from '@/store' // Clase Api donde se declara Axios y la ruta al servidor
  import moment from 'moment'
  
  
  export default {
    name: 'Paperrecord_data',
    components: {
  
    },
    data() {
      return {
          fullscreenLoading:false,
          visible_modal:false,
          activeName: 'first',
          user_rfc:"",
          user_name:"",
          tabs:{
            incident_process:{
                exclude:false,
            }
          },
          loadings_tabs:{
            incident_process:false
          },
          
      }
    },
    beforeMount() {
  
    },
    created() {
  
    },
  
    methods: {
  
      _tempCreated:function(_data){

        this.visible_modal=true;
        this.user_rfc = _data.rfc;
        this.user_name = _data.full_name;
        this.setearVariables();
        this.getUserSettings();
        
        //this.fullscreenLoading = false;
      },

      handleClick(tab, event) {
        //console.log(tab, event);
      },

      async getUserSettings(){
        this.fullscreenLoading = true;
        this.tabs.incident_process.exclude = false;
        let ths = this;
        await Api.get('/administration/user-settings/list/'+this.user_rfc)
        .then(response =>{
          
          this.general_data = response.data.data

          if(this.general_data.length > 0){

            this.general_data.forEach(setting => {
              
              if(setting.module == 'user_settings' && setting.key == "incident_process-exclude_user-rfc" && setting.value == this.user_rfc){
                ths.tabs.incident_process.exclude = setting.data == 1 ? true : false;
              }else{
                ths.tabs.incident_process.exclude = false;
              }

            });

          }

          this.fullscreenLoading = false
        })
        .catch(error =>{
          console.log(error);
          this.fullscreenLoading = false

        });

      },

      async excludeIncidentProcess(){
        this.loadings_tabs.incident_process = true;
        this.tabs.incident_process.exclude = !this.tabs.incident_process.exclude == true ? false : true;
        
        await Api.post('/administration/user-settings/exclude-incident-process',{
            rfc: this.user_rfc,
            status: this.tabs.incident_process.exclude,
          })
        .then(response =>{
          
          this.loadings_tabs.incident_process = false;
          
        })
        .catch(error =>{
          console.log(error);
          this.loadings_tabs.incident_process = false;
        });
      },

      setearVariables(){
        this.tabs={
            incident_process:{
                exclude:false,
            }
          }
      }

    },
    filters:{
    },
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  