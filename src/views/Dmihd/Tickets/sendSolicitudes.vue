<template>
  <div class="ml-5 mr-5 mt-4">
    <div><h3 class="text-center pb-3">Solicitudes creadas</h3></div>
    <el-form ref="form" :model="form" enctype="multipart/form-data">
      <div class="row pb-4">
        <div class="col-md-3">
          <el-date-picker
            v-model="form.fecha"
            type="daterange"
            start-placeholder="Fecha Inicio"
            end-placeholder="Fecha Final"
            class="w-100"
            format="dd/MM/yyyy"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
            >
          </el-date-picker>
        </div>
        <div class="col-md-4">
          <el-input placeholder="Asunto" v-model="form.asunto"></el-input>
        </div>
        <div class="col-md-3">
          <el-select
            v-model="form.addressee_secundary"
            placeholder="Destinatario"
            class="w-100"
            clearable
            filterable
          >
            <el-option
              v-for="item in addressee_secundaries"
              :key="item.idpersonal"
              :label="item.nombre + ' ' + item.apellidos"
              :value="item.idpersonal"
            >
            </el-option>
          </el-select>
        </div>
        <div class="col-md-2">
          <el-button
            type="warning"
            icon="el-icon-search"
            circle
            @click="filter()"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-close"
            circle
            @click="limpiar()"
          ></el-button>
        </div>
      </div>
      <hr class="mb-4" />
      <div class="row mb-5">
        <el-radio v-model="form.status" label="" @change="filter()">Todas</el-radio>
        <el-radio v-model="form.status" label="Abierto" @change="filter()">Abiertas</el-radio>
        <el-radio v-model="form.status" label="Pendiente" @change="filter()">Pendientes</el-radio>
        <el-radio v-model="form.status" label="Resuelto" @change="filter()">Resueltas</el-radio>
        <el-radio v-model="form.status" label="Cerrado" @change="filter()">Cerradas</el-radio>
        <el-radio v-model="form.status" label="Detenido" @change="filter()">Detenidas</el-radio>
        <el-radio v-model="form.status" label="Cancelado" @change="filter()">Canceladas</el-radio>
      </div>
    </el-form>
    <template>
      <el-table
        v-loading="listLoading"
        :data="pagedTableData"
        style="width: 100%"
      >
        <el-table-column align="center" label="Id">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Destinatario">
          <template slot-scope="scope">
            {{
              subStr(
                scope.row.participants[0].user.nombre +
                  " " +
                  scope.row.participants[0].user.apellidos
              )
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Asunto">
          <template slot-scope="scope">
            {{ subStr(scope.row.subject) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Estado">
          <template slot-scope="scope">
            {{ scope.row.ticket_statuse.status }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Estatus">
          <template slot-scope="scope">
            {{ scope.row.status.status }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Prioridad">
          <template slot-scope="scope">
            {{ scope.row.priority_sub_area.priority.priority }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Fecha">
          <template slot-scope="scope">
            {{ fecha(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Acciones">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-view" circle @click="detailTickets(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="this.tableData.length"
        @current-change="setPage"
      >
      </el-pagination>
    </template>
  </div>
</template>
<script>
import Form from "vform";
import Api from "@/store/modules/Api";
import moment from "moment";
export default {
  name: "sendTickets",
  components: {},
  data() {
    return {
      tableData: [],
      addressee_secundaries: [],
      page: 1,
      pageSize: 10,
      form: new Form({
        fecha: "",
        asunto: "",
        status:"",
        addressee_secundary: "",
      }),
    };
  },
  created() {
    this.$root.$refs.sendTickets = this;
    this.getSendTickets();
    this.getUsuarios();
  },
  computed: {
    pagedTableData() {
      return this.tableData.slice(
        this.pageSize * this.page - this.pageSize,
        this.pageSize * this.page
      );
    },
  },
  methods: {
    limpiar() {
      this.filter();
      this.setPage(1);
      this.form.fecha = "";
      this.form.asunto = "";
      this.form.addressee_secundary = "";
    },
    async filter() {
      this.listLoading = true;
      await Api.post("filterSendTicket", this.form)
        .then((res) => {
          if (res.status === 200) {
            this.tableData = res.data;
            this.listLoading = false;
          } else {
            this.$message({
              message: res.data.error,
              type: "warning",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    setPage(val) {
      this.page = val;
    },
    async getUsuarios() {
      await Api.get("/getUsuariosEmail")
        .then((res) => {
          this.addressee_secundaries = res.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    fecha(value) {
      return moment(String(value)).format("DD/MM/YYYY hh:mm");
    },
    subStr(string) {
      return string.substring(0, 35) + (string.length > 35 ? "..." : "");
    },
    async getSendTickets() {
      this.listLoading = true;
      Api.get("sendTickets")
        .then((res) => {
          this.tableData = res.data;
          this.listLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
     detailTickets(id){
      this.$router.push({
        path: `/solicitud_enviada/${id}`,
      });
    },
  },
};
</script>
