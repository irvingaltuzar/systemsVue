import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import Layout from '@/layout'
import components from './routesimport'

const asyncRoutes= [];
const data=[];

// Función recursiva para crear un array con la estructura de un objeto recursivo con seg_items
function insertarArrayEnObjeto(arr) {
  var objeto = {};
  
  for (var i = 0; i < arr.length; i++) {
    objeto[i] = arr[i];
  }
  
  return objeto;
}
let obj2=[];

function crearArrayRecursivo(objeto) {
  // var resultado = [objeto];
  // var temp=[objeto];
  let obj = [];
  let arr=[];

  var view='';

  if (objeto.seg_items && Array.isArray(objeto.seg_items) && objeto.seg_items.length > 0) {
    for (var i = 0; i < objeto.seg_items.length; i++) {

      components.forEach(function(element,index){
        if(element.name==objeto.seg_items[i].subsecDesc){
        view = element;
        }
      })
      if(objeto.seg_items[i].public==0){
        obj={
            public: objeto.seg_items[i].public,
            path:objeto.seg_items[i].subsecUrl,
            name: objeto.seg_items[i].subsecDesc,
            component:  view.component,
            meta: { title: objeto.seg_items[i].subsecDesc, icon:  objeto.seg_items[i].icon,roles: ['R']},
            // children:[]
      }

      }else{
        obj={
          public: objeto.seg_items[i].public,
          path:objeto.seg_items[i].subsecUrl,
          name: objeto.seg_items[i].subsecDesc,
          component:  view.component,
          meta: { title: objeto.seg_items[i].subsecDesc, icon:  objeto.seg_items[i].icon},
          // children:[]
    }
      
      }
      
      var subarray = crearArrayRecursivo(objeto.seg_items[i]);
      if(Object.keys(subarray).length>0){
        arr.push(subarray)
        // obj.redirect= objeto.seg_items[i].subsecUrl,
        obj.children=arr;

      }
      obj2.push(obj)
      // var res = insertarArrayEnObjeto(arr);
      // obj2=res

    }

  }
  return obj;
}
  Api.get('/getSubsecciones').then(res=>{
        const { data } = res
    var sec='';
    var view='';

       for (var i = 0; i < data.length; i++) {
        const url= data[i].subsecUrl
        var hidden= false
        if(data[i].hidden=="true"){
          hidden=true
        }
        components.forEach(function(element,index){
            if(element.name==data[i].subsecDesc){
            view = element;
            }
          })
      if(sec!=data[i].secDesc){
        

        if(data[i].public==1){

        asyncRoutes.push(
              {
                id:data[i].secId,
                path: data[i].secUrl,
                component: Layout,
                redirect: data[i].subsecUrl,
                hidden: hidden,
                meta: { title: data[i].secDesc, icon:  data[i].icon_sec,noCache: true},
                children: [{
                public: data[i].public,
                path: data[i].subsecUrl,
                name: data[i].subsecDesc,
                component:  view.component,
                meta: { title: data[i].subsecDesc, icon:  data[i].icon},
                children:[]
            }]
        })
        }else if(data[i].public==0){
          asyncRoutes.push(
            {
              public: data[i].public,
              id:data[i].secId,
              path: data[i].secUrl,
              component: Layout,
              // redirect: data[i].subsecUrl,
              hidden: hidden,
              meta: { title: data[i].secDesc, icon:  data[i].icon_sec,noCache: true},
              children: [{
              public: data[i].public,
              path: data[i].subsecUrl,
              name: data[i].subsecDesc,
              component:  view.component,
              meta: { title: data[i].subsecDesc, icon:  data[i].icon,roles: ['R']},
              children:[]
          }]

        })
        }else{
          asyncRoutes.push(
            {
              public: data[i].public,
              id:data[i].secId,
              path: data[i].secUrl,
              component: Layout,
              // redirect: data[i].subsecUrl,
              meta: { title: data[i].secDesc, icon:  data[i].icon_sec,noCache: true},
              hidden: hidden,
              children: [{
              path: data[i].subsecUrl,
              meta: { title: data[i].subsecDesc, icon:  data[i].icon}
          }]
      })
        }
        if(data[i].seg_items.length>0){
          crearArrayRecursivo(data[i]);
           var child ='';
           asyncRoutes.forEach(function (element) {
                if(element.id==data[i].secId){
                    child=element;
                }
          });
          // var res = insertarArrayEnObjeto(obj2);
          const num=child.children.length-1

          child.children[num].children=obj2;
          
          //  child.children[0].children.push(obj2)
           obj2=[]; 
         }

    }
    else{
     

      var child ='';
       asyncRoutes.forEach(function (element) {
            if(element.id==data[i].secId){
                child=element;
            }
      });

      if(data[i].public==1){
        var array={
          public: data[i].public,
          path: data[i].subsecUrl,
          name: data[i].subsecDesc,
          component:  view.component,
          redirect: '',
          meta: { title: data[i].subsecDesc, icon:  data[i].icon},
          children:[]
        }

    }else if(data[i].public==0){

      var array={
        public: data[i].public,
        path: data[i].subsecUrl,
        name: data[i].subsecDesc,
        component:  view.component,
        redirect: '',
        meta: { title: data[i].subsecDesc, icon:  data[i].icon,roles: ['R']},
        children:[]
      }
    }else {

      var array={
        public: data[i].public,
        name: data[i].subsecDesc,
        path: url,
        meta: { title: data[i].subsecDesc, icon:  data[i].icon}
      }
    }
        child.children.push(array)
     const num=child.children.length-1
        if(data[i].seg_items.length>0){
          crearArrayRecursivo(data[i]);
           child.children[num].children=obj2

           obj2=[]; 
         }

    }
    sec=data[i].secDesc;
     view='';
  }
  }).catch(error => {
    console.log(error);
  })


export default asyncRoutes
