<template>
  <div class="ml-5 mr-5 mt-5">
    <h3 class="text-center">Sistema de solicitudes</h3>
    <div class="row pt-3 text-center pb-5">
      <div class="col-12 col-md-3"></div>
      <div class="col-12 col-md-2">
        <div
          class="rounded-circle ticket_container border border-primary pointer"
          title="Crear ticket" @click="addTicket()"
        >
          <i class="fas fa-ticket-alt sub_icono"></i
          ><i class="fas fa-plus icono_inferior border border-dark"></i>
          <p class="font-weight-bold pt-2 titulo_ticket">Crear solicitud</p>
        </div>
      </div>
      <div class="col-12 col-md-2">
        <div
          class="rounded-circle ticket_container border border-success pointer"
          title="Ticket creados" @click="sendTickets()"
        >
          <i class="fas fa-ticket-alt sub_icono"></i
          ><i class="fas fa-arrow-right icono_inferior border border-dark"></i>
          <p class="font-weight-bold pt-2 titulo_ticket">Solicitudes creadas</p>
        </div>
      </div>
      <div class="col-12 col-md-2">
        <div
          class="rounded-circle ticket_container border border-warning pointer"
          title="Ticket recibidos" @click="requestTickets()"
        >
          <i class="fas fa-ticket-alt sub_icono"></i
          ><i class="fas fa-arrow-left icono_inferior border border-dark"></i>
          <p class="font-weight-bold pt-2 titulo_ticket">Solicitudes recibidas</p>
        </div>
        <div class="col-12 col-md-3"></div>
      </div>
    </div>
    <el-divider content-position="center"><i class="el-icon-star-on"></i>Dashboard de solicitudes<i class="el-icon-star-on"></i></el-divider>
    <GraficaStatusTicket ref="Grafica" />
    <ModalTicket ref="ModalTicket" />
  </div>
</template>
<script>
import GraficaStatusTicket from "./components/GraficaStatusTicket";
import ModalTicket from "./components/ModalTicket";
export default {
  name: "ticket",
  components: {
    GraficaStatusTicket,
    ModalTicket
  },
  methods: {
    addTicket(){
      this.$root.$refs.ModalTicket.form.reset();
      this.$root.$refs.ModalTicket.centerDialogVisible = true;
       this.$root.$refs.ModalTicket.title="Crear";
    },
    sendTickets(){
      this.$router.push({
        path: "/solicitudes_enviadas",
      });
    },
    requestTickets(){
      this.$router.push({
        path: "/solicitudes_recibidas",
      });
    }
  }
}
</script>
<style scoped>
.sub_icono:before {
  font-size: 50px;
}
.icono_inferior {
  background-color: #ccc;
  border-radius: 50%;
  padding: 4px 5px;
  margin-left: -15px;
}
.ticket_container {
  width: 142px;
  height: 142px;
  padding-top: 1.6rem;
}
.ticket_container:hover {
  background-color: #409eff2b;
}
.titulo_ticket{
    font-size: 12px;
}
</style>
