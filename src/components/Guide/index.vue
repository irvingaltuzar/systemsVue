<template>
<div>
    <svg-icon class-name="guide-icon" icon-class="guide" @click.prevent.stop="guide" />
</div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
    name: 'Guide',
    data() {
        return {
            driver: null
        }
    },
    mounted() {
        this.driver = new Driver({
            allowClose: false,
            animate: false,

        })
    },
    methods: {
        guide() {
            this.driver.defineSteps(steps)
            this.driver.start()
        }
    }
}
</script>
