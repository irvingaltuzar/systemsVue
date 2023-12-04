<template>
  <div>
    <el-dialog
      :title="title + ' prioridad'"
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
        <label>Baja</label>
        <el-form-item label="Tiempo de respuesta" prop="baja_select_res" >
           <div class="row w-100">
            <div class="col-6">
              <el-input-number v-model="form.baja_num" :min="1" clearable />
            </div>
            <div class="col-6">
              <el-select
                v-model="form.baja_select_res"
                placeholder="Selecciona"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>

         <el-form-item label="Tiempo de solución" prop="baja_select_sol" >
           <div class="row w-100">
            <div class="col-6">
              <el-input-number v-model="form.baja_sol" :min="1" clearable />
            </div>
            <div class="col-6">
              <el-select
                v-model="form.baja_select_sol"
                placeholder="Selecciona"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>

        <label>Media</label>
        <el-form-item label="Tiempo de respuesta" prop="media_select_res" >
           <div class="row w-100">
            <div class="col-6">
              <el-input-number v-model="form.media_num" :min="1" clearable />
            </div>
            <div class="col-6">
              <el-select
                v-model="form.media_select_res"
                placeholder="Selecciona"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Tiempo de solución" prop="media_select_sol" >
           <div class="row w-100">
            <div class="col-6">
              <el-input-number v-model="form.media_sol" :min="1" clearable />
            </div>
            <div class="col-6">
              <el-select
                v-model="form.media_select_sol"
                placeholder="Selecciona"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>

        <label>Alta</label>
        <el-form-item label="Tiempo de respuesta" prop="alta_select_res" >
           <div class="row w-100">
            <div class="col-6">
              <el-input-number v-model="form.alta_num" :min="1" clearable />
            </div>
            <div class="col-6">
              <el-select
                v-model="form.alta_select_res"
                placeholder="Selecciona"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Tiempo de solución" prop="alta_select_sol" >
           <div class="row w-100">
            <div class="col-6">
              <el-input-number v-model="form.alta_sol" :min="1" clearable />
            </div>
            <div class="col-6">
              <el-select
                v-model="form.alta_select_sol"
                placeholder="Selecciona"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>

        <label>Urgente</label>
        <el-form-item label="Tiempo de respuesta" prop="urgente_select_res" >
           <div class="row w-100">
            <div class="col-6">
              <el-input-number v-model="form.urgente_num" :min="1" clearable />
            </div>
            <div class="col-6">
              <el-select
                v-model="form.urgente_select_res"
                placeholder="Selecciona"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Tiempo de solución" prop="urgente_select_sol" >
           <div class="row w-100">
            <div class="col-6">
              <el-input-number v-model="form.urgente_sol" :min="1" clearable />
            </div>
            <div class="col-6">
              <el-select
                v-model="form.urgente_select_sol"
                placeholder="Selecciona"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
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
      sub_areas: [],
      options: [
        {
          value: "minutos",
          label: "Minutos",
        },
        {
          value: "horas",
          label: "Horas",
        },
        {
          value: "dias",
          label: "Días",
        },
      ],
      form: new Form({
        id: "",
        area: "",
        location: "",
        sub_area: "",
        baja_num: 1,
        media_num: 1,
        alta_num: 1,
        urgente_num: 1,
        baja_sol: 1,
        media_sol: 1,
        alta_sol: 1,
        urgente_sol: 1,
        baja_select_res: "",
        baja_select_sol: "",
        media_select_res: "",
        media_select_sol: "",
        alta_select_res: "",
        alta_select_sol: "",
        urgente_select_res: "",
        urgente_select_sol: "",
        baja_id:"",
        media_id:"",
        alta_id:"",
        urgente_id:""
      }),
      rules: {
        area: [
          {
            required: true,
            message: "Por favor ingresa el área",
            trigger: "change",
          },
        ],
        location: [
          {
            required: true,
            message: "Por favor ingresa la ubicación",
            trigger: "change",
          },
        ],
        sub_area: [
          {
            required: true,
            message: "Por favor ingresa la sub-área",
            trigger: "change",
          },
        ],
        baja_num: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de respuesta",
            trigger: "change",
          },
        ],
        media_num: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de respuesta",
            trigger: "change",
          },
        ],
        alta_num: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de respuesta",
            trigger: "change",
          },
        ],
        urgente_num: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de respuesta",
            trigger: "change",
          },
        ],
        baja_sol: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de solución",
            trigger: "change",
          },
        ],
        media_sol: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de solución",
            trigger: "change",
          },
        ],
        alta_sol: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de solución",
            trigger: "change",
          },
        ],
        urgente_sol: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de solución",
            trigger: "change",
          },
        ],
        baja_select_res: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de respuesta",
            trigger: "change",
          },
        ],
        baja_select_sol: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de solución",
            trigger: "change",
          },
        ],
        media_select_res: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de respuesta",
            trigger: "change",
          },
        ],
        media_select_sol: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de solución",
            trigger: "change",
          },
        ],
        alta_select_res: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de respuesta",
            trigger: "change",
          },
        ],
        alta_select_sol: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de solución",
            trigger: "change",
          },
        ],
        urgente_select_res: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de respuesta",
            trigger: "change",
          },
        ],
        urgente_select_sol: [
          {
            required: true,
            message: "Por favor ingrese el tiempo de solución",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalPriority = this;
  },
  created() {
    this.getLocations();
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id == "" || this.form.id == null) {
            this.AddPriority();
          } else {
            this.EditPriority();
          }
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async AddPriority() {
      await Api.post("storePriority", this.form)
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
    async EditPriority() {
      await Api.post("editPriority", this.form)
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
    async getLocations() {
      Api.get("getLocations")
        .then((res) => {
          this.locations = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
    refresh() {
      this.$root.$refs.Priority.getPriority();
      this.centerDialogVisible = false;
    },
  },
};
</script>