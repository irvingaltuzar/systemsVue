<template>
  <div>
    <md-empty-state
      md-icon="restaurant"
      md-label="Bienvenido al servicio de comedor"
      :md-description="Object.keys(current_order).length === 0 ? message.welcome : message.with_order"
    >
      <div v-if="Object.keys(current_order).length === 0 ">
        <md-button class="md-primary md-raised" @click="change(2)">Ordenar</md-button>
      </div>
      <div v-else>
        <md-button class="md-primary md-raised" @click="change(1)">Ver</md-button>
      </div>
    </md-empty-state>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'WelcomeDiningServiceComponent',
  props: {
    current_order: {
      required: true
    }
  },
  data: () => ({
    message: {
      welcome: 'Para poder solicitar tu comida de la semana da clic en el siguiente botón.',
      with_order: 'Ya cuentas con una orden generada para la siguiente semana, si deseas ver más información, da clic en el siguiente botón'
    }
  }),
  methods: {
    ...mapMutations('dining', ['changeStep']),
    change(value) {
      this.changeStep(value)
    }
  },
  mounted() {
    console.log(this.current_order)
  }
}
</script>
