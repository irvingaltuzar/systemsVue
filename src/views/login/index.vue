<template>

 <div class="container-fluid" id="login">
        <div class="login-form">
            <div class="logo">
                <img :src="require('@/./img/background/logo-grupo-dmi.svg')" class="img-fluid">
            </div>
            <div class="content-form">
                <div class="row">
                    <div class="col-sm-12">
                        <p class="title">Inicia Sesión</p>
                       <el-form ref="loginForm" :model="loginForm" :rules="loginRules" autocomplete="on" label-position="left">
                        <el-form-item prop="usuario">
                            <input id="usuario" type="text" class="form-control" name="usuario"  v-model="loginForm.usuario" 
                            autocomplete="usuario" placeholder="Usuario"  tabindex="1"   autofocus />
                        </el-form-item>
                             
                        <el-form-item prop="password">

                            <input class="form-control" :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Contraseña" name="password" 
                            tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="login"/>
                        </el-form-item>
            

                            <input type="submit" value="Entrar" tabindex="3" @click.prevent="login">
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
       

    </div>
<!--<div class="login-container">

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
        <div class="logo-dmi">
            <img :src="require('@/./img/negocios/dmi_corporativo.png')" alt="" width="240">
        </div>
        <div class="formcontainer">

            <div class="title-container">
                <h3 class="title">Iniciar Sesión</h3>
            </div>

            <el-form-item prop="usuario">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input ref="usuario" v-model="loginForm.usuario" placeholder="Usuario" name="usuario" type="text" tabindex="1" autocomplete="on" />
            </el-form-item>

            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                <el-form-item prop="password">
                    <span class="svg-container">
                        <svg-icon icon-class="password" />
                    </span>
                    <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Contraseña" name="password" tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="login" />
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                </el-form-item>
            </el-tooltip>

            <el-button :loading="loading" type="primary"
            style="width:100%;margin-bottom:30px;    width: 80%;
                    margin-bottom: 10px;
                    margin-left: 13%;
                    border-radius: 14px;"
                     @click.prevent="login">Iniciar Sesión</el-button>
        </div>

    </el-form>

</div>-->
</template>

<script>
import {
    validUsername
} from '../../utils/validate'
import SocialSign from './components/SocialSignin'

export default {
    name: 'Login',
    components: {
        SocialSign
    },
    data() {
        const validateUsername = (rule, value, callback) => {
            if (value.length=="") {
                callback(new Error('Por favor escribe nombre de usuario'))
            } else {
                callback()

            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length ==  "") {
                callback(new Error('Por favor Escribe tu contraseña'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                usuario: '',
                password: ''
            },
            loginRules: {
                usuario: [{
                    required: true,
                    trigger: 'change',
                    validator: validateUsername
                }],
                password: [{
                    required: true,
                    trigger: 'change',
                    validator: validatePassword
                }]
            },
            passwordType: 'password',
            capsTooltip: false,
            loading: false,
            showDialog: false,
            redirect: undefined,
            otherQuery: {}
        }
    },
    watch: {
        $route: {
            handler: function (route) {
                const query = route.query
                if (query) {
                    this.redirect = query.redirect
                    this.otherQuery = this.getOtherQuery(query)
                }
            },
            immediate: true
        }
    },
    created() {
        // window.addEventListener('storage', this.afterQRScan)
    },
    mounted() {
        if (this.loginForm.email === '') {
            this.$refs.username.focus()
        } /* else if (this.loginForm.password === '') {
            this.$refs.password.focus()
        } */
    },
    destroyed() {
        // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
        checkCapslock(e) {
            const {
                key
            } = e
            this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        // handleLogin() {
        //     this.$refs.loginForm.validate(valid => {
        //         if (valid) {
        //             this.loading = true
        //             this.$store.dispatch('user/login', this.loginForm)
        //                 .then(() => {
        //                     this.$router.push({
        //                         path: this.redirect || '/',
        //                         query: this.otherQuery
        //                     })
        //                     this.loading = false
        //                 })
        //                 .catch(() => {
        //                     this.loading = false
        //                 })
        //         } else {
        //             console.log('error submit!!')
        //             return false
        //         }
        //     })
        // },
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== 'redirect') {
                    acc[cur] = query[cur]
                }
                return acc
            }, {})
        },
        login() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
            this.loading = true

            this.$store.dispatch('user/login', this.loginForm).then(() => {
                this.$router.push({
                    path: this.redirect || '/Inicio',
                    query: this.otherQuery
                })

                this.loading = false
                        })
                        .catch(error => {

                          this.loading = false
                        })
                } else {
                    this.$message.info("Falta Ingresar tus credenciales");
                    return false
                }
            })

        }
        // afterQRScan() {
        //   if (e.key === 'x-admin-oauth-code') {
        //     const code = getQueryObject(e.newValue)
        //     const codeMap = {
        //       wechat: 'code',
        //       tencent: 'code'
        //     }
        //     const type = codeMap[this.auth_type]
        //     const codeName = code[type]
        //     if (codeName) {
        //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
        //         this.$router.push({ path: this.redirect || '/' })
        //       })
        //     } else {
        //       alert('第三方登录失败')
        //     }
        //   }
        // }
    }
}
</script>

<style lang="scss" >

body, html {
  height: 100%;
}

div#login {
  min-height: 600px;
  position: relative;
  height: 100%;
  background-image: url('../../img/background/back_pattern-01.jpg');
  background-size: cover;
}

.login-form {
  position: absolute;
  top: calc(50% - 40px);
  left: 50%;
  transform: translate(-50%, -50%);
}

.logo img {
  width: 120px;
  margin: 0 auto;
  display: table;
}

.logo {
  background: #5f6062;
  padding: 30px 20px;
  width: 88%;
  margin: 0 auto;
  display: table;
  border-radius: 8px;
  position: relative;
  z-index: 2;
}

.content-form {
  width: 350px;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  font-family: "Gotham-Light";
  font-size: 16px;
  background: white;
  padding: 75px 45px 30px;
  margin-top: -50px;
  border-radius: 8px;
}

.content-form .title {
  text-align: center;
  font-size: 19px;
}

.content-form input::-moz-placeholder {
  letter-spacing: 1px;
  color: #3f5465;
}

.content-form input:-ms-input-placeholder {
  letter-spacing: 1px;
  color: #3f5465;
}

.content-form, .content-form p, .content-form input, .content-form input::placeholder {
  letter-spacing: 1px;
  color: #3f5465;
}

.form-control {
  border: unset;
  border-bottom: 2px solid #6d6e71;
  border-radius: 0px;
  margin-bottom: 20px;
  padding: 4px 2px;
  outline: unset;
  box-shadow: unset !important;
}

input[type=submit] {
  margin: 50px auto 0;
  display: table;
  text-transform: uppercase;
  font-size: 20px;
  border: unset;
  background: no-repeat;
  transition: 0.3s all;
  padding: 6px 20px;
}

input[type=submit]:hover {
  color: white;
  background: #354f5e;
}

footer {
  position: absolute;
  left: 0px;
  bottom: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
}

@media screen and (max-width: 1150px) {
  div#login {
    min-height: 710px;
  }

  .login-form {
    position: relative;
    top: unset;
    left: unset;
    margin: 0 auto;
    display: table;
    transform: unset;
    padding-top: 80px;
  }
}
@media screen and (max-width: 500px) {
  .content-form {
    width: 95%;
  }

  .login-form {
    width: 100%;
  }
}
footer {
  position: absolute !important;
}

footer {
  position: relative;
}

footer ul {
  padding: 0px;
  margin: 0px;
  list-style: none;
  text-align: center;
}

footer ul li {
  display: inline-block;
  padding: 10px 20px;
  color: white;
  opacity: 0.47;
  font-family: Gotham-Light;
  font-synthesis: 15px;
}

footer a {
  color: white;
  text-decoration: none;
}

footer a:hover {
  color: white;
  text-decoration: underline;
}

footer a.email-support {
  padding-left: 13px;
}

@media screen and (max-width: 1150px) {
  footer ul li {
    display: block;
    padding: 0px 20px;
  }

  footer {
    position: relative !important;
    padding-top: 30px;
    padding-bottom: 30px;
  }
}
@media screen and (max-width: 500px) {
  footer span.ti {
    display: block;
  }

  footer span.ti span {
    display: none;
  }
}



</style>
