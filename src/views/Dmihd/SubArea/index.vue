<template>
  <div class="ml-5 mr-5 mt-5">
    <div>
      <el-button type="primary" @click="addArea()">
        <i class="fas fa-plus"></i> Agregar Sub-área
      </el-button>
    </div>
    <div class="mt-4">
      <table class="table table-responsive-lg table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Área</th>
            <th>Sub-área</th>
            <th>Ubicación</th>
            <th>Fecha de creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-if="data">
          <tr v-for="item in data" :key="item.path">
            <td>{{ item.id }}</td>
            <td>{{ ( item.area.deleted_at==null)?  item.area.area :''   }}</td>
            <td>{{ item.sub_area }}</td>
            <td>{{ (item.area.location.deleted_at==null)? item.area.location.location :''  }}</td>
            <td>{{ fecha(item.created_at) }}</td>
            <td>
              <el-button
                type="primary"
                icon="el-icon-edit"
                title="Editar"
                circle
                @click="editLocation(item.id,(( item.area.deleted_at==null)?  item.area.id :''),((item.area.location.deleted_at==null)? item.area.location.id :''),item.sub_area)"
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
import ModalArea from "./components/ModalSubArea";
export default {
  name: "SubAreas",
  components: {
    ModalArea,
  },
  data() {
    return {
      data: null,
    };
  },
  created() {
    this.$root.$refs.SubAreas = this;
    this.getSubAreas();
  },
  methods: {
    fecha(value) {
      return moment(String(value)).format("DD/MM/YYYY hh:mm");
    },
    async editLocation(id,area,location,sub_area) {
      this.$root.$refs.ModalArea.form.reset();
      this.$root.$refs.ModalArea.form.id=id;
      if(location!=''){
        this.$root.$refs.ModalArea.form.location=location;
        this.$root.$refs.ModalArea.onChange(location);
        if(area!=""){
          this.$root.$refs.ModalArea.form.area=area;
        }
      }
      this.$root.$refs.ModalArea.form.sub_area=sub_area;
      this.$root.$refs.ModalArea.centerDialogVisible = true;
      this.$root.$refs.ModalArea.title = "Editar";
    },
    async deleteLocation(id) {
      this.$confirm("Estas Seguro de eliminar la sub-área seleccionada?")
        .then((_) => {
          Api.get("destroySubArea/" + id).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "Se ha eliminado correctamente",
                type: "success",
              });
              this.getSubAreas();
            } else {
              this.$message({
                message: "Ocurrio un error en el proceso",
                type: "error",
              });
              this.getSubAreas();
            }
          });
        })
        .catch((_) => {});
    },
    async getSubAreas() {
      Api.get("getSubAreas")
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