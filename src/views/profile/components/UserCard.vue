<template>
<el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
        <span style="color: #3f5465;text-transform: uppercase;font-size: 25px">Mi Perfil</span>
    </div>

    <div class="user-profile">
        <div class="box-center">
            <pan-thumb :image="require('@/./img/avatar.gif')" :height="'120px'" :width="'120px'" :hoverable="false">
                <div>Hola {{ name }}</div>
            </pan-thumb>
        </div>
        <div class="box-center">
            <div class="user-name text-center">{{name +" "+ lastname}}</div>
            <div class="user-role text-center text-muted">{{position}}</div>
        </div>
    </div>

    <div class="user-bio">
    <el-row >
     <el-col :span="8" >
        <div class="user-education user-bio-section">
            <div class="user-bio-section-header">
             <i class="el-icon-star-on" /><span>No Empleado:</span>
            </div>
            <div class="user-bio-section-body">
                <div class="text-muted">
                {{ personalid }}
                </div>
            </div>
        </div>
         </el-col>
     <el-col :span="8" >
        <div class="user-education user-bio-section">
            <div class="user-bio-section-header">
             <svg-icon icon-class="table" /><span>Departamento:</span>
            </div>
            <div class="user-bio-section-body">
                <div class="text-muted">
                {{ deparment }}
                </div>
            </div>
        </div>
    </el-col>
   <el-col :span="8" >
        <div class="user-education user-bio-section">
            <div class="user-bio-section-header">
               <i class="el-icon-date" /><span>Fecha Ingreso:</span>
            </div>
            <div class="user-bio-section-body">
                <div class="text-muted">
                {{ antiquity_date }}
                </div>
            </div>
        </div>
         </el-col>
        
</el-row>
 <el-row >
   <el-col :span="8">
        <div class="user-education user-bio-section">
            <div class="user-bio-section-header">
                <i class="fas fa-phone"></i><span> Extensión:</span>
            </div>
            <div class="user-bio-section-body">
                <div class="text-muted">
                {{ extension }}
                </div>
            </div>
        </div>
    </el-col>
          <el-col :span="8" :xs="20">
        <div class="user-education user-bio-section">
            <div class="user-bio-section-header">
               <i class="el-icon-s-cooperation" /><span>Empresa:</span>
            </div>
            <div class="user-bio-section-body">
                <div class="text-muted">
                {{ company }}
                </div>
            </div>
        </div>
    </el-col>  
    <el-col :span="8" :xs="20">
         <div class="user-education user-bio-section">
            <div class="user-bio-section-header">
              <i class="el-icon-office-building" /><span>Ubicacion:</span>
            </div>
            <div class="user-bio-section-body">
                <div class="text-muted">
                {{ ubicacion }}
                </div>
            </div>
        </div>
    </el-col>
</el-row>

<el-row >
   <el-col :span="8">
        <div class="user-education user-bio-section">
            <div class="user-bio-section-header">
                <svg-icon icon-class="user" /><span>Usuario:</span>
            </div>
            <div class="user-bio-section-body">
                <div class="text-muted">
                {{ user }}
                </div>
            </div>
        </div>
         </el-col>
         <el-col :span="8" >
        <div class="user-education user-bio-section">
            <div class="user-bio-section-header">
               <svg-icon icon-class="email" /><span>Email:</span>
            </div>
            <div class="user-bio-section-body">
                <div class="text-muted">
                {{ email }}
                </div>
            </div>
        </div>
         </el-col>
         
    
</el-row>

      <!--  <div class="user-skills user-bio-section">
            <div class="user-bio-section-header">
                <i class="el-icon-time" /><span>Horario:</span>
            </div>
            <div class="user-bio-section-body">
                <div class="progress-item">
                    <span>Vue</span>
                    <el-progress :percentage="70" />
                </div>
                <div class="progress-item">
                    <span>JavaScript</span>
                    <el-progress :percentage="18" />
                </div>
                <div class="progress-item">
                    <span>Css</span>
                    <el-progress :percentage="12" />
                </div>
                <div class="progress-item">
                    <span>ESLint</span>
                    <el-progress :percentage="100" status="success" />
                </div>
            </div>
        </div>-->
    </div>
</el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import {
    mapGetters
} from 'vuex'

export default {
    components: {
        PanThumb
    },
    // props: {
    //     user: {
    //         type: Object,
    //         default: () => {
    //             return {
    //              name: '',
    //             lastname: '',
    //             location: '',
    //             usuario: '',
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
             'antiquity_date',
             'personalid',
             'user',

        ])
    },
}
</script>

<style lang="scss" scoped>
.box-center {
    margin: 0 auto;
    display: table;
}

.text-muted {
    color: #777;
    font-size: 15px;
}

.user-profile {
    .user-name {
        font-weight: bold;
        font-size:20px;
    }

    .box-center {
        padding-top: 10px;
    }

    .user-role {
        padding-top: 10px;
        font-weight: 400;
        font-size: 17px;
    }

    .box-social {
        padding-top: 30px;

        .el-table {
            border-top: 1px solid #dfe6ec;
        }
    }

    .user-follow {
        padding-top: 20px;
    }
}

.user-bio {
    margin-top: 20px;
    margin-left:5%;
    color: #606266;

    span {
        padding-left: 4px;
    }

    .user-bio-section {
        font-size: 14px;
        padding: 15px 0;

        .user-bio-section-header {
            border-bottom: 1px solid #dfe6ec;
            padding-bottom: 10px;
            margin-bottom: 10px;
            font-weight: bold;
        }
    }
}
</style>
