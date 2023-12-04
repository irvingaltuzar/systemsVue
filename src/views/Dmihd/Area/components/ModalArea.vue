<template>
  <div>
    <el-dialog
      :title="title + ' área'"
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
          <el-input v-model="form.area" clearable />
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
      form: new Form({
        id: "",
        area: "",
        location: "",
      }),
      rules: {
        area: [
          {
            required: true,
            message: "Por favor Ingresa el área",
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
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalArea = this;
  },
  created() {
    this.getLocations();
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id == "" || this.form.id == null) {
            this.AddArea();
          } else {
            this.EditArea();
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
    async EditArea() {
      const currentObj = this;
      currentObj.status = "";
      await Api.post("editArea", this.form)
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
    async AddArea() {
      const currentObj = this;
      currentObj.status = "";
      await Api.post("storeArea", this.form)
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
      this.$root.$refs.Areas.getAreas();
      this.centerDialogVisible = false;
    },
  },
};
</script>