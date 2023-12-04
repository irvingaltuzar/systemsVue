<template>
      <el-dialog  width="90vw" :visible.sync="dialogVisible" center top="5vh" :title="dialogType==='edit'?'Editar Proveedor':'Nuevo Proveedor'">
        <el-form ref="formProveedor" :label-position="labelPosition" label-width="100px" :rules="rules" :model="formProveedor">
     
        <el-container class="ml-5">
          <el-form-item label="Razón Social/Nombre:" style="width:35vw" prop="business_name">
              <el-input  v-model="formProveedor.business_name"  clearable  placeholder=""> </el-input>
          </el-form-item>
          <el-form-item label="Tipo de proveedor:" style="width:15vw" class="ml-5" prop="type_person">
             <el-select v-model="formProveedor.type_person"  clearable @change="handleTypePerson" placeholder="">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="RFC:" style="width:20vw" class="ml-5" prop="rfc">
                <el-input   v-model="formProveedor.rfc"  :onkeyup="mayus(this)" show-word-limit clearable :maxlength="rfcMaxlength" placeholder="" :disabled="disRfc"> </el-input>
          </el-form-item>
          
        </el-container>
      
        <el-container class="ml-5">
        <el-form-item label="Telefono:" style="width:20vw" prop="phone">
                <el-input  clearable  v-model="formProveedor.phone" placeholder=""> </el-input>
          </el-form-item>
          <el-form-item label="Correo:" class="ml-5" style="width:20vw" prop="email">
               <el-input   v-model="formProveedor.email"  clearable  placeholder=""> </el-input>
          </el-form-item>
          <el-form-item label="Contacto de Vendedor:" class="ml-5" style="width:30vw" prop="contact">
           <el-input  clearable   v-model="formProveedor.contact"  placeholder=""> </el-input>
          </el-form-item>
         
        </el-container>

        <el-container class="ml-5">
         <el-form-item label="Calle Numero:" style="width:30vw"  prop="address">
            <el-input  v-model="formProveedor.address" clearable ></el-input>
          </el-form-item>
          <el-form-item label="Colonia:" style="width:30vw"  class="ml-5" prop="suburb">
          <el-input v-model="formProveedor.suburb" clearable></el-input>
          </el-form-item>
          <el-form-item label="C.P :" class="ml-5" prop="cp">
           <el-input  onkeypress='return event.charCode >= 48 && event.charCode <= 57' show-word-limit maxlength="5" v-model="formProveedor.cp" clearable></el-input>
          </el-form-item>
          <el-form-item label="País:" class="ml-5" prop="country">
             <el-select v-model="formProveedor.country" clearable placeholder="seleccionar:" @change="ChangeCountry" filterable>
                <el-option
                v-for="item in Countries"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
           </el-form-item>
        
      </el-container>
        
        <el-container class="ml-2" >
          <el-form-item label="Estado:"  style="width:30vw" class="ml-5" prop="state" >
            <el-select v-model="formProveedor.state" clearable placeholder="seleccionar:" :disabled="disState" filterable>
                <el-option
                v-for="item in States"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>         
          <el-form-item label="Alcaldia/Municipio" style="width:30vw" class="ml-5"  prop="city"> 
           <el-input v-model="formProveedor.city" clearable></el-input>
          </el-form-item>          
        <el-form-item label="Pagina Web:" class="ml-5" style="width:30vw" >
            <el-input v-model="formProveedor.web_page" placeholder="" clearable></el-input>
        </el-form-item>
       
      </el-container>
  <el-container class="ml-2" >
   <el-form-item label="Banco:"class="ml-5" style="width:30vw" prop="bank">
         <el-select v-model="formProveedor.bank" clearable placeholder="seleccionar:"  filterable>
                <el-option
                v-for="item in Banks"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        
        </el-form-item>
         <el-form-item label="Numero de Cuenta:" class="ml-5" style="width:30vw" prop="bank_account">
          <el-input  v-model="formProveedor.bank_account" show-word-limit  maxlength="13" onkeypress='return event.charCode >= 48 && event.charCode <= 57' clearable  placeholder="Buscar"></el-input>
        
        </el-form-item>
        <el-form-item label="clabe:" class="ml-5" style="width:30vw" prop="bank_clabe">
          <el-input   onkeypress='return event.charCode >= 48 && event.charCode <= 57' show-word-limit maxlength="18" v-model="formProveedor.bank_clabe" clearable  placeholder="Buscar"></el-input>
        
        </el-form-item>
        
        </el-container>
         <el-container class="ml-2" >
         <el-form-item label="Swift(Proveedor extranjero):" class="ml-5" style="width:30vw" >
          <el-input  v-model="formProveedor.bank_swift" clearable  placeholder="Buscar"></el-input>
        
        </el-form-item>
        <el-form-item label="Dias de Credito:" class="ml-5" style="width:30vw" prop="credit_days">
          <el-input v-model="formProveedor.credit_days" clearable  placeholder="Buscar"></el-input>
        
        </el-form-item>
         <el-form-item label="Moneda:" class="ml-5" style="width:30vw" prop="currency">
          <el-select v-model="formProveedor.currency" clearable placeholder="seleccionar:" filterable>
              <el-option
                v-for="item in optionsCurr"
                :key="item.id"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
      </el-container>
    <el-form-item label="Trabajos Realizados:" prop="classification" >
      <el-input
        type="textarea"
        placeholder=""
        v-model="formProveedor.classification"
        maxlength="200"
        :rows="2"
        clearable
        show-word-limit>
    </el-input>
</el-form-item>

        </el-card>
      </el-container>
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <center>ADJUNTAR DOCUMENTACIÓN</center>
        </div>

<el-container class="ml-2">
   
<el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Identificación oficial </span>
  </div>
   <el-form-item label="" prop="file_INE">

      <el-upload
          :fileList="file_INE"
          class="upload-demo"
           ref="file_INE"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
    </el-form-item>

</el-card>

  <el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Comprobante de domicilio vigente </span>
  </div>
    <el-form-item label="" prop="file_ComprobanteDomicilio">
      <el-upload
       ref="file_ComprobanteDomicilio"
               :fileList="file_ComprobanteDomicilio"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
    </el-form-item>

</el-card>
          
<el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Constancia de situación fiscal </span>
  </div>
      <el-form-item label="" prop="file_CSF">
      <el-upload
       ref="file_CSF"
           :fileList="file_CSF"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
     </el-form-item>
</el-card>
</el-container>
<el-container class="ml-2">

 <el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>•Opinión de cumplimiento de<br>
obligaciones fiscales </span>
  </div>
       <el-form-item label="" prop="file_OCOF">
      <el-upload
               :fileList="file_OCOF"
                 ref="file_OCOF"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
  </el-form-item>
</el-card>
 <el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Carátula de estado de cuenta </span>
  </div>
   <el-form-item label="" prop="file_EstCuenta">
      <el-upload
         ref="file_EstCuenta"
         :fileList="file_EstCuenta"
          class="upload-demo"
           drag
         action="#"
         :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
           </el-form-item>
</el-card>
       
<el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Curriculum de la empresa</span>
  </div>
      <el-upload
           ref="file_CV"
               :fileList="file_CV"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>
</el-container>
<el-container class="ml-2">
   <el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• FORMATO RFI (FOR-ABA-03) </span>
  </div>

      <el-upload
          ref="file_RFI"
          :fileList="file_RFI"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>

</el-card>
   <el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Acta constitutiva </span>
  </div>

      <el-upload
          ref="file_ActaConstitutiva"
           :fileList="file_ActaConstitutiva"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>

</el-card>
  <el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Alta ante el IMSS</span>
  </div>
      <el-upload
           :fileList="file_AltaIMSS"
          class="upload-demo"
             ref="file_AltaIMSS"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>
</el-container>
<el-container class="ml-2">
<el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Opinión de cumplimiento de obligaciones <br> ante el IMSS</span>
  </div>
      <el-upload
         ref="file_OCOIMSS"
             :fileList="file_OCOIMSS"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>


         <el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Carta para emitir transferencias bancarias</span>
  </div>
      <el-upload
               :fileList="file_CTB"
                ref="file_CTB"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>
             <el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Documento REPSE ( STPS ) </span>
  </div>
      <el-upload
                :fileList="file_REPSE"
                ref="file_REPSE"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>
</el-container>
<el-container class="ml-2">
     <el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Declaración Anual y/o est. Resultados </span>
  </div>
      <el-upload
               :fileList="file_DAER"
                ref="file_DAER"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>

<el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Comparativas</span>
  </div>
      <el-upload
           ref="file_COM"
          :fileList="file_COM"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>
<el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Cotizacion 1</span>
  </div>
      <el-upload
           ref="file_COT1"
          :fileList="file_COT1"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>


</el-container>
<el-container class="ml-2">
<el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Cotizacion 2</span>
  </div>
      <el-upload
           ref="file_COT2"
          :fileList="file_COT2"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>
<el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Cotizacion 3</span>
  </div>
      <el-upload
           ref="file_COT3"
          :fileList="file_COT3"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>
<el-card class="box-card ml-2">
  <div slot="header" class="clearfix">
    <span>• Cotizacion 4</span>
  </div>
      <el-upload
           ref="file_COT4"
          :fileList="file_COT4"
          class="upload-demo"
           drag
             action="#"
           :auto-upload="false"
          :on-success="handleSucces"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-change="beforeUploadFile"
          :limit="1">
          <i class="el-icon-upload" ></i>
          <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
        </el-upload>
</el-card>
</el-container>


 
</el-container>
 
      </el-card>
     
            
      </el-card>

    </el-form>
      <br>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false;ClearModal()">Cancelar</el-button>
        <el-button v-if="dialogType=='new'" :loading="btnloading" type="primary" @click="confirmProveedor('formProveedor')">Confirmar</el-button>
        <el-button v-if="dialogType=='edit'" :loading="btnloading" type="primary" @click="confirmProveedor('formProveedor')">Guardar Cambios</el-button>

      </div>
    </el-dialog>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { mapGetters} from 'vuex'
export default {
 
  data() {
      var validate = (rule, value, callback) => {
      if (value.trim() == '' ) {
        return callback(new Error('Por favor Ingresa titulo'))
      } else {
        return callback()
      }
    }
  var validateEmail = (rule, value, callback) => {
            // if (/^[^@]+@\w+(\.\w+)+\w$/.test(value) ) {
            if (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value) ) {
        return callback()

      } else {
        return callback(new Error('Por favor Ingresa titulo'))

      }
    }
      var validateClabe = (rule, value, callback) => {
      if (value.length == 18 ) {
        return callback()
      } else {
        return callback(new Error('Por favor Ingresa titulo'))

      }
    }
       var validateTxt = (rule, value, callback) => {
      if (value == '' ) {
        return callback(new Error('Por favor Ingresa titulo'))
      } else {
        return callback()
      }
    }
    var validateCP = (rule, value, callback) => {
     if (value.length == 5 ) {
        return callback()
      } else {
        return callback(new Error('Por favor Ingresa titulo'))

      }
    }
     var validateRFC = (rule, value, callback) => {
       let patron="";
       let rfcp="";
       if(value.trim() != ''){
      if (this.formProveedor.type_person == 'Fisica' ) {
        this.rfcMaxlength=13
       patron= /^(([A-Z]|[a-z]|\s){1})(([A-Z]|[a-z]){3})([0-9]{6})((?!(?:0{3})$).*[A-Za-z0-9]{3})$/;
      } else {
         this.rfcMaxlength=12
          patron= /^(([A-Z]|[a-z]|&){3})([0-9]{6})(((?!(?:0{3})$).*)[A-Za-z0-9]{3})$/;
      }
      rfcp = patron.test(value);
      if(value=='XEXX010101000' || value=='XAXX010101000'){
        return callback();
      }

       
        if(rfcp === true){
          let res = this.vldRFC(value,rule,callback)          
        }else{
          rule.message= 'RFC Invalido';
            return callback(new Error('Ingresa'))
        }
        }else{
        return callback(new Error('Ingresa'))
      }
    }
    return {
       labelPosition: 'top',
      checked:'',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        disRfc:true,
      fileList: [],
      btnloading:false,
      imageUrl:'',
      rfcMaxlength:13,
       file_INE:[],
        file_ComprobanteDomicilio:[],
        file_CSF:[],
        file_OCOF:[],
        file_EstCuenta:[],
        file_CV:[],
        file_RFI:[],
        file_ActaConstitutiva:[],
        file_AltaIMSS:[],
        file_OCOIMSS:[],
        file_CTB:[],
        file_REPSE:[],
        file_DAER:[],
        file_COT1:[],
        file_COT2:[],
        file_COT3:[],
        file_COT4:[],
        file_COM:[],
      formProveedor:{
        id: '',
        business_name: '',
        type_person:'',
        rfc:'',
        email:'',
        phone:'',
        contact:'',
        bank:'',
        bank_account:'',
        bank_clabe:'',
        bank_swift:'',
        address:'',
        suburb:'',
        city:'',
        state:'',
        cp:'',
        country:'',
        web_page:'',
        credit_days:'',
        currency:'',
        classification:''
      },
       rules: {
          business_name: [
              { required: true, message: 'Ingresa Nombre razon social', trigger: 'blur', validator: validate }
            ],
            type_person: [
              { required: true, message: 'Ingresa tipo', trigger: 'change', validator: validate }
            ],
            rfc: [
              { required: true, message: 'Ingresa RFC', trigger: 'blur', validator: validateRFC }
            ],
            email: [
              { required: true, message: 'Ingresa email', trigger: 'blur', validator: validateEmail }
            ],
             phone: [
              { required: true, message: 'Ingresa telefono contacto', trigger: 'blur', validator: validate }
            ],
              contact: [
              { required: true, message: 'Ingresa Contacto de Vendedor', trigger: 'blur', validator: validate }
            ],
              bank: [
              { required: true, message: 'Ingresa nombre Banco', trigger: 'blur', validator: validate }
            ],
             bank_account: [
              { required: true, message: 'Ingresa cuenta bancaria', trigger: 'blur', validator: validate }
            ],
              bank_clabe: [
              { required: true, message: 'Ingresa Clabe 18 digitos', trigger: 'change', validator: validateClabe }
            ],
      
             address: [
              { required: true, message: 'Ingresa dirección', trigger: 'blur', validator: validate }
            ],
            city: [
              { required: true, message: 'Ingresa ciudad', trigger: 'blur', validator: validate }
            ],
            suburb: [
              { required: true, message: 'Ingresa colonia', trigger: 'blur', validator: validate }
            ],
             state: [
              { required: true, message: 'Ingresa estado', trigger: 'change', validator: validate }
            ],
            cp: [
              { required: true, message: 'Ingresa código postal', trigger: 'blur', validator: validateCP }
            ],
             country: [
              { required: true, message: 'Ingresa pais', trigger: 'change', validator: validate }
            ],
         
             credit_days: [
              { required: true, message: 'Ingresa dias de credito', trigger: 'blur', validator: validate }
            ],
             currency: [
              { required: true, message: 'Ingresa moneda', trigger: 'change', validator: validate }
            ],
            classification:[
              { required: true, message: 'Ingresa trabajos realizados', trigger: 'blur', validator: validateTxt }
            ],
           
          
      },       
         options: [{
          value: 'Fisica',
          label: 'Fisica'
        }, {
          value: 'Moral',
          label: 'Moral'
        }
      ],
       optionsCurr: [{
           id: 1,
          value: 'MXN',
          label: 'MXN'
        }, {
          id: 2,
          value: 'USD',
          label: 'USD'
        }, {
          id: 3,
          value: 'EUR',
          label: 'EUR'
        }
      ],
      dialogVisible: false,
      dialogType: 'new',
      btnloading:false,
      disState:true,
  
    }
  },
  

   beforeMount() {
    this.$root.$refs.ModalAddProveedor = this
  },
   created() {
    this.$store.dispatch("getContries")
    this.$store.dispatch("getBanks")
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
    'Countries',
    'States',
    'Banks'
    ])
  },
  methods: {

     handleRemove(file, fileList) {
      Api.get('/deletefile/' + file.raw.name).then(res => {
        this.$message.warning(`El archivo ha sido removido correctamente`)
      })
    },
    handlePreview(file) {
     window.open(file.url, '_blank');
    },
    handleSucces(response, file, fileList) {
      this.$message.success(`Archivo Cargado correctamente`)
      // return this.dialogVisible = false
    },
    handleExceed(files, fileList) {
      this.$message.warning(`El límite es de un solo archivo intentas seleccionar ${files.length} archivo esta vez`)
    },
    handleChange(file) {
      //    if(this.$refs.selectIcono.singleSelected.id != null && this.$refs.selectIcono.singleSelected.id != ""){
      // this.$refs.selectIcono.removeFromSingleSelected();
      // }
      this.beforeUpload(file)
    },
    
    async beforeUploadFile(file, fileList) {
      const currentObj = this
      const fileType = file.raw.type
      const isLt2M = file.size
       const isPDF =  'application/pdf'
      let bool = false
      const ext = []
      let split
      await Api.get('/getCatTipoAdjunto').then(res => {
        currentObj.data = res.data
        for (var i = 0; i < currentObj.data.length; i++) {
          split = currentObj.data[i].extension.split('.')
          ext.push(split[1])
          if (currentObj.data[i].mimeType == fileType && isPDF==fileType) {
            if (isLt2M >= currentObj.data[i].tamanioPermitido) {
              this.$message.error('El archivo supera el peso maximo admitido para este formato es: ' + this.bytesToSize(currentObj.data[i].tamanioPermitido))
              fileList.pop()
            }
            bool = true
          }
        }
        if (!bool) {
          this.$message.error('El archivo debe contener los siguientes formatos pdf' )
          fileList.pop()
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
     bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes == 0) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    },
     async vldRFC(value,rule,callback){
    const formData = new FormData()
    const config = { headers: { 'content-type': 'multipart/form-data' }}

          formData.append('rfc', value)
       await Api.post('/suppliers/ExistRFC',formData,config).then(res => {
       const { data } = res
       if(data.local != null){
        if(this.dialogType=='edit'){
           return callback()
        }else{
         rule.message="RFC ya existe!"

        }
       return callback(new Error("ingresa"))
       }else if(data.intelisis[0].Proveedor !== 'NO EXISTE EL PR'){
         if(this.dialogType=='edit'){
           return callback()
        }else{
         rule.message= "RFC ya existe en Intelisis!"

        }
          return callback(new Error("ingresa"))
       }else{
       return callback()
       }
        return data

      }).catch(error => {
        console.log(error)
      })
  },
 
    async confirmProveedor(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {

       const isEdit = this.dialogType === 'edit'
      //  const file_INE = this.$refs.file_INE.uploadFiles
      //  const file_ComprobanteDomicilio = this.$refs.file_ComprobanteDomicilio.uploadFiles
      //  const file_CSF = this.$refs.file_CSF.uploadFiles
      //  const file_OCOF = this.$refs.file_OCOF.uploadFiles
      //  const file_EstCuenta = this.$refs.file_EstCuenta.uploadFiles
      //  if(file_INE.length > 0 && file_ComprobanteDomicilio.length > 0 && file_CSF.length > 0 && file_OCOF.length > 0 
      //  && file_EstCuenta.length > 0){
          if (isEdit) {
            this.updateProveedor();
          } else{
            this.addProveedor();
          }
        // }
      //  else{
      //      this.$message.warning('Falta capturar Documentos Requeridos!!!')
      //   }
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      });
    },
    async addProveedor(){
      this.btnloading= true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()

       const file_ActaConstitutiva = this.$refs.file_ActaConstitutiva.uploadFiles
       const file_INE = this.$refs.file_INE.uploadFiles
       const file_ComprobanteDomicilio = this.$refs.file_ComprobanteDomicilio.uploadFiles
       const file_CSF = this.$refs.file_CSF.uploadFiles
       const file_OCOF = this.$refs.file_OCOF.uploadFiles
       const file_AltaIMSS = this.$refs.file_AltaIMSS.uploadFiles
       const file_OCOIMSS = this.$refs.file_OCOIMSS.uploadFiles
       const file_EstCuenta = this.$refs.file_EstCuenta.uploadFiles
       const file_CTB = this.$refs.file_CTB.uploadFiles
       const file_CV = this.$refs.file_CV.uploadFiles
       const file_RFI = this.$refs.file_RFI.uploadFiles
       const file_REPSE = this.$refs.file_REPSE.uploadFiles
       const file_DAER = this.$refs.file_DAER.uploadFiles
       const file_COT1 = this.$refs.file_COT1.uploadFiles
       const file_COT2 = this.$refs.file_COT2.uploadFiles
       const file_COT3 = this.$refs.file_COT3.uploadFiles
       const file_COT4 = this.$refs.file_COT4.uploadFiles
       const file_COM = this.$refs.file_COM.uploadFiles

        if(file_ActaConstitutiva !=''){
      formData.append('file_ActaConstitutiva', file_ActaConstitutiva[0].raw)
        }
          if(file_RFI !=''){
      formData.append('file_RFI', file_RFI[0].raw)
        }
         if(file_REPSE !=''){
      formData.append('file_REPSE', file_REPSE[0].raw)
        }
         if(file_COT1 !=''){
      formData.append('file_COT1', file_COT1[0].raw)
        }
          if(file_COT2 !=''){
      formData.append('file_COT2', file_COT2[0].raw)
        }
          if(file_COT3 !=''){
      formData.append('file_COT3', file_COT3[0].raw)
        }
          if(file_COT4 !=''){
      formData.append('file_COT4', file_COT4[0].raw)
        }
         if(file_COM !=''){
      formData.append('file_COM', file_COM[0].raw)
        }
         if(file_DAER !=''){
      formData.append('file_DAER', file_DAER[0].raw)
        }
       if(file_INE !=''){
      formData.append('file_INE', file_INE[0].raw)
      
        }
         if(file_ComprobanteDomicilio !=''){
      formData.append('file_ComprobanteDomicilio', file_ComprobanteDomicilio[0].raw)

        }
         if(file_OCOF !=''){
      formData.append('file_OCOF', file_OCOF[0].raw)

        }
         if(file_CSF !=''){
        formData.append('file_CSF', file_CSF[0].raw)
        }
         if(file_AltaIMSS !=''){
      formData.append('file_AltaIMSS', file_AltaIMSS[0].raw)
        }
         if(file_OCOIMSS !=''){
      formData.append('file_OCOIMSS', file_OCOIMSS[0].raw)
        }
         if(file_EstCuenta !=''){
      formData.append('file_EstCuenta', file_EstCuenta[0].raw)

        }
         if(file_CTB !=''){
      formData.append('file_CTB', file_CTB[0].raw)
        }
         if(file_CV !=''){
      formData.append('file_CV', file_CV[0].raw)
        }
     

      formData.append('business_name', this.formProveedor.business_name)
      formData.append('type_person', this.formProveedor.type_person)
      formData.append('rfc', this.formProveedor.rfc)
      formData.append('phone', this.formProveedor.phone)
      formData.append('address', this.formProveedor.address)
      formData.append('email', this.formProveedor.email)
      formData.append('contact', this.formProveedor.contact)
      formData.append('suburb', this.formProveedor.suburb)
      formData.append('cp', this.formProveedor.cp)
      formData.append('state', this.formProveedor.state)
      formData.append('country', this.formProveedor.country)
      formData.append('city', this.formProveedor.city)
      formData.append('web_page', this.formProveedor.web_page)
      formData.append('bank', this.formProveedor.bank)
      formData.append('bank_clabe', this.formProveedor.bank_clabe)
      formData.append('bank_account', this.formProveedor.bank_account)
      formData.append('bank_swift', this.formProveedor.bank_swift)
      formData.append('credit_days', this.formProveedor.credit_days)
      formData.append('currency', this.formProveedor.currency)
      formData.append('classification', this.formProveedor.classification)
     

      await Api.post('/suppliers/addSupplier', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
          this.btnloading = false
          this.dialogVisible = false;

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Agrego un nuevo proveedor->' + " RFC:"+ this.formProveedor.rfc)
        formAut.append('evento', 'addProveedor()')
        formAut.append('id_afectado',res.data.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

          this.$notify({
          title: 'Nuevo Proveedor',
          message: res.data.success,
          type: 'success',
          offset: 50
        });
    this.$store.dispatch("getMySuppliers");

      }).catch(function(error) {
          
          this.$notify({
          title: 'Error',
          message: 'Ha ocurrido un error',
          type: 'danger',
          offset: 50
        });
      })
         this.btnloading = false

    },

        async updateProveedor(){
      this.btnloading= true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()


       const file_ActaConstitutiva = this.$refs.file_ActaConstitutiva.uploadFiles
       const file_INE = this.$refs.file_INE.uploadFiles
       const file_ComprobanteDomicilio = this.$refs.file_ComprobanteDomicilio.uploadFiles
       const file_CSF = this.$refs.file_CSF.uploadFiles
       const file_OCOF = this.$refs.file_OCOF.uploadFiles
       const file_AltaIMSS = this.$refs.file_AltaIMSS.uploadFiles
       const file_OCOIMSS = this.$refs.file_OCOIMSS.uploadFiles
       const file_EstCuenta = this.$refs.file_EstCuenta.uploadFiles
       const file_CTB = this.$refs.file_CTB.uploadFiles
       const file_CV = this.$refs.file_CV.uploadFiles
       const file_RFI = this.$refs.file_RFI.uploadFiles
       const file_REPSE = this.$refs.file_REPSE.uploadFiles
       const file_DAER = this.$refs.file_DAER.uploadFiles
       const file_COT1 = this.$refs.file_COT1.uploadFiles
       const file_COT2 = this.$refs.file_COT2.uploadFiles
       const file_COT3 = this.$refs.file_COT3.uploadFiles
       const file_COT4 = this.$refs.file_COT4.uploadFiles
       const file_COM = this.$refs.file_COM.uploadFiles

        if(file_ActaConstitutiva !=''){
            if(file_ActaConstitutiva[0].status =='ready'){
              formData.append('file_ActaConstitutiva', file_ActaConstitutiva[0].raw)
          }
        }
       if(file_INE !=''){
          if(file_INE[0].status =='ready'){
      formData.append('file_INE', file_INE[0].raw)
          }
        }
         if(file_ComprobanteDomicilio !=''){
              if(file_ComprobanteDomicilio[0].status =='ready'){
          formData.append('file_ComprobanteDomicilio', file_ComprobanteDomicilio[0].raw)
            }
         }

           if(file_RFI !=''){
              if(file_RFI[0].status =='ready'){
            formData.append('file_RFI', file_RFI[0].raw)
              }
           }
         if(file_REPSE !=''){
            if(file_REPSE[0].status =='ready'){
        formData.append('file_REPSE', file_REPSE[0].raw)
          }
         }
         if(file_OCOF !=''){
              if(file_OCOF[0].status =='ready'){
          formData.append('file_OCOF', file_OCOF[0].raw)
            }
         }

            if(file_DAER !=''){
              if(file_DAER[0].status =='ready'){
            formData.append('file_DAER', file_DAER[0].raw)
              }
            }
         if(file_CSF !=''){
            if(file_CSF[0].status =='ready'){
          formData.append('file_CSF', file_CSF[0].raw)
            }
         }
         if(file_AltaIMSS !=''){
            if(file_AltaIMSS[0].status =='ready'){
        formData.append('file_AltaIMSS', file_AltaIMSS[0].raw)
          }
         }
         if(file_OCOIMSS !=''){
            if(file_OCOIMSS[0].status =='ready'){
          formData.append('file_OCOIMSS', file_OCOIMSS[0].raw)
            }
         }
         if(file_EstCuenta !=''){
              if(file_EstCuenta[0].status =='ready'){
            formData.append('file_EstCuenta', file_EstCuenta[0].raw)
              }
         }
         if(file_CTB !=''){
            if(file_CTB[0].status =='ready'){
          formData.append('file_CTB', file_CTB[0].raw)
            }
         }
         if(file_CV !=''){
            if(file_CV[0].status =='ready'){
          formData.append('file_CV', file_CV[0].raw)
            }
         }
      if(file_COT1 !=''){
          if(file_COT1[0].status =='ready'){
          formData.append('file_COT1', file_COT1[0].raw)
            }
      }
       if(file_COT2 !=''){
          if(file_COT2[0].status =='ready'){
          formData.append('file_COT2', file_COT2[0].raw)
            }
      }
       if(file_COT3 !=''){
          if(file_COT3[0].status =='ready'){
          formData.append('file_COT3', file_COT3[0].raw)
            }
      }
       if(file_COT4 !=''){
          if(file_COT4[0].status =='ready'){
          formData.append('file_COT4', file_COT4[0].raw)
            }
      }
       if(file_COM !=''){
        if(file_COM[0].status =='ready'){
        formData.append('file_COM', file_COM[0].raw)
          }
       }

        
      formData.append('id', this.formProveedor.id)
      formData.append('business_name', this.formProveedor.business_name)
      formData.append('type_person', this.formProveedor.type_person)
      formData.append('rfc', this.formProveedor.rfc)
      formData.append('phone', this.formProveedor.phone)
      formData.append('address', this.formProveedor.address)
      formData.append('email', this.formProveedor.email)
      formData.append('contact', this.formProveedor.contact)
      formData.append('suburb', this.formProveedor.suburb)
      formData.append('cp', this.formProveedor.cp)
      formData.append('state', this.formProveedor.state)
      formData.append('country', this.formProveedor.country)
      formData.append('city', this.formProveedor.city)
      formData.append('web_page', this.formProveedor.web_page)
      formData.append('bank', this.formProveedor.bank)
      formData.append('bank_clabe', this.formProveedor.bank_clabe)
      formData.append('bank_account', this.formProveedor.bank_account)
      formData.append('bank_swift', this.formProveedor.bank_swift)
      formData.append('credit_days', this.formProveedor.credit_days)
      formData.append('currency', this.formProveedor.currency)
      formData.append('classification', this.formProveedor.classification)
 

      await Api.post('/suppliers/updateSupplier', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
         this.btnloading = false
          this.dialogVisible = false;
           const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Edito Proveedor ->' + this.formProveedor.id)
        formAut.append('id_afectado', this.formProveedor.id)
        formAut.append('evento', 'updateProveedor()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

          this.$notify({
          title: 'Actualización Proveedor',
          message: res.data.success,
          type: 'success',
          offset: 50
        });
            this.$store.dispatch("getMySuppliers");

      }).catch(function(error) {
         this.$notify({
          title: 'Error',
          message: 'Ha ocurrido un error',
          type: 'danger',
          offset: 50
        });
      })

   
    },
    ChangeCountry(){
      if(this.formProveedor.country != ""){
        const formData = new FormData()
      formData.append('country_id', this.formProveedor.country)
      this.$store.dispatch("getStatesbyCountry",formData);
      this.disState=false;
      this.formProveedor.state="";
      }else{
         this.formProveedor.state="";
        this.disState=true;
      }
    },
    
    handleTypePerson(){
      if(this.formProveedor.type_person=="Fisica"){
        this.rfcMaxlength=13;
       this.disRfc=false;
      }else if(this.formProveedor.type_person=="Moral"){
        this.rfcMaxlength=12;
       this.disRfc=false;
      }else{
      this.disRfc=true;

      }
    },
    mayus(e) {
    this.formProveedor.rfc = this.formProveedor.rfc.toUpperCase();
    },

     resetForm() {
         this.file_INE=[]
          this.file_ComprobanteDomicilio=[]
          this.file_CSF=[]
          this.file_OCOF=[]
          this.file_EstCuenta=[]
          this.file_CV=[]
          this.file_RFI=[]
          this.file_ActaConstitutiva=[]
          this.file_AltaIMSS=[]
          this.file_OCOIMSS=[]
          this.file_CTB=[]
          this.file_REPSE=[]
          this.file_DAER=[]
          this.file_COT1=[]
          this.file_COT2=[]
          this.file_COT3=[]
          this.file_COT4=[]
          this.file_COM=[]
      this.formProveedor.id='';
        this.formProveedor.business_name= '';
        this.formProveedor.type_person='';
       this.formProveedor.rfc='';
        this.formProveedor.email='';
        this.formProveedor.phone='';
        this.formProveedor.contact='';
        this.formProveedor.bank='';
        this.formProveedor.bank_account='';
        this.formProveedor.bank_clabe='';
        this.formProveedor.bank_swift='';
        this.formProveedor.address='';
        this.formProveedor.suburb='';
        this.formProveedor.city='';
        this.formProveedor.state='';
        this.formProveedor.cp='';
        this.formProveedor.country='';
        this.formProveedor.web_page='';
        this.formProveedor.credit_days='';
        this.formProveedor.currency='';
        this.formProveedor.classification='';
      }
  }
}
</script>

<style lang="scss" scoped>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
