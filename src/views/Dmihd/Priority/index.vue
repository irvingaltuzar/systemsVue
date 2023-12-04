<template>
  <div class="ml-5 mr-5 mt-5">
    <div>
      <el-button type="primary" @click="addPriority()">
        <i class="fas fa-plus"></i> Agregar Prioridad
      </el-button>
    </div>
    <template>
      <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
        <el-table-column align="center" label="Ubicación">
          <template slot-scope="scope">
            {{
              scope.row.sub_area.area.location.deleted_at != null
                ? ""
                : scope.row.sub_area.area.location.location
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Área">
          <template slot-scope="scope">
            {{
              scope.row.sub_area.area.deleted_at != null
                ? ""
                : scope.row.sub_area.area.area
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Sub-área">
          <template slot-scope="scope">
            {{
              scope.row.sub_area.deleted_at != null
                ? ""
                : scope.row.sub_area.sub_area
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Fecha de creación">
          <template slot-scope="scope">
            {{ fecha(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Acciones">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              title="Editar"
              circle
              @click="editar(scope.row.sub_area.id)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              title="Eliminar"
              circle
              @click="eliminar(scope.row.sub_area.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </template>
    <ModalPriority ref="ModalPriority" />
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import moment from "moment";
import ModalPriority from "./components/ModalPriority";
export default {
  name: "Priority",
  data() {
    return {
      tableData: [],
    };
  },
  components: {
    ModalPriority,
  },
  created() {
    this.$root.$refs.Priority = this;
    this.getPriority();
  },
  methods: {
    async eliminar(id){
        this.$confirm("Estas Seguro de eliminar la prioridad seleccionada?")
        .then((_) => {
          Api.get("destroyPriority/" + id).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "Se ha eliminado correctamente",
                type: "success",
              });
              this.getPriority();
            } else {
              this.$message({
                message: "Ocurrio un error en el proceso",
                type: "error",
              });
              this.getPriority();
            }
          });
        })
        .catch((_) => {});
    },
    async editar(id) {
      Api.get("showPriority/" + id)
        .then((res) => {
          this.$root.$refs.ModalPriority.form.reset();
          this.$root.$refs.ModalPriority.form.id = id;
          if (res.data.sub_area.area.location.deleted_at == null) {
            this.$root.$refs.ModalPriority.form.location =
              res.data.sub_area.area.location.id;
            this.$root.$refs.ModalPriority.onChange(
              res.data.sub_area.area.location.id
            );
            if (res.data.sub_area.area.deleted_at == null) {
              this.$root.$refs.ModalPriority.form.area =
                res.data.sub_area.area.id;
              this.$root.$refs.ModalPriority.onChangeArea(
                res.data.sub_area.area.id
              );
              if (res.data.sub_area.deleted_at == null) {
                this.$root.$refs.ModalPriority.form.sub_area =
                  res.data.sub_area.id;
              }
            }
          }
          this.$root.$refs.ModalPriority.form.baja_num =
            res.data.baja.response_time;
          this.$root.$refs.ModalPriority.form.media_num =
            res.data.media.response_time;
          this.$root.$refs.ModalPriority.form.alta_num =
            res.data.alta.response_time;
          this.$root.$refs.ModalPriority.form.urgente_num =
            res.data.urgente.response_time;
          this.$root.$refs.ModalPriority.form.baja_sol =
            res.data.baja.time_solve;
          this.$root.$refs.ModalPriority.form.media_sol =
            res.data.media.time_solve;
          this.$root.$refs.ModalPriority.form.alta_sol =
            res.data.alta.time_solve;
          this.$root.$refs.ModalPriority.form.urgente_sol =
            res.data.urgente.time_solve;
          this.$root.$refs.ModalPriority.form.baja_select_res =
            res.data.baja.response_format;
          this.$root.$refs.ModalPriority.form.baja_select_sol =
            res.data.baja.solve_format;
          this.$root.$refs.ModalPriority.form.media_select_res =
            res.data.media.response_format;
          this.$root.$refs.ModalPriority.form.media_select_sol =
            res.data.media.solve_format;
          this.$root.$refs.ModalPriority.form.alta_select_res =
            res.data.alta.response_format;
          this.$root.$refs.ModalPriority.form.alta_select_sol =
            res.data.alta.solve_format;
          this.$root.$refs.ModalPriority.form.urgente_select_res =
            res.data.urgente.response_format;
          this.$root.$refs.ModalPriority.form.urgente_select_sol =
            res.data.urgente.solve_format;
          this.$root.$refs.ModalPriority.form.baja_id = res.data.baja.id;
          this.$root.$refs.ModalPriority.form.media_id = res.data.media.id;
          this.$root.$refs.ModalPriority.form.alta_id = res.data.alta.id;
          this.$root.$refs.ModalPriority.form.urgente_id = res.data.urgente.id;
          this.$root.$refs.ModalPriority.centerDialogVisible = true;
          this.$root.$refs.ModalPriority.title = "Editar";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fecha(value) {
      return moment(String(value)).format("DD/MM/YYYY hh:mm");
    },
    addPriority() {
      this.$root.$refs.ModalPriority.form.reset();
      this.$root.$refs.ModalPriority.centerDialogVisible = true;
      this.$root.$refs.ModalPriority.title = "Agregar";
    },
    getPriority() {
      this.listLoading= true;
      Api.get("getPriority")
        .then((res) => {
          this.tableData = res.data;
          this.listLoading= false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
