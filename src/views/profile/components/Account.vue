<template>
<el-form label-position="top">
 <el-row >
   <el-col :span="12" :xs="20">
    <el-form-item label="No Empleado:">
        <h5>{{ personalid }}</h5>
    </el-form-item>
     </el-col>
      <el-col :span="12" :xs="20">
    <el-form-item label="Fecha Ingreso:">
       <h5>{{antiquity_date}}</h5>
    </el-form-item>
    </el-col>
    </el-row>

     <el-row>
   <el-col :span="12" :xs="20">
    <el-form-item label="Email:">
        <h5>{{ email }}</h5>
    </el-form-item>
     </el-col>
      <el-col :span="12" :xs="20">
    <el-form-item label="Extension:">
       <h5>{{extension}}</h5>
         </el-form-item>
        </el-col>
    </el-row>
 <el-row>
   <el-col :span="12" :xs="20">
    <el-form-item label="Ubicación:">
        <h5>{{ ubicacion }}</h5>
    </el-form-item>
     </el-col>
      <el-col :span="12" :xs="20">
    <el-form-item label="Departamento:">
       <h5>{{ extension }}</h5>
         </el-form-item>
    </el-col>
    </el-row>

   <el-row>
   <el-col :span="12" :xs="20">
        <el-form-item label="Departamento:">
            <h5>{{ deparment }}</h5>
        </el-form-item>
        </el-col>
        <el-col :span="12" :xs="20">
        <el-form-item label="Puesto:">
        <h5>{{position}}</h5>
          </el-form-item>
        </el-col>
        </el-row>
</el-form>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    // props: {
    //     user: {
    //         type: Object,
    //         default: () => {
    //             return {
    //                 name: '',
    //                 email: ''
    //             }
    //         }
    //     }
    // },
     computed: {
        ...mapGetters([
            'name',
            'lastname',
            'ubicacion',
            'user',
            'position',
            'email',
            'deparment',
            'extension',
            'company',
            'personalid',
            'ubicacion',
            'antiquity_date',
        ])
    },
    methods: {
        submit() {
            this.$message({
                message: 'User information has been updated successfully',
                type: 'success',
                duration: 5 * 1000
            })
        }
    }
}
</script>
