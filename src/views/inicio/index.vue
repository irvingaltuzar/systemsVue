<template>
<div class="app-container">
 <div class="component-item">
            <mallki class-name="mallki-text" class="font-effect-shadow-multiple tit" text="SISTEMAS ADMINISTRATIVOS" style="color:#3f5465;margin-left:30%;"/>
          </div>
<panel-group />
</div>
</template>

<script>
import Slider from './components/slider'
import PanelGroup from './components/PanelGroup'
import Mallki from '@/components/TextHoverEffect/Mallki'
export default {
    name: 'Inicio',
    components: {
        Slider,
         PanelGroup,
        Mallki
    },
    data() {
        return {
 
        }

    }

}
</script>
<style scoped >
.component-item{
  min-height: 20px;
  font-size:30px;
  color: red;
}

@media only screen and (max-width: 600px) {
.tit{
font-size: 20px;
}
}
/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) and (max-width: 765px){

.tit{
font-size: 22px;
}
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) and (max-width: 990px){
.tit{
font-size: 25px;
}
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) and (max-width: 1200px) {
.tit{
font-size: 28px;
}
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .tit{
font-size: 30px;
}
  }
</style>
