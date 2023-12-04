<template>
  <div class="ml-5 mr-5 mt-5">
    <div>
      <el-button type="primary" @click="addLocation()">
        <i class="fas fa-plus"></i> Agregar ubicación
      </el-button>
    </div>
    <div class="mt-4">
      <table class="table table-responsive-lg table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Ubicación</th>
            <th>Fecha de creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-if="data">
          <tr v-for="item in data" :key="item.path">
            <td>{{ item.id }}</td>
            <td>{{ item.location }}</td>
            <td>{{ fecha(item.created_at) }}</td>
            <td>
              <el-button
                type="primary"
                icon="el-icon-edit"
                title="Editar"
                circle
                @click="editLocation(item.id,item.location)"
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
    <ModalLocation ref="ModalLocation" />
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import moment from "moment";
import ModalLocation from "./components/ModalLocation";
export default {
  name: "Locations",
  components: {
    ModalLocation,
  },
  data() {
    return {
      data: null,
    };
  },
  created() {
    this.$root.$refs.Locations = this;
    this.getLocations();
  },
  methods: {
    fecha(value) {
      return moment(String(value)).format("DD/MM/YYYY hh:mm");
    },
    async editLocation(id,location) {
      this.$root.$refs.ModalLocation.form.reset();
      this.$root.$refs.ModalLocation.form.id=id;
      this.$root.$refs.ModalLocation.form.location=location;
      this.$root.$refs.ModalLocation.centerDialogVisible = true;
      this.$root.$refs.ModalLocation.title = "Editar";
    },
    async deleteLocation(id) {
      this.$confirm("Estas Seguro de eliminar la ubicación seleccionada?")
        .then((_) => {
          Api.get("destroyLocation/" + id).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "Se ha eliminado correctamente",
                type: "success",
              });
              this.getLocations();
            } else {
              this.$message({
                message: "Ocurrio un error en el proceso",
                type: "error",
              });
              this.getLocations();
            }
          });
        })
        .catch((_) => {});
    },
    async getLocations() {
      Api.get("getLocations")
        .then((res) => {
          this.data = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addLocation() {
      this.$root.$refs.ModalLocation.form.reset();
      this.$root.$refs.ModalLocation.centerDialogVisible = true;
      this.$root.$refs.ModalLocation.title = "Agregar";
    },
  },
};
</script>