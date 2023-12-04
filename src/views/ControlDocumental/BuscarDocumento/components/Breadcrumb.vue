<template>
  <div class="fm-breadcrumb">
    <nav aria-label="breadcrumb">
      <ol
        class="breadcrumb"
      >
        <li class="breadcrumb">
          <span class="badge badge-secondary">
            <i class="far fa-hdd" />
          </span>

        </li>
        <li
          v-for="(item, index) in arrpath"
          :key="`a-${index}`"
          class="breadcrumb-per"
        > /
          {{ item }}

        </li>
      </ol>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() {
    return {
      arrpath: []

    }
  },
  computed: {

  },
  created() {
    this.$root.$refs.breadcrumb = this
  },
  methods: {
  }
}
</script>

<style lang="scss">
    .fm-breadcrumb {

        .breadcrumb {
            flex-wrap: nowrap;
            padding: 0.2rem 0.3rem;
            margin-bottom: 0.5rem;
            width: 100%;
            display: -webkit-inline-box;

            .breadcrumb-per {
              margin-left: 1rem;
            }
        }
     }
</style>
