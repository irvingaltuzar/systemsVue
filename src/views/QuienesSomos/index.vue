<template>
<div class='app-container container-manifiesto'>
    <div class="video_manifiesto el-col-12">
        <videobg :src=" require('@/./img/video/video.mp4')" style="max-height: 400px; height: 100vh;">
            <img :src="require('@/./img/negocios/dmi_corporativo.png')" alt="" width="200">
            <label>Nuestro Manifiesto</label>

        </videobg>
    </div>
    <div class="manifiesto el-col-12">
        <p> Somos una compañía con más de 23 años de experiencia, dedicada a proyectar el futuro de las ciudades con visión, potencializando el valor para nuestros clientes y socios. Generamos confianza que trasciende con valor.<br><br>
            Creamos experiencias excepcionales que transmiten emociones desde el corazón.<br><br>
            Integramos el mejor talento para crear espacios armónicos con el entorno, que se visitan siempre con la familia como centro de todo.</p>
    </div>

</div>
</template>

<script>
import {
    VueAgile
} from 'vue-agile'
import VideoBackground from 'vue-responsive-video-background-player'

export default {

    name: 'About',
    components: {
        agile: VueAgile,
        videobg: VideoBackground
    },
    data() {
        return {
            video: '@/src/img/video/video.mp4'
        }
    }
}
</script>

<style lang="scss" scoped>
// Slides styles
.container-manifiesto {
    height: 100%;
    padding: .5%;
}

.manifiesto {
    background-color: #405364;
    max-height: 400px;
    padding: 2.4%;
}

.video_manifiesto img {
    position: relative;
    left: 65%;
    top: 4%;
}

.video_manifiesto label {
    text-align: center;
    font-size: 2.6em;
    color: white;
    display: block;
    position: relative;
    top: 60%;
}

.manifiesto p {
    text-align: justify;
    color: white;
    line-height: 28px;
    font-size: 1.3em;
    font-weight: normal;
}

.slide {
    display: block;
    height: 500px;
    -o-object-fit: cover;
    object-fit: cover;
    width: 100%;
}
</style>
