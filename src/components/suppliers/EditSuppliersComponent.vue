<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Editar proveedor</md-dialog-title>

      <md-dialog-content class="md-scrollbar">
        <form novalidate class="md-layout" @submit.prevent="update">
            <md-card class="md-layout-item  md-small-size-100">

              <md-card-content>
								<div class="md-layout md-gutter mt-4">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="business_name">*Razón Social/Nombre</label>
                      <md-input v-model="f.business_name" />
                    </md-field>
                    <span v-if="v.business_name" class="md-danger" style="color:red;">*{{ v.business_name[0] }}</span>
                  </div>
									<div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="type_person">*Tipo de persona</label>
                      <md-select v-model="f.type_person" name="movie" id="movie">
                        <md-option value="Fisica">Física</md-option>
                        <md-option value="Moral">Moral</md-option>
                      </md-select>
                    </md-field>
										<span v-if="v.type_person" class="md-danger" style="color:red;">*{{ v.type_person[0] }}</span>
									</div>
									<div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="rfc">*RFC</label>
                      <md-input v-model="f.rfc"/>
                    </md-field>
										<span v-if="v.rfc" class="md-danger" style="color:red;">*{{ v.rfc[0] }}</span>
									</div>
								</div>

								<div class="md-layout md-gutter mt-4">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="phone">*Teléfono</label>
                      <md-input v-model="f.phone" />
                    </md-field>
                    <span v-if="v.phone" class="md-danger" style="color:red;">*{{ v.phone[0] }}</span>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="email">*Correo</label>
                      <md-input v-model="f.email" />
                    </md-field>
                    <span v-if="v.email" class="md-danger" style="color:red;">*{{ v.email[0] }}</span>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="contact">*Contacto de vendedor</label>
                      <md-input v-model="f.contact" />
                    </md-field>
                    <span v-if="v.contact" class="md-danger" style="color:red;">*{{ v.contact[0] }}</span>
                  </div>
								</div>

								<div class="md-layout md-gutter mt-4">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="phone">*Calle y número</label>
                      <md-input v-model="f.address" />
                    </md-field>
                    <span v-if="v.address" class="md-danger" style="color:red;">*{{ v.address[0] }}</span>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="suburb">*Colonia</label>
                      <md-input v-model="f.suburb" />
                    </md-field>
                    <span v-if="v.suburb" class="md-danger" style="color:red;">*{{ v.suburb[0] }}</span>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="cp">*CP</label>
                      <md-input v-model="f.cp" />
                    </md-field>
                    <span v-if="v.cp" class="md-danger" style="color:red;">*{{ v.cp[0] }}</span>
                  </div>
								</div>

								<div class="md-layout md-gutter mt-4">
                  <div class="md-layout-item md-small-size-100">
                    <el-select class="input-autocomplete" v-model="f.country" filterable placeholder="*País">
                      <el-option v-for="item in Countries" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <span v-if="v.country" class="md-danger" style="color:red;">*{{ v.country[0] }}</span>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <el-select class="input-autocomplete" v-model="f.state" filterable placeholder="*Estado">
                      <el-option v-for="item in States" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <span v-if="v.state" class="md-danger" style="color:red;">*{{ v.state[0] }}</span>
                  </div>
								</div>

								<div class="md-layout md-gutter mt-4">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="phone">*Alcaldía</label>
                      <md-input v-model="f.city" />
                    </md-field>
                    <span v-if="v.city" class="md-danger" style="color:red;">*{{ v.city[0] }}</span>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="suburb">Página web</label>
                      <md-input v-model="f.web_page" />
                    </md-field>
                  </div>

                  <div class="md-layout-item md-small-size-100">
                      <md-field>
                        <label for="currency">*Banco</label>
                        <md-select v-model="f.bank" >
                        <md-option v-for="bank in Banks" :key="bank.id" :value="bank.id">{{ bank.name }}</md-option>
                        </md-select>
                      </md-field>
                      <span v-if="v.currency" class="md-danger" style="color:red;">*{{ v.currency[0] }}</span>
                    </div>
                  </div>
								<div class="md-layout md-gutter mt-4">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="phone">*Número de cuenta</label>
                      <md-input v-model="f.bank_account" maxlength="13"/>
                    </md-field>
                    <span v-if="v.bank_account" class="md-danger" style="color:red;">*{{ v.bank_account[0] }}</span>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="suburb">*CLABE</label>
                      <md-input v-model="f.bank_clabe" />
                    </md-field>
                    <span v-if="v.bank_clabe" class="md-danger" style="color:red;">*{{ v.bank_clabe[0] }}</span>
                  </div>
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="cp">Swift (Proveedor extranjero)</label>
                      <md-input v-model="f.bank_swift" />
                    </md-field>
                    <span v-if="v.bank_swift" class="md-danger" style="color:red;">*{{ v.bank_swift[0] }}</span>
                  </div>
								</div>

								<div class="md-layout md-gutter mt-4">
                  <div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="phone">*Días de crédito</label>
                      <md-input v-model="f.credit_days" />
                    </md-field>
                    <span v-if="v.credit_days" class="md-danger" style="color:red;">*{{ v.credit_days[0] }}</span>
                  </div>
									<div class="md-layout-item md-small-size-100">
                    <md-field>
                      <label for="currency">*Tipo de moneda</label>
                      <md-select v-model="f.currency" name="movie" id="movie">
                        <md-option value="MXN">MXN</md-option>
                        <md-option value="USD">USD</md-option>
                        <md-option value="EUR">EUR</md-option>
                      </md-select>
                    </md-field>
										<span v-if="v.currency" class="md-danger" style="color:red;">*{{ v.currency[0] }}</span>
									</div>
								</div>

                <br>
                <br>
                <md-toolbar class="md-dense">
                  <h1 class="md-title">Documentación cargada</h1>
                </md-toolbar>

                <div class="md-layout md-gutter mt-4">
                  <div v-for="document in uploaded_documents" :key="document.file_id" class="md-layout-item md-size-50">
                    <md-card class="m-1">
                      <md-card-content>
                        <span>{{document.cat_supplier_documents_name}}</span>
                        <br>
                        <br>
                        <div v-if="document.file_id != null">
                          <el-upload
                            action="#"
                            class="upload-demo"
                            :ref="'doc_edit_'+document.cat_supplier_documents_id"
                            :auto-upload="false"
                            :limit="1"
                            :on-success="handleSucces"
                            :on-change="beforeUploadFile"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            :data-id_doc_edit="document.cat_supplier_documents_id">
                            <el-button slot="trigger" size="small" type="primary">Selecciona un archivo</el-button>
                          </el-upload>
                          <br>
                          <a :href="document.file_url" class="text-danger icon-document mr-3" target="_blank">
                            <i class="fa-solid fa-file-pdf"></i>
                            <md-tooltip>Ver documento</md-tooltip>
                          </a>
                          <a @click="deleteSupplierDocument(document.file_id)" class="text-danger icon-document mr-3" target="_blank">
                            <i class="fa-solid fa-trash"></i>
                            <md-tooltip>Eliminar documento</md-tooltip>
                          </a>
                        </div>
                        <div v-else>
                          <el-upload
                            action="#"
                            class="upload-demo"
                            :ref="'doc_edit_'+document.cat_supplier_documents_id"
                            :auto-upload="false"
                            :limit="1"
                            :on-success="handleSucces"
                            :on-change="beforeUploadFile"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                            <el-button slot="trigger" size="small" type="primary">Selecciona un archivo</el-button>
                          </el-upload>
                        </div>

                      </md-card-content>
                    </md-card>
                  </div>
                </div>

              </md-card-content>
              <md-progress-bar v-if="disabled" md-mode="indeterminate" />
              <md-card-actions>
                <md-button type="submit" class="md-primary" :disabled="disabled">Actualizar</md-button>
              </md-card-actions>
            </md-card>
          </form>
      </md-dialog-content>
    </md-dialog>

    <el-button size="mini" type="warning" circle @click="activate()">
      <md-icon class="size-xsmall">edit</md-icon>
    </el-button>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'
import { forEach } from 'jszip/lib/object'

export default {
  name: 'EditSuppliersComponent',
  props: {
    supplier: {
      required: true
    },
    catSupplierDocuments:[]

  },
  data: () => ({
    img_preview: null,
    array_specialties: [],
    f: {
      business_name: '',
      type_person: '',
      rfc: '',
      email: '',
      phone: '',
      contact: '',
      address: '',
      suburb: '',
      cp: '',
      country: '',
      state: '',
      city: '',
      web_page: '',
      bank: '',
      bank_account: '',
      bank_clabe: '',
      bank_swift: '',
      credit_days: '',
      currency: ''
    },
    is_loaded: null,
    showDialog: false,
    v: new Object(),
    sending: false,
    disabled: false,
    uploaded_documents:[],
    cat_supplier_documents:[],
    fileList:[],
  }),
  watch: {
    'data'(val) {
    },

  },
  created(){
  },
  computed: {
      ...mapState('suppliers_tools', ['specialties']),
      ...mapGetters(['Countries', 'States','Banks']),
    data() {
      this.f.business_name = this.supplier.business_name,
      this.f.type_person = this.supplier.type_person,
      this.f.rfc = this.supplier.rfc,
      this.f.email = this.supplier.email,
      this.f.phone = this.supplier.phone,
      this.f.contact = this.supplier.contact,
      this.f.address = this.supplier.address,
      this.f.suburb = this.supplier.suburb,
      this.f.cp = this.supplier.cp,
      this.f.country = this.supplier.country,
      this.f.state = this.supplier.state,
      this.f.city = this.supplier.city,
      this.f.web_page = this.supplier.web_page,
      this.f.bank = this.supplier.bank,
      this.f.bank_account = this.supplier.bank_account,
      this.f.bank_clabe = this.supplier.bank_clabe,
      this.f.bank_swift = this.supplier.bank_swift,
      this.f.credit_days = this.supplier.credit_days,
      this.f.currency = this.supplier.currency,
      this.f.files = this.supplier.files

      this.cat_supplier_documents= this.catSupplierDocuments;
    },

  },
  methods: {
    ...mapMutations('suppliers_tools', ['fetchCatSpecialties', 'changeValue']),
    activate () {
      this.showDialog = true

      this.$store.dispatch("getContries")
      this.$store.dispatch("getStates")
      this.$store.dispatch("getBanks")

      this.match_uploaded_documents()
    },
    update () {
      this.disabled = true

      let formRequest = new FormData();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      formRequest.append('supplier_id',this.supplier.id);
      formRequest.append('business_name',this.f.business_name);
      formRequest.append('type_person',this.f.type_person);
      formRequest.append('rfc',this.f.rfc);
      formRequest.append('email',this.f.email);
      formRequest.append('phone',this.f.phone);
      formRequest.append('contact',this.f.contact);
      formRequest.append('address',this.f.address);
      formRequest.append('suburb',this.f.suburb);
      formRequest.append('cp',this.f.cp);
      formRequest.append('country',this.f.country);
      formRequest.append('state',this.f.state);
      formRequest.append('city',this.f.city);
      formRequest.append('web_page',this.f.web_page);
      formRequest.append('bank',this.f.bank);
      formRequest.append('bank_account',this.f.bank_account);
      formRequest.append('bank_clabe',this.f.bank_clabe);
      formRequest.append('bank_swift',this.f.bank_swift);
      formRequest.append('credit_days',this.f.credit_days);
      formRequest.append('currency',this.f.currency);


      // ase agregan los documentos cargados
      let uploaded_document_ids = [];
      this.uploaded_documents.forEach(document =>{

        if(this.$refs['doc_edit_'+document.cat_supplier_documents_id]){
          if(this.$refs['doc_edit_'+document.cat_supplier_documents_id][0].uploadFiles.length > 0 ){
            formRequest.append('doc_edit_'+document.cat_supplier_documents_id, this.$refs['doc_edit_'+document.cat_supplier_documents_id][0].uploadFiles[0].raw);
            uploaded_document_ids.push(document.cat_supplier_documents_id);
          }
        }
      });

      if(uploaded_document_ids.length > 0){
        formRequest.append('uploaded_document_ids',uploaded_document_ids.toString());
      }else{
        formRequest.append('uploaded_document_ids','');
      }


      Api.post('/suppliers/update',formRequest,config)
      .then(res => {
        this.$notify({
          title: 'Realizado',
          message: 'Proveedor actualizado correctamente',
          type: 'success'
        })


        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Editó al proveedor:' + this.f.business_name + '&& Datos anteriores: ' + Object.values(this.supplier) + '&& datos nuevos:' + Object.values(this.f))
        formAut.append('id_afectado', this.supplier.id)
        formAut.append('evento', 'update()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        Object.assign(this.$data, this.$options.data.call(this))
        this.changeValue()
         this.$root.$refs.CurrentSuppliersListComponent.getList()

        this.showDialog = false
      })
      .catch(error => {
        this.$notify({
          title: 'Oops!',
          message: 'Ha ocurrido un error, intente nuevamente!',
          type: 'error'
        })
        this.v = new Object()
        setTimeout(() => {
          this.v = error.response.data.errors
        }, 50)
      })
      .finally(() => {
        this.changeValue()
        this.disabled = false
      })
    },

    match_uploaded_documents(){

      let ths= this;
      let isAppend=0;
      this.uploaded_documents=[];
      //Documentos generales que puede cargar un proveedor
      this.cat_supplier_documents.forEach(document => {
        isAppend=0;

        //Archivos que ya tiene cargado el proveedor
        ths.f.files.forEach(file =>{
          if(document.id == file.cat_document_supplier_id){

            ths.uploaded_documents.push({
              cat_supplier_documents_id: document.id,
              cat_supplier_documents_name: document.description,
              dmiaba_supplier_registration_id: file.dmiaba_supplier_registration_id,
              file_id: file.id,
              file_name: file.name,
              file_url:file.file_url
            })

            isAppend++;
          }
        })

        if(isAppend == 0){
          ths.uploaded_documents.push({
              cat_supplier_documents_id: document.id,
              cat_supplier_documents_name: document.description,
              dmiaba_supplier_registration_id:null,
              file_id:null,
              file_name:null,
              file_url:null,
            })
        }
      });

    },

    handleRemove(file, fileList) {
      /* Api.get('/deletefile/' + file.raw.name).then(res => {
        this.$message.warning(`El archivo ha sido removido correctamente`)
      }) */
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

      //let extension = ['pdf'];
      let extension = [];
      let cat_tipo_archivo=[];
      let nameFile = file.name.split('.');
      // Se valida el peso
      await Api.get('/getCatTipoAdjunto').then(res => {
        cat_tipo_archivo = res.data;
        res.data.forEach(tipo =>{
          extension.push(tipo.extension.replace('.',''))
        })
      }).catch(function(error) {
        console.log(error)
      })

      if(extension.indexOf(nameFile[1]) != -1){
        if(cat_tipo_archivo[extension.indexOf(nameFile[1])].tamanioPermitido >= file.size){
          //console.log("archivo correcto");
        }else{
          this.$notify({
                title: 'Aviso',
                message:"El archivo supera el limite de "+((cat_tipo_archivo[extension.indexOf(nameFile[1])].tamanioPermitido)/1024/1024)+" MB.",
                type: 'warning'
              });
              fileList.pop()
        }
      }else{
          this.$notify({
            title: 'Aviso',
            message:"Seleccione solamente archivos PDF.",
            type: 'warning'
          });
          fileList.pop()
      }
    },

    deleteSupplierDocument(_document_id){
      Api.get('/suppliers/delete-file/'+_document_id).then(res => {
        if(res.data.success == 1){

          this.uploaded_documents.forEach(document =>{

            if(document.file_id == _document_id){
              document.dmiaba_supplier_registration_id= null;
              document.file_id= null;
              document.file_name= null;
              document.file_url= null;
            }

          })

          this.$message.warning(res.data.message)

        }else{
          this.$message.warning(res.data.message)
        }

      })
    },


  },
}
</script>

<style lang="scss" scoped>
    .md-dialog {
        max-width: 90%;
        margin-left: auto;
        margin-right: auto;
    }

    .dropzone-container {
        cursor: pointer;
        min-height: 180px;
        border: 2px dashed rgba(0,0,0,.54);
    }
    .dropzone-content{
        text-align: center;
        margin-top: 4rem;
        color: #777;
    }

    .v-list__tile__title {
        text-align: center!important;
    }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-field {
    max-width: 300px;
  }

    .size-xsmall {
        width: 10px;
    min-width: 10px;
    height: 10px;
    font-size: 17px!important;

    }

</style>
