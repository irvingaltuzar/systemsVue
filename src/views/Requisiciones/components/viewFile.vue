<template>
 <el-container>
   <el-dialog
      title="Preview Documento"
      :visible.sync="dialogVisible"
      width="85%"
      top="3vh"
      height="95vh"
      @close="url= ''"
    >
      <iframe id="fred" style="border:1px solid #666CCC" title="" :src="url" frameborder="0" scrolling="auto"  width="100%" />
    </el-dialog>
</el-container>
</template>

<script>
export default {
  components: {  },
  data() {
    return {
    url:'',
    dialogVisible:false
    }
  },
  beforeMount() {
    this.$root.$refs.ViewFile =this;
  },
   computed: {
    // mix the getters into computed with object spread operator
    
  },
  created() {
  
  },
  methods: {
    async ViewArchivo(archivo) {
      // Proceso de Autoria metodo
      const formAut = new FormData()
      formAut.append('name_view', this.$route.name)
      formAut.append('comentarios', 'Abrio esta archivo ' + archivo)
      formAut.append('evento', 'ViewArchivo()')

      this.$store.dispatch('auditoria/addEventAuditoria', formAut)

      this.url = ''
      this.url = archivo
      this.dialogVisible = true
  
    }
  }
}
</script>

<style lang="scss" scoped>
 iframe {
    display: block;       /* iframes are inline by default */
    background: #000;
    border: none;         /* Reset default border */
    height: 83vh;        /* Viewport-relative units */
    width: 100vw;
}
</style>
