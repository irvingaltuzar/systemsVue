<template>
<agile :initial-slide="0" :autoplay-speed="5000" :autoplay="true">
    <div class="slide">
        <h1>BIENVENIDOS A INTRANET</h1>
        <img :src="require('@/./img/slider/andares.jpg')" />
    </div>
    <div class="slide">
        <h1>DMI DESARROLLOS - PUNTA TIBURON</h1>
        <img :src="require('@/./img/slider/pt6.jpg')" />
    </div>
    <div class="slide">
        <h1>DMI DESARROLLOS - CAMPANARIO</h1>
        <img :src="require('@/./img/slider/campanario4.jpg')" />
    </div>
    <div class="slide">
        <h1>DMI DESARROLLOS - MOLINO</h1>
        <img :src="require('@/./img/slider/molino.jpg')" />
    </div>
    <div class="slide">
        <h1>DMI DESARROLLOS - MOLINO</h1>
        <img :src="require('@/./img/slider/molino.jpg')" />
    </div>
    <div class="slide">
        <img :src="require('@/./img/slider/Inforienta_General.jpg')" />
    </div>
    <div class="slide">
        <h1>ORIENTA PAE</h1>
        <img :src="require('@/./img/slider/inforienta_pae.jpg')" />
    </div>

    <template slot="prevButton"><i class="el-icon-d-arrow-left"></i></template>
    <template slot="nextButton"><i class="el-icon-d-arrow-right"></i></template>
</agile>
</template>

<script>
import {
    VueAgile
} from 'vue-agile'

export default {
    components: {
        agile: VueAgile
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss">
.agile__nav-button {
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 24px;
    height: 100%;
    position: absolute;
    top: 0;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    width: 80px;
}

.agile__nav-button:hover {
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
}

.agile__nav-button--prev {
    left: 0;
}

.agile__nav-button--next {
    right: 0;
}

.agile__dots {
    bottom: 10px;
    left: 50%;
    position: absolute;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
}

.agile__dot {
    margin: 0 10px;
}

.agile__dot button {
    background-color: transparent;
    border: 1px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    display: block;
    height: 10px;
    font-size: 0;
    line-height: 0;
    margin: 0;
    padding: 0;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    width: 10px;
}

.agile__dot--current button,
.agile__dot:hover button {
    background-color: #fff;
}

.slide {
    height: 350px;
    -o-object-fit: cover;
    object-fit: cover;
    // width: 100%;
    // max-width: 100%;
    // height: 250px;
    z-index: -1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    // align-content: center;
    flex-direction: column;
}

.slide img {
    max-width: 100%;
    z-index: -1;
    filter: brightness(0.6);
}

.slide h1 {
    position: absolute;
    width: 100%;
    color: white;
    margin-bottom: 15%;
    margin-left: 10%;

}
</style>
