import store from '@/store'
import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor
const state= {
   
  }
 const mutations= {
   
  }
  const actions = {
   async addEventAuditoria({ commit, state },formData){
    return new Promise((resolve, reject) => {
  

       Api.post('/segAuditoria',formData).then(res=>{ 
          const { data } = res
        resolve();
          // console.log(data)
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })

   },
//     async addMethodsAuditoria({ commit, state },formData){
//     return new Promise((resolve, reject) => {
       
//       Api.post('/segAuditoria',formData).then(res=>{ 
//           const { data } = res

//           console.log(data)
//         }).catch(error => {
//           console.log(error);
//           reject(error)
//         })
//       })

//    }
  }
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  