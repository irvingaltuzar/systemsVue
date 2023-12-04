<template>
  <div class="ml-5 mr-5 mt-5">
    <div>
      <el-button type="primary" @click="addArea()">
        <i class="fas fa-plus"></i> Agregar Área
      </el-button>
    </div>
    <div class="mt-4">
      <table class="table table-responsive-lg table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Área</th>
            <th>Ubicación</th>
            <th>Fecha de creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-if="data">
          <tr v-for="item in data" :key="item.path">
            <td>{{ item.id }}</td>
            <td>{{ item.area }}</td>
            <td>{{ (item.location.deleted_at==null)? item.location.location :''  }}</td>
            <td>{{ fecha(item.created_at) }}</td>
            <td>
              <el-button
                type="primary"
                icon="el-icon-edit"
                title="Editar"
                circle
                @click="editLocation(item.id,item.area,((item.location.deleted_at==null)? item.location.id :''))"
              />
              <el-button
                type="danger"
                icon="el-icon-delete"
                title="Eliminar"
                circle
                @click="deleteLocation(item.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalArea ref="ModalArea" />
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import moment from "moment";
import ModalArea from "./components/ModalArea";
export default {
  name: "Areas",
  components: {
    ModalArea,
  },
  data() {
    return {
      data: null,
    };
  },
  created() {
    this.$root.$refs.Areas = this;
    this.getAreas();
  },
  methods: {
    fecha(value) {
      return moment(String(value)).format("DD/MM/YYYY hh:mm");
    },
    async editLocation(id,area,location) {
      this.$root.$refs.ModalArea.form.reset();
      this.$root.$refs.ModalArea.form.id=id;
      this.$root.$refs.ModalArea.form.area=area;
      if(location !=""){
        this.$root.$refs.ModalArea.form.location=location;
      }
      this.$root.$refs.ModalArea.centerDialogVisible = true;
      this.$root.$refs.ModalArea.title = "Editar";
    },
    async deleteLocation(id) {
      this.$confirm("Estas Seguro de eliminar la área seleccionada?")
        .then((_) => {
          Api.get("destroyArea/" + id).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "Se ha eliminado correctamente",
                type: "success",
              });
              this.getAreas();
            } else {
              this.$message({
                message: "Ocurrio un error en el proceso",
                type: "error",
              });
              this.getAreas();
            }
          });
        })
        .catch((_) => {});
    },
    async getAreas() {
      Api.get("getAreas")
        .then((res) => {
          this.data = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addArea() {
      this.$root.$refs.ModalArea.form.reset();
      this.$root.$refs.ModalArea.centerDialogVisible = true;
      this.$root.$refs.ModalArea.title = "Agregar";
    },
  },
};
</script>