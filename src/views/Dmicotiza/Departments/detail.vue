<template>
  <div class="ml-5 mr-5 pt-5">
    <div class="row" v-if="data">
      <div class="col-12 col-md-6" v-if="data.project">
        <p><strong>Proyecto: </strong>{{ data.project.project }}</p>
      </div>
      <div class="col-12 col-md-6" v-if="data.project_view">
        <p><strong>Vista: </strong>{{ data.project_view.view }}</p>
      </div>
      <div class="col-12 pb-3">
        <hr />
      </div>
      <div class="col-12 col-md-4">
        <p>
          <strong>Número de departameto: </strong
          >{{ data.level == 0 ? "PG" : data.level }}{{ data.number }}
        </p>
      </div>
      <div class="col-12 col-md-4" v-if="data.type_department">
        <p><strong>Tipo: </strong> {{ data.type_department.type }}</p>
      </div>
      <div class="col-12 col-md-4">
        <p>
          <strong>Clasificación: </strong
          >{{ data.classification.classification }}
        </p>
      </div>
      <div class="col-12 col-md-4">
        <p><strong>Nivel: </strong>{{ data.level }}</p>
      </div>
      <div class="col-12 col-md-4">
        <p><strong>Cajones: </strong>{{ data.drawers }}</p>
      </div>
      <div class="col-12 col-md-4"></div>
      <div class="col-12 col-md-4">
        <p><strong>M<sup>2</sup>: </strong>{{ data.m2 }}</p>
      </div>
      <div class="col-12 col-md-4">
        <p>
          <strong>Precio por m<sup>2</sup>: </strong>$
          {{ formatPrice(data.price_m2) }}
        </p>
      </div>
      <div class="col-12 col-md-4">
        <p>
          <strong>Precio actual: </strong
          >{{
            stagePrice.price != null ? "$ " + formatPrice(stagePrice.price) : ""
          }}
        </p>
      </div>
      <div class="col-12 col-md-4" v-if="data.classification.stage">
        <p>
          <strong>Etapa: </strong>
          <span v-for="item in data.classification.stage" :key="item.path">{{
            item.stage == 0 ? "F&F" : item.stage
          }}</span>
        </p>
      </div>
      <div class="col-12 col-md-4" v-if="data.statu">
        <p><strong>Estatus: </strong>{{ data.statu.status }}</p>
      </div>
      <div class="pt-4 pb-3 text-center col-12" v-if="data.statu">
        <div v-if="data.statu.status == 'Disponible'">
          <el-button type="success" size="large" @click="editDepartment()">
            Editar
          </el-button>
          <el-button
            type="warning"
            size="large"
            @click="statuDeparment('Apartado')"
          >
            Apartar
          </el-button>
          <el-button
            type="info"
            size="large"
            @click="statuDeparment('Bloqueado')"
          >
            Bloquear
          </el-button>
          <el-button type="danger" size="large" @click="deleteDeparment()">
            Eliminar
          </el-button>
        </div>
        <div v-if="data.statu.status == 'Apartado'">
          <el-button
            type="success"
            size="large"
            @click="statuDeparment('Vendido')"
          >
            Vender
          </el-button>
          <el-button
            type="danger"
            size="large"
            @click="statuDeparment('Disponible')"
          >
            Liberar
          </el-button>
        </div>
        <div v-if="data.statu.status == 'Bloqueado'">
          <el-button
            type="success"
            size="large"
            @click="statuDeparment('Vendido')"
          >
            Vender
          </el-button>
          <el-button
            type="danger"
            size="large"
            @click="statuDeparment('Disponible')"
          >
            Desbloquear
          </el-button>
        </div>
      </div>
    </div>

    <hr />
    <div v-if="data" class=" pt-4">
      <div v-if="data.statu">
        <el-button type="primary" size="large" @click="modalPrice()" v-if="data.statu.status == 'Disponible'">
          Agregar precio
        </el-button>
      </div>
    </div>
    <table class="table table-lg mt-4 mb-5" v-if="stagePrice">
      <thead>
        <tr>
          <th>Etapa</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-if="stagePrice.stage_price">
        <tr v-for="(item, index) in stagePrice.stage_price" :key="index">
          <td>{{ item.stage == 0 ? "F&F" : item.stage }}</td>
          <td v-if="item.price">$ {{ formatPrice(item.price) }}</td>
          <td>
            <div v-if="data">
              <div v-if="data.statu">
                <div v-if="data.statu.status == 'Disponible'">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    v-if="item"
                    @click="editStagePrice(item)"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    v-if="item.id && index+1== stagePrice.stage_price.length"
                    @click="deleteStagePrice(item.id)"
                  ></el-button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <EditDeparment ref="EditDeparment" />
    <ModalPrice ref="ModalPrice" />
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import EditDeparment from "./components/EditDeparment";
import ModalPrice from "./components/ModalPrice";
export default {
  name: "detailDepartment",
  components: {
    EditDeparment,
    ModalPrice,
  },
  data() {
    return {
      stagePrice: null,
      data: null,
      arrayLenght: 0,
    };
  },
  created() {
    this.$root.$refs.detailDepartment = this;
    this.getDepartments(this.$route.params.idDepartment);
  },
  methods: {
    statuDeparment(statu) {
      this.$confirm("Estas seguro de cambiar el estatus?")
        .then((_) => {
          this.changeStatus(statu, this.data.id);
        })
        .catch((_) => {});
    },
    async changeStatus(statu, id) {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("status", statu);
      await Api.post("statusDeparment", formData)
        .then((res) => {
          if (res.status === 200) {
            this.getDepartments(this.$route.params.idDepartment);
            this.$message({
              message: "Se ha actualizado el estatus",
              type: "success",
            });
          } else {
            this.$message({
              message: "Ocurrio un error en el proceso",
              type: "error",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    editStagePrice(item) {
      this.$root.$refs.ModalPrice.title = "Editar";
      this.$root.$refs.ModalPrice.form.reset();
      this.$root.$refs.ModalPrice.form.id = item.id;
      this.$root.$refs.ModalPrice.form.price = item.price;
      this.$root.$refs.ModalPrice.form.stage = item.stage;
      this.$root.$refs.ModalPrice.form.department_id = this.data.id;
      this.$root.$refs.ModalPrice.centerDialogVisible = true;
    },
    deleteStagePrice(id) {
      this.$confirm("Estas seguro de eliminar el departamento?")
        .then((_) => {
          this.EliminarPrice(id);
        })
        .catch((_) => {});
    },
    deleteDeparment() {
      this.$confirm("Estas seguro de eliminar el departamento?")
        .then((_) => {
          this.Eliminar();
        })
        .catch((_) => {});
    },
    async EliminarPrice(id) {
      Api.get("destroyStagePrice/" + id).then((res) => {
        if (res.status === 200) {
          this.getDepartments(this.$route.params.idDepartment);
          this.$message({
            message: "Se ha eliminado correctamente",
            type: "success",
          });
        } else {
          this.getDepartments(this.$route.params.idDepartment);
          this.$message({
            message: "Ocurrio un error en el proceso",
            type: "error",
          });
        }
      });
    },
    async Eliminar() {
      Api.get("destroyDeparment/" + this.data.id).then((res) => {
        if (res.status === 200) {
          const tags = this.$store.state.tagsView.visitedViews;

          this.$nextTick(() => {
            let i = 0;
            for (const tag of tags) {
              i++;
              if (tag.path === this.$route.path) {
                tags.splice(i, 1);
                break;
              }
            }
          });
          this.$router.go(-1);
          this.$message({
            message: "Se ha eliminado correctamente",
            type: "success",
          });
          this.$router.push({
            path: "/project/" + this.data.project.id,
          });
        } else if (res.status === 202) {
          this.$message({
            message: "No se puede eliminar el departamento con estatu actual",
            type: "error",
          });
        } else {
          this.$message({
            message: "Ocurrio un error en el proceso",
            type: "error",
          });
        }
      });
    },
    modalPrice() {
      this.$root.$refs.ModalPrice.title = "Agregar";
      this.$root.$refs.ModalPrice.form.reset();
      this.$root.$refs.ModalPrice.form.price = this.data.project.hitch;
      this.$root.$refs.ModalPrice.form.stage = this.arrayLenght;
      this.$root.$refs.ModalPrice.form.department_id = this.data.id;
      this.$root.$refs.ModalPrice.centerDialogVisible = true;
    },
    editDepartment() {
      this.$root.$refs.EditDeparment.form.reset();
      this.$root.$refs.EditDeparment.onChange(this.data.classification.id)
      this.$root.$refs.EditDeparment.centerDialogVisible = true;
      this.$root.$refs.EditDeparment.form.id = this.data.id;
      this.$root.$refs.EditDeparment.form.level = this.data.level;
      this.$root.$refs.EditDeparment.form.number = this.data.number;
      this.$root.$refs.EditDeparment.form.drawers = this.data.drawers;
      this.$root.$refs.EditDeparment.form.price_m2 = this.data.price_m2;
      this.$root.$refs.EditDeparment.form.m2 = this.data.m2;
      this.$root.$refs.EditDeparment.form.type = this.data.type_department.id;
      this.$root.$refs.EditDeparment.form.classification = this.data.classification.id;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(",", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async getDepartments(id) {
      Api.get("stagePrice/" + id)
        .then((res) => {
          this.stagePrice = res.data;
          this.arrayLenght = this.stagePrice.stage_price.length;
        })
        .catch((error) => {
          console.log(error);
        });
      Api.get("/department/show/" + id)
        .then((res) => {
          this.data = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
