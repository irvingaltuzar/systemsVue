<template>
    <div class="app-container documentation-container">
    <VueyeTable :data="employees" :columns="columns" title="Proveedores Aprobados">
      <template v-slot:id="{ item }">
        <b>{{ item.id }}</b>
      </template>
      <template v-slot:employee_name="{ item }">
        <strong>{{ item.employee_name }}</strong>
      </template>
    </VueyeTable>
  </div>
</template>

<script>
import VueyeTable from "vueye-table";
import employees from "./assets/employees.json";

export default {
  name: "App",
  data: () => ({
    employees,
    columns: [
      {
        key: "id",
        label: "ID",
        sortable: true,
        type: "number",
        display: true,
      },
      {
        key: "rfc",
        label: "RFC",
        sortable: true,
        display: true,
      },
      {
        key: "razon_social",
        label: "Razon Social",
        display: true,
        sortable: true,
      },
      {
        key: "contacto",
        label: "Contacto",
        sortable: true,
        display: true,
      },
      {
        key: "telefono",
        label: "Telefono",
        sortable: true,
        display: true,
      },
      {
        key: "estatus",
        label: "EFO",
        sortable: true,
        display: true,
      },  
      {
        key: "fecha",
        label: "Fecha Registro",
        sortable: true,
        display: true,
      }, 
      {
        key: "tipo_proveedor",
        label: "Tipo Proveedor",
        sortable: true,
        display: true,
      }, 
      
    ],
  }),
  components: {
    VueyeTable,
  },
};
</script>

<style lang="scss" scoped>
.documentation-container {
    margin: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    .document-btn {
        flex-shrink: 0;
        display: block;
        cursor: pointer;
        background: black;
        color: white;
        height: 60px;
        padding: 0 16px;
        margin: 16px;
        line-height: 60px;
        font-size: 20px;
        text-align: center;
    }
}
</style>
