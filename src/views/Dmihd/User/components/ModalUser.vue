<template>
  <div>
    <el-dialog
      :title="title + ' usuario'"
      :visible.sync="centerDialogVisible"
      width="50%"
      height="100%"
      top="3vh"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item label="Ubicación" prop="location">
          <el-select
            v-model="form.location"
            placeholder="Selecciona"
            class="w-100"
            clearable
            filterable
            @change="onChange($event)"
          >
            <el-option
              v-for="item in locations"
              :key="item.path"
              :label="item.location"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Área" prop="area">
          <el-select
            v-model="form.area"
            placeholder="Selecciona"
            class="w-100"
            clearable
            filterable
            @change="onChangeArea($event)"
          >
            <el-option
              v-for="item in areas"
              :key="item.path"
              :label="item.area"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Sub-área" prop="sub_area">
          <el-select
            v-model="form.sub_area"
            placeholder="Selecciona"
            class="w-100"
            clearable
            filterable
          >
            <el-option
              v-for="item in sub_areas"
              :key="item.path"
              :label="item.sub_area"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Usuario" prop="user">
          <el-select
            v-model="form.user"
            placeholder="Selecciona"
            class="w-100"
            clearable
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.path"
              :label="item.nombre + ' ' + item.apellidos"
              :value="item.personal_intelisis_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Líder" prop="leader">
          <el-switch
            v-model="form.leader"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="Recibe solicitudes" prop="receive_requests">
          <el-switch
            v-model="form.receive_requests"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refresh"> Cancelar </el-button>
        <el-button type="primary" @click="onSubmit"> Guardar </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import Form from "vform";
export default {
  data() {
    var validate = (rule, value, callback) => {
      callback();
    };
    return {
      centerDialogVisible: false,
      title: "",
      locations: [],
      areas: [],
      users: [],
      sub_areas: [],
      form: new Form({
        id: "",
        area: "",
        location: "",
        sub_area: "",
        user: "",
        leader: false,
        receive_requests: false
      }),
      rules: {
        area: [
          {
            required: true,
            message: "Por favor Ingresa el área",
            trigger: "change",
          },
        ],
        user: [
          {
            required: true,
            message: "Por favor Ingresa el usuario",
            trigger: "change",
          },
        ],
        location: [
          {
            required: true,
            message: "Por favor Ingresa la ubicación",
            trigger: "change",
          },
        ],
        sub_area: [
          {
            required: true,
            message: "Por favor Ingresa la sub-área",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalUser = this;
  },
  created() {
    this.getLocations();
    this.getUserView();
  },
  methods: {
    onChange(event) {
      this.form.area = null;
      this.areas = [];
      if (event != "" && event != null) {
        Api.get("/getAreaLocation/" + event)
          .then((res) => {
            this.areas = res.data;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    onChangeArea(event) {
      this.form.sub_area = null;
      this.sub_areas = [];
      if (event != "" && event != null) {
        Api.get("/getSubAreaArea/" + event)
          .then((res) => {
            this.sub_areas = res.data;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id == "" || this.form.id == null) {
            this.storeUserTicket();
          } else {
            this.editUserTicket();
          }
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async getLocations() {
      Api.get("getLocations")
        .then((res) => {
          this.locations = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUserView() {
      Api.get("getUserView")
        .then((res) => {
          this.users = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async editUserTicket() {
      const currentObj = this;
      currentObj.status = "";
      await Api.post("editUserTicket", this.form)
        .then((res) => {
          if (res.status === 200) {
            this.refresh();
            this.$message({
              message: "Se ha actualizado correctamente",
              type: "success",
            });
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
    async storeUserTicket() {
      const currentObj = this;
      currentObj.status = "";
      await Api.post("storeUserTicket", this.form)
        .then((res) => {
          if (res.status === 200) {
            this.refresh();
            this.$message({
              message: "Se ha agregado correctamente",
              type: "success",
            });
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
    refresh() {
      this.$root.$refs.SubAreas.getSubAreas();
      this.centerDialogVisible = false;
    },
  },
};
</script>