<template>
  <div class="ml-4 mr-4 mt-4">
    <div class="row mb-5">
      <div class="col-12 col-md-9">
        <div class="rounded shadow p-3 mb-5 bg-light border border-light">
          <h5 class="text-center pb-3"><strong>Solicitud</strong></h5>
          <div class="pb-2"><strong>Destinatario:</strong></div>
          <div class="pb-2"><strong>CC:</strong></div>
          <div class="pb-2"><strong>Asunto:</strong> {{solicitud[0].subject}}</div>
          <div class="row">
            <div class="col-md-4 pb-2"><strong>Ubicación:</strong> {{solicitud[0].sub_area.area.location.location}}</div>
            <div class="col-md-4 pb-2"><strong>Área:</strong> {{solicitud[0].sub_area.area.area}}</div>
            <div class="col-md-4 pb-2"><strong>Sub-área:</strong> {{solicitud[0].sub_area.sub_area}}</div>
          </div>
          <div class="pb-2" ><strong>Descripción:</strong><div v-html="solicitud[0].description"></div> </div>
          <div class="pb-2"><strong>Fecha:</strong></div>
          <div class="pb-2"><strong>Archivos:</strong></div>
          <div class="pt-3 mt-3 text-right border-top border-info">
            <el-button type="warning" class="mr-2">Actividades</el-button>
            <el-button type="success" class="mr-2">Agregar participante</el-button>
            <el-button type="danger" class="mr-2">Cancelar ticket</el-button>
          </div>
        </div>

        <div class="rounded shadow p-3 mb-5 bg-light border border-light">
          <strong><i class="el-icon-s-custom"></i></strong>
          <div class="pt-3 pb-2"><strong>Descripción:</strong></div>
          <div class="pb-2"><strong>Fecha:</strong></div>
          <div class="pb-2"><strong>Archivos:</strong></div>
        </div>
        <div class="rounded shadow p-3 bg-light pt-3 pb-3 border border-light">
          <el-button type="success" class="mr-4"
            >Agregar participante</el-button
          >
          <el-button type="primary" class="mr-4">Responder</el-button>
          <el-button type="danger">Cancelar ticket</el-button>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="rounded shadow p-2 h-100 bg-light">
          <h5 class="text-center pb-3"><strong>Archivos</strong></h5>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Form from "vform";
import Api from "@/store/modules/Api";
export default {
  data() {
    return {
      solicitud:"",
      form: new Form({
        id: "",
      }),
    };
  },
  created() {
    this.showTicket();
  },
  methods:{
    async showTicket() {
      await Api.get("/showTicket/"+this.$route.params.id)
        .then((res) => {
          this.solicitud = res.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  }
};
</script>
