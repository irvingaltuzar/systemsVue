<template>
<div>
  <el-row :gutter="80" class="panel-group ml-5">
    <el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div v-scroll-to="'#element'" class="card-panel"  @click="clcDatabox">
        <div class="card-panel-icon-wrapper icon-star">

       <UndrawFileSearching class="size-icon"/>

        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            DATABOX 2
          </div>
      
        </div>
      </div>
    </el-col>
   <el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div  v-scroll-to="'#element'" class="card-panel" @click="clc2">
        <div class="card-panel-icon-wrapper icon-attendance ">
    <UndrawTimeManagement class="size-icon" primary-color='#41B883' height='100px'/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            CONTROL ASISTENCIA
          </div>
        </div>
      </div>
    </el-col>
   <el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div  v-scroll-to="'#element'" class="card-panel" @click="clc3">
        <div class="card-panel-icon-wrapper icon-people">
        <UndrawFolder class="size-icon" primary-color='#41B883' height='100px'/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
           PERMISOS
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="80" class="panel-group ml-5">

   <!--<el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div v-scroll-to="'#element'" class="card-panel" @click="clc4">
        <div class="card-panel-icon-wrapper icon-search">
        <UndrawEatingTogether class="size-icon" primary-color='#41B883' height='100px'/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            COMEDOR
          </div>
        </div>
      </div>
    </el-col>-->

   <el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div v-scroll-to="'#element'" class="card-panel"  @click="clc5">
        <div class="card-panel-icon-wrapper icon-star">
        <UndrawTravelers class="size-icon" primary-color='#41B883' height='100px'/>

        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            VACACIONES
          </div>
      
        </div>
      </div>
    </el-col>
    <el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div v-scroll-to="'#element'" class="card-panel" @click="clc8">
        <div class="card-panel-icon-wrapper icon-search">
         <UndrawLogistics class="size-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
           PROVEEDORES
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div v-scroll-to="'#element'" class="card-panel" @click="clc9">
        <div class="card-panel-icon-wrapper icon-search">
         <UndrawCompleted class="size-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
           AUTORIZACIONES
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
 <!--  <el-row :gutter="80" class="panel-group ml-5">
 <el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div  v-scroll-to="'#element'" class="card-panel" @click="clc6">
        <div class="card-panel-icon-wrapper icon-attendance ">
          <UndrawPeopleSearch class="size-icon" primary-color='#41B883' />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            REQUISICIONES
          </div>
        </div>
      </div>
    </el-col>
     <el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div  v-scroll-to="'#element'" class="card-panel" @click="clc7">
        <div class="card-panel-icon-wrapper icon-people">
        <UndrawFinance class="size-icon" primary-color='#41B883' />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            CONTABILIDAD
          </div>
        </div>
      </div>
    </el-col>
 
   <el-col :xs="8" :sm="4" :lg="7" class="card-panel-col ">
      <div v-scroll-to="'#element'" class="card-panel"  @click="clc9">
        <div class="card-panel-icon-wrapper icon-star">
       <UndrawCreditCardPayments class="size-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
           NOMINAS
          </div>
      
        </div>
      </div>
    </el-col>

  </el-row>-->

  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import UndrawTimeManagement from 'vue-undraw/UndrawTimeManagement';
import UndrawFolder from 'vue-undraw/UndrawFolder';
import UndrawTravelers from 'vue-undraw/UndrawTravelers';
import UndrawEatingTogether from 'vue-undraw/UndrawEatingTogether';
import UndrawPeopleSearch from 'vue-undraw/UndrawPeopleSearch';
import UndrawFinance from 'vue-undraw/UndrawFinance';
import UndrawLogistics from 'vue-undraw/UndrawLogistics';
import UndrawCompleted from 'vue-undraw/UndrawCompleted';
import UndrawFileSearching from 'vue-undraw/UndrawFileSearching';
import UndrawCreditCardPayments from 'vue-undraw/UndrawCreditCardPayments';
import store from '@/store' // Clase Api donde se declara Axios y la ruta al servidor	
import { mapGetters } from 'vuex'
export default {
  components: {
    CountTo,
    UndrawFolder,
    UndrawTravelers,
    UndrawEatingTogether,
    UndrawPeopleSearch,
    UndrawFinance,
    UndrawLogistics,
    UndrawCompleted,
    UndrawFileSearching,
    UndrawTimeManagement,
    UndrawCreditCardPayments
  },
  data() {
    return {
     
    }
  },
  created() {
    this.$root.$refs.Contadores = this
  },
  computed: {
    
  },
  methods: {
    clcDatabox(){
        this.getTokenUser();

        //window.open(`http://databox2.dmi.local/login.php?user=${store.getters.user}&pass=${token}`,'_blank');
        //this.$router.push('/Databox/Dashboard');
    },
    clc2(){
     this.$router.push('/MiAsistencia'); 
    },
    clc3(){
       this.$router.push('/rh/permisos-trabajo/solicitar-permiso'); 
    },
     clc4(){
       this.$router.push('/comedor/solicitar'); 
    },
     clc5(){
       this.$router.push('/rh/vacaciones/solicitar-vacaciones'); 
    },
     clc6(){
       this.$router.push('/SolicitudRequisicion'); 
    },
     clc7(){
       this.$router.push('/contabilidad/cierre-mensual'); 
    },
     clc8(){
       this.$router.push('/proveedores/registroproveedores'); 
    },
     clc9(){
       this.$router.push('/authorisations'); 
    },

    async getTokenUser(){
      await Api.get("/tools/token-adhoc")
        .then(response =>{

            if(response.data.success == 1){
              window.open(`http://databox2.dmi.local/login.php?user=${store.getters.user}&pass=${response.data.data}`,'_blank');
            }else{
              window.open(`http://databox2.dmi.local/`);
            }
        })
        .catch(error =>{
          this.$notify({
                title:"Aviso",
                message: "Ha ocurrido un error, intente de nuevo",
                type:"error",
              });
        });
    }
  }

}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 135px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    border-radius:10px;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .20);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-star {
        background: #ffbc01
      }

      .icon-attendance {
        background: #389701;
      }
      .icon-people {
        background: #0072bc;
      }
     .icon-search {
        background:#ff793d
      }
    }

    .icon-star {
      color: #e5ff00fd;
    }

    .icon-attendance {
      color: #389701;
    }
    .icon-people {
        color: #0072bc;
      }
    .icon-search {
        color: #5286e7;
      }

    .card-panel-icon-wrapper {
   float: left;
    margin: 8px 0px 0 11px;
    padding: 3px;
    -webkit-transition: all 0.38s ease-out;
    transition: all 0.38s ease-out;
    border-radius: 50px;
    }

    .card-panel-icon {
      float: left;
      font-size: 65px;
    }

    .card-panel-description {
      // float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 41%;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 20px;
         margin-top: 40px;
        text-align: end;
        justify-content: center;
      }

      .card-panel-num {
        font-size: 20px;
          margin-left: 12%;
      }
    }
  }
}

// @media (max-width:550px) {
//   .card-panel-description {
//     display: none;
//   }

//   .card-panel-icon-wrapper {
//     float: none !important;
//     width: 100%;
//     height: 100%;
//     margin: 0 !important;

//     .svg-icon {
//       display: block;
//       margin: 10px auto !important;
//       float: none !important;
//     }
//   }
// }

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
   .size-icon{
    height: 70px;
    width: 80px;
  }
  .panel-group{
        display: grid;
         right:10%;
  }
    .card-panel-text {
        line-height: 13px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 15px !important;
         margin-top: 15px;
        text-align: end;
        justify-content: center;
      }
  .card-panel {
    height: 95px !important;
    width:250px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) and (max-width: 765px){

      .size-icon{
    height: 80px;
    width: 85px;
  }
  .panel-group{
        right:10%;
  }
    .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px !important;
         margin-top:  10px;
        text-align: end;
        justify-content: center;
      }
  .card-panel {
    height: 115px !important;
    width:210px;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) and (max-width: 990px){

   .size-icon{
    height: 80px;
    width: 95px;
  }
  .panel-group{
        right:13%;
  }
    .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 15px !important;
         margin-top: 40px;
        text-align: end;
        justify-content: center;
      }
  .card-panel {
    height: 115px !important;
    width:240px;
    position: initial !important;
  }
  .card-panel-col {
      margin-left: 13%;
    }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) and (max-width: 1200px) {
   .size-icon{
    height: 80px;
    width: 90px;
  }
   .panel-group{
       right:13%;
  }
    .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px !important;
         margin-top: 40px;
        text-align: end;
        justify-content: center;
      }
  .card-panel {
    height: 115px !important;
    width:260px;
  }
   .card-panel-col {
      margin-left: 13%;
    }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .size-icon{
      height: 100px;
      width: 120px;
  }
  .panel-group{
    display: flex;
      right:6%;
  }
   .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 18px !important;
         margin-top: 40px;
        text-align: end;
        justify-content: center;
      }
  .card-panel {
    width:23vw;
    position: initial !important;
       
  }
    .card-panel-col {
      margin-left: 2%;
    }
  }
</style>
