<template>
<el-container>
      <el-dialog
        
        :visible.sync="dialogVisible"
        width="85%"
        top="0vh"
        >
          <iframe id="fred" style="border:1px solid #666CCC" title="PDF in an i-Frame" :src="url" frameborder="1" scrolling="auto" height="700" width="100%" ></iframe>
      </el-dialog>
    <el-row :gutter="20">
        
  <el-col :span="6"  v-for="(item, index) in arrArchivos" :key="`d-${index}`" :offset="index > 0 ? 0 : 0" style="padding: 8px">
    <el-card style="height: 258px;">
    <el-container>
        <el-col :span="8"><div class="crop"><img :src="item.icono" class="image"></div></el-col>
       <el-col ><div >
        <span class="span-file"><b>{{item.titulo}}</b></span>
      
      </div>
      </el-col>
     </el-container>
           <el-divider ><i class="el-icon-star-on"></i></el-divider>

         <el-row>
        <el-col :span="12"><span class="span-file">Descargas: <b>{{item.numeroDescargas}}</b> </span></el-col>
        <el-col :span="12"><span class="span-file">Tamaño: <b>{{item.size}}</b></span></el-col>

         </el-row>
          <el-row>
        <el-col :span="9"><span class="span-file">Vistas: <b>{{item.numeroConsultas}}</b></span></el-col>

        <el-col :span="15"><span class="span-file">Subido: <b>{{item.fechaCaptura}}</b></span></el-col> 
         
       </el-row><br>
    
    <el-row style="margin-left:-1%;">  
      <el-button type="success" icon="el-icon-download" @click="DescargarArchivo(item.archivo)" round >Descargar</el-button> 
       <el-button type="primary" icon="el-icon-view" @click="verArchivo(item.urlArchivo,item.extension)" round>Visualizar</el-button>
       </el-row> 


    </el-card>
  </el-col>
</el-row>

</el-container>

</template>
<script>
import Api from "@/store/modules/Api" //Clase Api donde se declara Axios y la ruta al servidor
export default {
  components:{
  },
  data() {
    return {
      arrArchivos:[],
      value:3.7,
      dialogVisible:false,
      url:null
    };
  },
  created() {
      this.$root.$refs.ArchivosRecientes=this;
  },
  methods: {
        async DescargarArchivo(file){
               let currentObj = this;
                const config = {
                    headers: {
                        'content-type': 'application/*',
                        
                    }
                }
                 let formData = new FormData();
                  formData.append('file',file);

             await Api.post('/download', formData,{config,responseType: 'blob',
                                                        })
                    .then(function (res) {

                      
                let blob = new Blob([res.data], { type: res.headers['content-type'] });
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download =file.slice(file.lastIndexOf('/')+1);
                link.click()
                  
                })
                    .catch(function (error) {
                     if (error.response.status === 422) {
      
                       Message({
                          message: 'Error 404: No se encuentra el Archivo a Descargar' || 'Error',
                          type: 'error',
                          duration: 5 * 1000
                        })
                     }
                    });

                    
      },
      verArchivo(file,type){

        if(type=="xls" || type=="xlsx"){
          this.url="http://view.officeapps.live.com/op/embed.aspx?src=http://192.168.10.235:8000/storage/POT-CON CONTABIOI.xlsx"
        }
        this.url= file;
          this.dialogVisible= true;

      }
      },
}
</script>

<style>
.span-file{
font-size:12px;
/* text-align: justify; */
  text-align: center;
}
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin: 15px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    height: 100%;
    width: 100%;
    position: relative;
    vertical-align: middle;
    border-style: none;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>

