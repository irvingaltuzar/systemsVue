<template>
  <div class="ml-5 mr-5 mt-5">
    <div>
      <el-button type="primary" @click="addArea()">
        <i class="fas fa-plus"></i> Agregar usuario
      </el-button>
    </div>
    <div class="mt-4">
      <table class="table table-responsive-lg table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Usuario</th>
            <th>Sub-área</th>
            <th>Líder</th>
            <th>Recibe ticket</th>
            <th>Fecha de creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-if="data">
          <tr v-for="item in data" :key="item.path">
            <td>{{ item.id }}</td>
            <td>{{ item.nombre }} {{ item.apellidos }}</td>
            <td>{{(item.sub_area.deleted_at==null)?item.sub_area.sub_area:''}}</td>
            <td>{{item.leader}}</td>
            <td>{{item.receive_requests}}</td>
            <td>{{ fecha(item.created_at) }}</td>
            <td>
              <el-button
                type="primary"
                icon="el-icon-edit"
                title="Editar"
                circle
                @click="editUser(item,(( item.sub_area.area.deleted_at==null)?  item.sub_area.area.id :''),((item.sub_area.area.location.deleted_at==null)? item.sub_area.area.location.id :''),(item.sub_area.deleted_at==null)?item.sub_area.id:'', item.personal_intelisis_id)"
              />
              <el-button
                type="danger"
                icon="el-icon-delete"
                title="Eliminar"
                circle
                @click="deleteUser(item.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalUser ref="ModalUser" />
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import moment from "moment";
import ModalUser from "./components/ModalUser";
export default {
  name: "SubAreas",
  components: {
    ModalUser,
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
    async editUser(item,area,location,sub_area, user) {
      this.$root.$refs.ModalUser.form.reset();
      this.$root.$refs.ModalUser.form.id=item.id;
      if(location!=''){
        this.$root.$refs.ModalUser.form.location=location;
        this.$root.$refs.ModalUser.onChange(location);
        if(area!=''){
          this.$root.$refs.ModalUser.form.area=area;
          this.$root.$refs.ModalUser.onChangeArea(area)
          this.$root.$refs.ModalUser.form.sub_area=sub_area;
        }
      }
      this.$root.$refs.ModalUser.form.user =user;
      this.$root.$refs.ModalUser.form.leader=(item.leader=='si')? true:false;
      this.$root.$refs.ModalUser.form.receive_requests=(item.receive_requests=='si')? true:false;
      this.$root.$refs.ModalUser.centerDialogVisible = true;
      this.$root.$refs.ModalUser.title = "Editar";
    },
    async deleteUser(id) {
      this.$confirm("Estas Seguro de eliminar el usuario seleccionado?")
        .then((_) => {
          Api.get("destroyUserTicket/" + id).then((res) => {
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
      Api.get("getUserTicket")
        .then((res) => {
          this.data = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addArea() {
      this.$root.$refs.ModalUser.form.reset();
      this.$root.$refs.ModalUser.centerDialogVisible = true;
      this.$root.$refs.ModalUser.title = "Agregar";
    },
  },
};
</script>