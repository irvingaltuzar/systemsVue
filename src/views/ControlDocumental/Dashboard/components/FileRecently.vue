<template>
  <el-container>

    <el-dialog

      :visible.sync="dialogVisible"
      width="85%"
      top="0vh"
      @close="url= '',tagvideo=false"
    >
   <video v-if="tagvideo==true" ref='video' height="700" width="100%" :src="url"  controls preload controlsList="nodownload" codecs="avc1.42E01E,mp4a.40.2">
	</video> 
  
    <!-- <video-player v-if="tagvideo==true" class="video-player-box"
                 ref="videoPlayer"
                 :options="playerOptions"
                 :playsinline="true"
                >
  </video-player> -->
      <iframe v-else id="fred"  style="border:1px solid #666CCC" title="PDF in an i-Frame" :src="url" frameborder="1" scrolling="auto" height="700" width="100%" />
    </el-dialog>
    <el-row :gutter="20">

      <el-col v-for="(item, index) in arrArchivos" :key="`d-${index}`" :span="6" :offset="index > 0 ? 0 : 0" style="padding: 8px">
        <el-card class="card offer-warning">
          		<div class="shape">
						<div class="shape-text">
						TOP	{{index+1}}							
						</div>
					</div>
          <el-container>
            <el-col :span="9"><div class="crop"><img :src="item.icono" class="image"></div></el-col>
            <el-col style="z-index: 2;"><div >
              <span class="span-file"><b>{{ item.titulo }}</b></span>

            </div>
            </el-col>
          

          </el-container>
          <el-container> </el-container>
          <el-divider>  <vue-star  animate="animated bounceIn" color="#ffaf00" v-if="actFavorite===0">
      <i slot="icon" @click="addFavorite($event,item.id)" class="fa fa-star" ></i>
    </vue-star> 
    <vue-star  animate="animated bounceIn" color="#ffaf00" v-else>
      <i slot="icon" @click="addFavorite($event,item.id)" class="fa fa-star favorite"></i>
    </vue-star>  </el-divider>

          <el-row>
            <el-col :span="12"><span class="span-file">Descargas: <b>{{ item.numeroDescargas }}</b> </span></el-col>
            <el-col :span="12"><span class="span-file">Tamaño: <b>{{ item.size }}</b></span></el-col>

          </el-row>
          <el-row>
            <el-col :span="9"><span class="span-file">Vistas: <b>{{ item.numeroConsultas }}</b></span></el-col>

            <el-col :span="15"><span class="span-file">Subido: <b>{{ item.fechaCaptura }}</b></span></el-col>
                 <el-col :span="15"><span class="span-file">Busquedas: <b>{{ item.numeroBusquedas }}</b></span></el-col>

          </el-row><br>

          <el-row class="btnrow">
            <el-button size="small" class="elbutton" type="success" icon="el-icon-download" round @click="DescargarArchivo(item.archivo)">Descargar</el-button>
         
            <el-button size="small" class="elbutton" type="primary" icon="el-icon-view" round @click="verArchivo(item.urlArchivo,item.extension,item.id)">Visualizar</el-button>
          </el-row>

        </el-card>
      </el-col>
    </el-row>

  </el-container>

</template>
<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { MessageBox, Message, Notification } from 'element-ui'
export default {
  components: {
  },
  data() {
    return {
      arrArchivos: [],
      value: 3.7,
      dialogVisible: false,
      url: null,
      actFavorite:0,
      tagvideo:false,
      tagframe:false,
         playerOptions: {
          // videojs options
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          preload:'metadata',
          sources: [{
            type: "video/mp4",
            src: "http://192.168.3.121:8000/storage/Publico/VID-GAS-05 Video de comprobación viáticos.mp4"
          }],
          poster: "/static/images/author.jpg",
        }
      // :'el-icon-star-off',
    }
  },
  props:['is_fav'],
  created() {
    this.$root.$refs.ArchivosRecientes = this
  },
  methods: {
    async DescargarArchivo(file) {
      const config = {
        headers: {
          'content-type': 'application/*'

        }
      }
      const formData = new FormData()
      formData.append('file', file)
     // Proceso de Autoria metodo
          const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', 'Descargó este documento ->' + file)
          formAut.append('evento', 'descargarArchivo()')

          this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      await Api.post('/download', formData, { config, responseType: 'blob'
      })
        .then(function(res) {
          const blob = new Blob([res.data], { type: res.headers['content-type'] })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.slice(file.lastIndexOf('/') + 1)
          link.click()

        })
        .catch(function(error) {
          if (error.response.status === 422) {
            Message({
              message: 'Error 404: No se encuentra el Archivo a Descargar' || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
    },
    verArchivo(file, type,documentodId) {
      if (type == 'xls' || type == 'xlsx') {
        this.url = 'http://view.officeapps.live.com/op/embed.aspx?src=http://192.168.10.235:8000/storage/POT-CON CONTABIOI.xlsx'
      }
      if(type == 'mp4' || type=='avi' || type== 'mpeg'){
        this.tagvideo=true
      }
      
      this.url = file
      this.dialogVisible = true
     
    
      // Proceso de Autoria metodo
      const formAut = new FormData()
      formAut.append('name_view', this.$route.name)
      formAut.append('comentarios', 'Abrio este documento ' + file)
      formAut.append('evento', 'Dashboard_verArchivo()')

      this.$store.dispatch('auditoria/addEventAuditoria', formAut)
      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
        const formData = new FormData()
      formData.append('documentodId', documentodId)

      setTimeout(() =>

        Api.post('/viewarchivo', formData, config)
          .then(function(response) {
            currentObj.success = response.data.success
            currentObj.status = response.statusText
          })
          .catch(function(error) {
            currentObj.output = error
            console.log(error)
          })
      , 1000)
    },
   addFavorite(e,documentodId){
      const target= e.target;
      target.className='fa fa-star favorite';

    const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
      const formData = new FormData()
      formData.append('documentodId', documentodId)

        Api.post('/addFavorito', formData, config)
          .then(function(response) {
          currentObj.success = response.data.success
            currentObj.status = response.statusText
             })
          .catch(function(error) {
            currentObj.output = error
            console.log(error)
          })
    }
  }
}
</script>

<style css="scss" scope>
@import 'https://use.fontawesome.com/releases/v5.7.0/css/all.css';

 iframe {
    display: block;       /* iframes are inline by default */
    background: #000;
    border: none;         /* Reset default border */
    height: 83vh !important;        /* Viewport-relative units */
    width: 100vw;
}
.span-file{
font-size:12px;
/* text-align: justify; */
  text-align: justify;
}
.el-card__body {
    padding: 8px;
}
  .time {
    font-size: 13px;
    color: #999;
  }

 .elbutton{
        padding: 11px 15px !important;
  }

  /* .button {
    padding: 0;
    float: right;
  } */

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
  .VueStar {
    position: relative !important;
}
.VueStar__ground{
      width: 50px;
    height: 25px;
}

.VueStar__icon {
    z-index: 888;
    font-size: 19px;
}

.VueStar__decoration {
    width: 100px;
    height: 100px;
    position: absolute;
    left: -25px;
    top: -35px;
}
 .favorite{
color:#ffaf00;

}

.offer-warning {	border-color: #f0ad4e; }
.offer-warning .shape{
	border-color: transparent #f0ad4e transparent transparent;
	border-color: rgba(255,255,255,0) #f0ad4e rgba(255,255,255,0) rgba(255,255,255,0);
}
.shape{	
	border-style: solid;
    border-width: 0 70px 40px 0;
    float: right;
    position: relative;
    margin-left: -16%;
    left: 3%;
  margin-top: -3%;
    height: 0px;
    width: 0px;
    -webkit-transform: rotate(
360deg
);
    transform: rotate(
360deg
)
}
  
.shape-text{
	color:#fff; font-size:12px; font-weight:bold; position:relative; right: -30px;
    top: -2px; white-space: nowrap;
	-ms-transform:rotate(30deg); /* IE 9 */
	-o-transform: rotate(360deg);  /* Opera 10.5 */
	-webkit-transform:rotate(30deg); /* Safari and Chrome */
	transform:rotate(30deg);
}	
  /* Extra small devices (phones, 600px and down) */
/* @media only screen and (max-width: 600px) {...}

/* Small devices (portrait tablets and large phones, 600px and up) */
/* @media only screen and (min-width: 600px) {...} */

/* Medium devices (landscape tablets, 768px and up) */
/* @media only screen and (min-width: 768px) {...} */

/* Large devices (laptops/desktops, 992px and up) */
@media  screen and (min-width: 900px )and (max-width: 1023px) {

   .card{
    height: 19rem;
    width: 13rem;
    }
    .el-row{
      width:100%;
    }
    .btnrow{
    display: inline-flex;
        float: left;
    margin-left: 3%;
  }
  .elbutton{
       padding: 6px 7px !important;
  }
}
/* Large devices (laptops/desktops, 992px and up) */
@media  screen and (min-width: 1024px )and (max-width: 1199px) {

   .card{
  height: 19.5rem;
    width: 14rem;
    }
    /* .el-row{
      width:100%;
    } */
    /* .btnrow{
    display: inline-flex;
        float: left;
    margin-left: 3%;
  } */
  .elbutton{
    padding: 7px 12px !important;
  }
}

  /* Extra large devices (large laptops and desktops, 1200px and up) */
@media screen and (min-width: 1200px) {
    .card{
           height: 18rem; 
    width: 100%; 
     } 
        .btnrow{
                padding: 0px 3px;
                margin-left: 5%;
  }
   .elbutton{
        padding: 11px 15px !important;
  }
  }
</style>

