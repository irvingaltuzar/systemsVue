<template>
<div class="drawer-container">
    <div>
        <h3 class="drawer-title" >NOTIFICACIONES </h3>
           <el-divider><i class="el-icon-star-on"></i></el-divider>
            <el-tabs type="card" >
    <el-tab-pane  class="scroll ">
     <span slot="label">
            <el-badge :value="countNotifications.new" class="item">
                Nuevos
        </el-badge>
        </span>
        <el-card v-if="NotificationsUser.new.length===0" class="box-card contain" >
            <UndrawNotify primary-color='#41B883' height='180px'/><br><br>
            <span>No hay mensajes nuevos...</span>
    </el-card>
    <div v-else>
      <el-card v-for="o in NotificationsUser.new" class="box-card custom" shadow="hover" @click.native="handleClick1(o.link,o.id,o.type)">
            <el-row>
                <el-col :span="5">
                      <div class="card-panel-icon-wrapper icon-sign">
                  <svg-icon :icon-class="o.icon" class-name="card-panel-icon" />
                 </div>
                </el-col>
            <el-col :span="19" >
            <el-row :gutter="5" >
            <el-col :span="22">
                <b style="font-size:11px">{{o.title}}</b>  
            </el-col>
            <el-col :span="2"><el-badge is-dot class="item"></el-badge></el-col>
            </el-row>
            <el-row :gutter="5" >
            <span style="font-size:12px">{{o.message}}</span>
            </el-row>
                <el-row :gutter="5" >
                    <span  style="font-size:10px">{{o.created_at}} </span> 
                </el-row>
            </el-col>
          
            </el-row>
             
        </el-card>
   </div>
    </el-tab-pane>
    <el-tab-pane label="Vistos" class="scroll item" >
         <el-card  v-if="NotificationsUser.read.length==0" class="box-card contain" >
    <UndrawNotify primary-color='#41B883' height='180px'/><br><br>
    <span>No hay mensajes en visto aún...</span>
    </el-card>
    <div v-else>
          <el-card v-for="o in NotificationsUser.read"  class="box-card custom" @click.native="handleClick(o.link,null)">
            <el-row>
                <el-col :span="5">
                      <div class="card-panel-icon-wrapper icon-sign">
                  <svg-icon :icon-class="o.icon" class-name="card-panel-icon" />
                 </div>
                </el-col>
            <el-col :span="19" >
            <el-row :gutter="5" >
            <el-col :span="22">
                <b style="font-size:11px">{{o.title}}</b>  
            </el-col>
           
            </el-row>
            <el-row :gutter="5" >
            <span style="font-size:12px">{{o.message}}</span>
            </el-row>
                <el-row :gutter="5" >
                    <span  style="font-size:10px">{{o.updated_at}} </span> 
                </el-row>
            </el-col>
          
            </el-row>
             
        </el-card>
        </div>
    </el-tab-pane>
    <el-tab-pane class="scroll">
     <span slot="label">
            <el-badge :value="countNotifications.msg" class="item">
                Mensaje Sistema
        </el-badge>
        </span>
    
     <el-card  v-if="NotificationsUser.msg.length==0" class="box-card contain" >
    <UndrawNotify primary-color='#41B883' height='180px'/><br><br>
    <span>No hay mensajes del sistema...</span>
    </el-card>
    <div v-else>
         <el-card v-for="o in NotificationsUser.msg"  class="box-card custom" @click.native="handleClick(o.link)">
            <el-row>
                <el-col :span="5">
                      <div class="card-panel-icon-wrapper icon-sign">
                  <svg-icon :icon-class="o.icon" class-name="card-panel-icon" />
                 </div>
                </el-col>
            <el-col :span="19" >
            <el-row :gutter="5" >
            <el-col :span="22">
                <b style="font-size:11px">{{o.title}}</b>  
            </el-col>
           
            </el-row>
            <el-row :gutter="5" >
            <span style="font-size:12px">{{o.message}}</span>
            </el-row>
                <el-row :gutter="5" >
                    <span  style="font-size:10px">{{o.created_at}} </span> 
                </el-row>
            </el-col>
          
            </el-row>
             
        </el-card>
        </div>
    </el-tab-pane>
  </el-tabs>
          
    </div>
</div>
</template>

<script>
import UndrawNotify from 'vue-undraw/UndrawNotify';
import { mapGetters} from 'vuex'
export default {
    components: {
        UndrawNotify
    },
    data() {
        return {
              tab1Badge: 1,
        }
    },
     
    created(){
        this.$store.dispatch("NotificationsCenter");
           // Set up a timer to automatically reload data every 5 seconds
    setInterval(() => {
      this.$store.dispatch("NotificationsCenter");;
    }, 10000);

    },
    computed: {
        ...mapGetters([
      'NotificationsUser',
      'countNotifications'
    ]),
        fixedHeader: {
            get() {
                return this.$store.state.settings.fixedHeader
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'fixedHeader',
                    value: val
                })
            }
        },
        tagsView: {
            get() {
                return this.$store.state.settings.tagsView
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'tagsView',
                    value: val
                })
            }
        },
        sidebarLogo: {
            get() {
                return this.$store.state.settings.sidebarLogo
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'sidebarLogo',
                    value: val
                })
            }
        }
    },
    methods: {
        themeChange(val) {
            this.$store.dispatch('settings/changeSetting', {
                key: 'theme',
                value: val
            })
        },
        handleClick(link){
            // this.$store.dispatch("countNotification");

            if(link!="" && link !=null){
            this.$router.push("/"+ link)  

            }
            // this.$store.dispatch("NotificationsCenter")

        },
         handleClick1(link,id,type){
             if(link!="" && link !=null){
            this.$router.push("/"+ link)  

            }
              const formData = new FormData()
            formData.append('id', id)
            formData.append('type', type)
            this.$store.dispatch("changeStatusNotification",formData).then(res => {
            // this.$store.dispatch("NotificationsCenter");
            // this.$store.dispatch("countNotification");
           

            });
        }
    }
}
</script>

<style lang="scss" scoped>
.item {
  margin-top: 10px;
}
.drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
        margin-bottom: 12px;
        color: rgba(0, 0, 0, .85);
        font-size: 14px;
        line-height: 22px;
    }

    .drawer-item {
        color: rgba(0, 0, 0, .65);
        font-size: 14px;
        padding: 12px 0;
    }

    .drawer-switch {
        float: right
    }
    .card-panel-icon-wrapper {
   float: left;
    padding: 5px;
    -webkit-transition: all 0.38s ease-out;
    transition: all 0.38s ease-out;
    border-radius: 50px;
    }

    .card-panel-icon {
      float: left;
      font-size: 35px;
    }
    .icon-sign {
        background:#ebebeba8
      }
      .contain{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh; /* Ajusta la altura según tus necesidades */
}

    .custom{
        cursor: pointer
    }
    .custom:hover {
    background-color: #deeaee;
    }
    .scroll{
    max-height: 77vh;
    overflow-y: auto;
    }
    ::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
}
</style>
