<template>
<div class="app-container">
    <div >
        <el-row :gutter="15" justify="center" type="flex" align="middle">

            <el-col :span="18" :xs="24">
                <user-card  />
            </el-col>
   <!--   <el-col :span="14" :xs="24">
                <el-card>
                    <el-tabs v-model="activeTab">
                        <el-tab-pane label="Información" name="Informacion">
                            <account />
                        </el-tab-pane>
                        <el-tab-pane label="Timeline" name="timeline">
                            <timeline />
                        </el-tab-pane>
                        <el-tab-pane label="Account" name="account">
                            <activity />
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>-->

        </el-row>
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
    name: 'Profile',
    components: {
        UserCard,
        Activity,
        Timeline,
        Account
    },
    data() {
        return {
            user: {},
            activeTab: 'Informacion'
        }
    },
    // computed: {
    //     ...mapGetters([
    //         'name',
    //         'lastname',
    //         'ubicacion',
    //         'user'
    //     ])
    // },
    created() {
        // this.getUser()
    },
    methods: {
        // getUser() {
        //     this.user = {
        //         name: this.name,
        //         lastname: this.lastname,
        //         location: this.ubicacion,
        //         usuario: this.user,
        //     }
        // }
    }
}
</script>
