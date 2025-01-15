<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> 
      <el-dropdown class="right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
      <el-badge :value="20" class="item" type="primary">
       <i class="el-icon-message-solid" style="font-size:22px"/>
    </el-badge>
         </div>

        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
                    <el-dropdown-item>Mi Perfil</el-dropdown-item>
                </router-link>
          <router-link to="/">
                    <el-dropdown-item>Inicio</el-dropdown-item>
                </router-link>
          <a href="http://192.168.3.170:8006">
              <el-dropdown-item>Intranet</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Cerrar Sesión</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <guide id="Guide" class="right-menu-item hover-effect" />

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
        <UndrawProfilePic class="user-avatar" primary-color='#41B883' />
         <!-- <img :src="'http://192.168.3.121:8006/image/icons/masculino.svg'" class="user-avatar">-->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
                    <el-dropdown-item>Mi Perfil</el-dropdown-item>
                </router-link>
          <router-link to="/">
                    <el-dropdown-item>Inicio</el-dropdown-item>
                </router-link>
          <a href="http://intranet.dmi.local:8006/">
              <el-dropdown-item>Intranet</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Cerrar Sesión</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Guide from '@/components/Guide'
import UndrawProfilePic from 'vue-undraw/UndrawProfilePic';
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    Guide,
    UndrawProfilePic
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
        line-height: 30px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        // float: left;
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 50px;
    position: absolute;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 37px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                // margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
