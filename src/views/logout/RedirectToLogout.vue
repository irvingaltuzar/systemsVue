<template>
    <div id="app">
      <div v-if="loading">
        <loader object="#ffffff" color1="#ffffff" color2="#1f2d3d" size="5" speed="2" bg="#1f2d3d" objectbg="#999793" opacity="100" disableScrolling="false" name="dots"></loader>
      </div>
    </div>
  </template>

  <script>
    import UndrawMaintenance from 'vue-undraw/UndrawMaintenance';
      import { mapMutations, mapState } from 'vuex'

    export default {
      name: 'RedirectToLogout',
      components: {
        UndrawMaintenance
      },
      data () {
        return {
          id: this.$route.params.id,
        }
      },
      methods: {
        ...mapMutations('tools', ['checkToken']),
        async logout() {
        	await this.$store.dispatch('user/logout')
					window.location.assign("http://192.168.3.170:8006")
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
      },
      computed: {
        ...mapState('tools', ['isValidate', 'loading', 'data_json']),
      },
      mounted () {
				this.logout()
        // this.$store.dispatch('tools/checkToken', this.id).then((res) => {
        //   this.login()
        // })
      }
    }
  </script>
