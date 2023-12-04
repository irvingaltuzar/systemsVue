<template>
  <div id="app">
    <div v-if="loading">
      <loader object="#ffffff" color1="#ffffff" color2="#1f2d3d" size="5" speed="2" bg="#1f2d3d" objectbg="#999793" opacity="100" disableScrolling="false" name="dots"></loader>
    </div>
    <div v-else>
      <div v-if="!!!isValidate">
        <div style="text-align: center;">
          <UndrawMaintenance height="300" primary-color="#1f2d3d" class="my-4"/>
          <div class="text-h4 font-weight-regular text-xs-justify grey--text" align="center">
            Lo sentimos, ha ocurrido un error, vuelve a iniciar sesión en:
            <a href="https://192.168.3.170:8006">Intranet</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import UndrawMaintenance from 'vue-undraw/UndrawMaintenance';
	import { mapMutations, mapState } from 'vuex'

  export default {
    name: 'PreLoading',
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
      login () {
        if (!!this.isValidate) {
          this.$store.dispatch('user/login', this.data_json).then((res) => {
            this.redirectTo()
          })
        }
      },
      async redirectTo() {
        try {
          await window.location.replace(`${process.env.VUE_APP_BASE_URL}`);
        } catch (err) {
          throw new Error(`Problem handling something: ${err}.`);
        }
      },
      check (id) {
        this.checkToken(id)
        console.log(this.isValidate)
      }
    },
    computed: {
      ...mapState('tools', ['isValidate', 'loading', 'data_json']),
    },
    mounted () {
      this.$store.dispatch('tools/checkToken', this.id).then((res) => {
        this.login()
      })
    }
  }
</script>
