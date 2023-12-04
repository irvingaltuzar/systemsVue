

export function notify(_params){

  console.log(_params);

  if(_params.type == 'warning'){
    this.$notify({
      title: _params.title ? _params.title : "",
      message: _params.message ? _params.message : "",
      type: _params.type,
    });
  }else if(_params.type == 'validate'){
    let errors_HTML = "";
    Object.entries(_message).forEach(([key,item])=>{
        errors_HTML += `<ul>${item[0]}</ul>`
    })

  }


    
}