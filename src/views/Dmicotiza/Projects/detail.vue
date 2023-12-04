<template>
  <div v-if="data">
    <div class="pt-4 container">
      <h3 class="text-center">{{ data.project }}</h3>
      <div class="row pt-3">
        <div class="col-12 col-md-6 pt-2">
          <strong>Enganche:</strong> $ {{ formatPrice(data.hitch) }}
        </div>
        <div class="col-12 col-md-6 pt-2">
          <strong>Niveles: </strong>{{ data.level }}
        </div>
        <div class="col-12 col-md-6 pt-2">
          <strong>Cuenta con PG: </strong>{{ data.low_level ? "Si" : "No" }}
        </div>
        <div class="col-12 col-md-6 pt-2">
          <strong>Ocultar subdiviciones: </strong>
          {{ data.hidden_subdivision ? "Si" : "No" }}
        </div>
      </div>
      <div>
        <div class="row">
          <div class="col-12">
            <el-button
              type="primary"
              size="large"
              class="mt-5"
              @click="AddViewProject()"
            >
              Agregar vistas
            </el-button>
            <table class="table table-lg mt-3 mb-3">
              <thead>
                <tr>
                  <th>Vista</th>
                  <th>Posición</th>
                  <th>Subdivisiones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody v-if="data.project_view">
                <tr v-for="(item, index) in data.project_view" :key="index">
                  <td>{{ item.view }}</td>
                  <td>{{ item.position }}</td>
                  <td>{{ item.subdivision }}</td>
                  <td>
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      circle
                    ></el-button>
                    <el-button
                      type="success"
                      icon="el-icon-view"
                      circle
                      @click="viewProject(item.id)"
                    ></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      v-if="item.id && index + 1 == data.project_view.length"
                    ></el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-12">
            <el-button type="primary" size="large" class="mt-5" @click="AddStage()">
              Agregar etapas
            </el-button>
            <table class="table table-lg mt-3 mb-5">
              <thead>
                <tr>
                  <th>Etapa</th>
                  <th>Clasificación</th>
                  <th>Departamentos</th>
                  <th>Estatus</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody v-if="data.stage">
                <tr v-for="(item, index) in data.stage" :key="index">
                  <td>{{ item.stage == 0 ? "F&F" : item.stage }}</td>
                  <td>
                    <div v-if="item.classification">
                      {{ item.classification.classification }}
                    </div>
                  </td>
                  <td>{{ item.quantity_department }}</td>
                  <td>{{ item.status == 1 ? "Activa" : "Desactivada" }}</td>
                  <td>
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      circle
                    ></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      v-if="item.status == 0 && index + 1 == data.stage.length"
                    ></el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <ModalViewProject ref="ModalViewProject" />
    <ModalStage ref="ModalStage" />
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import Form from "vform";
import ModalViewProject from "../ViewProject/components/ModalViewProject";
import ModalStage from "../Stage/components/ModalStage";
export default {
  name: "DetailProject",
  components: {
    ModalViewProject,
    ModalStage
  },
  data() {
    return {
      data: null,
    };
  },
  created() {
    this.$root.$refs.DetailProject = this;
    this.getProject(this.$route.params.idProject);
  },
  methods: {
    AddStage(){
      this.$root.$refs.ModalStage.title = "Agregar";
      this.$root.$refs.ModalStage.form.reset();
      this.$root.$refs.ModalStage.form.project=this.$route.params.idProject;
      this.$root.$refs.ModalStage.centerDialogVisible = true;
    },
    AddViewProject() {
      this.$root.$refs.ModalViewProject.title = "Agregar";
      this.$root.$refs.ModalViewProject.form.reset();
      this.$root.$refs.ModalViewProject.form.position=this.data.project_view.length;
      this.$root.$refs.ModalViewProject.form.project=this.$route.params.idProject;
      this.$root.$refs.ModalViewProject.centerDialogVisible = true;
    },
    viewProject(id) {
      this.$router.push({ path: "/view/" + id });
    },
    async getProject(id) {
      Api.get("project/" + id)
        .then((res) => {
          this.data = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(",", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
