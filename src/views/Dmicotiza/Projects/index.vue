<template>
  <div class="dashboard-editor-container pl-3 pr-3">
    <div class="row mb-5" v-if="data">
      <div class="col-12 pt-4">
        <el-button type="danger" size="large" @click="modalProject()"> Agregar proyecto </el-button>
      </div>
      <div v-if="data.projects.length == 0" class="text-center mt-5 w-100">
        <h2 class="font-weight-bold">
          Actualmente no existen proyectos registrados.
        </h2>
      </div>
      <div
        class="col-12 col-md-4 mt-4 text-center"
        v-for="item in data.projects"
        :key="item.path"
      >
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-10">
                <h5>{{ item.project }}</h5>
              </div>
              <div class="text-right col-2">
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-view"
                  circle
                  title="Detalle del proyecto"
                  @click="detailProject(item.id)"
                ></el-button>
              </div>
            </div>
            <img
              :src="data.url + item.logo"
              :alt="'Proyecto ' + item.project"
              class="mb-4 mt-1 w-100"
            />
            <div>
              <a
                @click="statistics(item.id)"
                class="btn btn-dark mb-3"
                title="Ver Estadística"
                ><i class="el-icon-view"></i> Estadística</a
              >&nbsp;&nbsp;
              <a
                @click="department(item.id)"
                class="btn btn-outline-dark mb-3"
                title="Ver Departamentos"
                ><i class="el-icon-view"></i> Departamentos</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>{{ data }}</div>
    <ModalProject ref="ModalProject" />
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import ModalProject from "./components/ModalProject";
export default {
  name: "Projects",
  components: {
    ModalProject
  },
  data() {
    return {
      data: null,
    };
  },
  created() {
    this.$root.$refs.Projects = this;
    this.getProjects();
  },
  methods: {
    modalProject(){
       this.$root.$refs.ModalProject.centerDialogVisible = true;
       this.$root.$refs.ModalProject.title='Agregar'
    },
    department(id) {
      this.$router.push({ path: "/project/" + id });
    },
    detailProject(id){
      this.$router.push({ path: "/project/detail/" + id });
    },
    statistics(id) {
      console.log(id);
    },
    async getProjects() {
      Api.get("/project")
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
