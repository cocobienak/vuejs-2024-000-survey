<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormDomain"
        >
          <CButton type="submit" color="success" square size="sm"
          >
            Save
          </CButton>
          <div style="float:right" v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="globalFunctions.reloadAddNew($router, 'domain/add')"
              >
              Add new
            </CButton>
          </div>
          <hr/>
          <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
            <CCol sm="12">
                <label class="text-info">Created by : {{createdBy}} , {{ moment(createdOn).format('LLL') }}</label>
                <label class="text-info" style="float:right;">Modified by : {{modifiedBy}} , {{ moment(modifiedOn).format('LLL') }}</label>

            </CCol>
            <hr/>
          </CRow>
          <CRow v-if="((activeOauthClientId == 1 || activeSystemUserId == 2) && (fieldForm.id.value === null || fieldForm.id.value === ''))">
            <CCol sm="12">
              <div>
                <label>Oauth Clients</label>
                <multiselect 
                  v-model="fieldForm.su_oauth_clients_id.value" 
                  :options="fieldForm.su_oauth_clients_id.options" 
                  :custom-label="optionsOauthClients" 
                  :allow-empty="true"
                  placeholder="Select one"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'su_oauth_clients_id');"
                  label="name" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.su_oauth_clients_id.isValid === null) ? false : !fieldForm.su_oauth_clients_id.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'su_oauth_clients_id')}}
                  </label>
              </div>
            </CCol>
          </CRow>          
          <CRow>
            <CCol sm="6">
              <CInput
                name="code"
                v-model="fieldForm.code.value"
                placeholder="Code domain ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'code')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'code')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'code')"                
                label="Code"
              />
            </CCol>
            <CCol sm="6">
              <CInput
                name="name"
                v-model="fieldForm.name.value"
                placeholder="Name domain ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'name')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'name')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'name')"                
                label="Name "
              />
            </CCol>
          </CRow>
          <hr/>
          <CRow>
            <CCol sm="6" style="display:table-cell;vertical-align: middle;text-align:left;">
                <CButton
                  style="margin-left:8px;"
                  color="info"
                  square
                  size="sm"
                  @click="toggleModalChooseAvatar()"
                >
                  Choose Avatar
              </CButton>
              <br/><br/>            
              <div v-if="fieldForm.avatar_path.value" style="display:block; vertical-align: middle; text-align: left; width:500px">

                <div>
                  <span style="background: #e2e2e2; vertical-align: middle; text-align: center; display:table-cell; width: 600px; height: 300px; border: 2px solid rgb(216, 216, 216); border-radius: 6px;">                
                    <img 
                      style="margin: 0 auto;display: block;height: auto;width: auto;max-width:590px;max-height:290px;"
                      :src="fieldForm.avatar_path.value" 
                    />  
                  </span>
                </div>
                <br/>
                <CButton
                  style="margin-left:8px;"
                  color="warning"
                  square
                  size="sm"
                  @click="fieldForm.avatar_path.value = ''"
                >
                    <span style="color:#fff;">Remove Avatar</span>
                </CButton>

              </div>
            </CCol>
          </CRow>
          <hr/>
          <CRow>
            <CCol sm="12">
              <CInput
                name="link_web"
                v-model="fieldForm.link_web.value"
                placeholder="Link Web Site ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'link_web')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'link_web')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'link_web')"                
                label="Link Web Site"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6">
              <CInput
                name="email"
                v-model="fieldForm.email.value"
                placeholder="Email owner ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'email')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'email')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'email')"                
                label="Email"
              />
            </CCol>
            <CCol sm="6">
              <CInput
                name="phone_number"
                v-model="fieldForm.phone_number.value"
                placeholder="Phone number owner ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'phone_number')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'phone_number')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'phone_number')"                
                label="Phone number"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="12">
              <CTextarea 
                name="email_cc"
                v-model="fieldForm.email_cc.value"
                placeholder="Email CC ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'email_cc')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'email_cc')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'email_cc')"
                label="CC < email >"             
                /> 
                <label class="text-info">
                  example : address.email@email.com or address1.email@email.com,address2.email@email.com
                </label>                 
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="12">
              <div>
                <label>Description</label>&nbsp;&nbsp;              
                <CButton variant="outline" color="info" square size="sm" @click="fieldForm.description_html.showHTML = false">HTML Code</CButton>&nbsp;&nbsp;&nbsp;
                <CButton variant="outline" color="info" square size="sm" @click="fieldForm.description_html.showHTML = true">Visual</CButton> :
              </div>
              <div v-if="fieldForm.description_html.showHTML">
                <div id="editor-toolbar-container">
                  <span class="ql-formats">
                    <select class="ql-font"></select>
                    <select class="ql-size"></select>
                  </span>
                  <span class="ql-formats">
                    <button class="ql-bold"></button>
                    <button class="ql-italic"></button>
                    <button class="ql-underline"></button>
                    <button class="ql-strike"></button>
                  </span>
                  <span class="ql-formats">
                    <select class="ql-color"></select>
                    <select class="ql-background"></select>
                  </span>
                  <span class="ql-formats">
                    <button class="ql-script" value="sub"></button>
                    <button class="ql-script" value="super"></button>
                  </span>
                  <span class="ql-formats">
                    <button class="ql-header" value="1"></button>
                    <button class="ql-header" value="2"></button>
                    <button class="ql-blockquote"></button>
                    <button class="ql-code-block"></button>
                  </span>
                  <span class="ql-formats">
                    <button class="ql-list" value="ordered"></button>
                    <button class="ql-list" value="bullet"></button>
                    <button class="ql-indent" value="-1"></button>
                    <button class="ql-indent" value="+1"></button>
                  </span>
                  <span class="ql-formats">
                    <button class="ql-direction" value="rtl"></button>
                    <select class="ql-align"></select>
                  </span>
                  <span class="ql-formats">
                    <button class="ql-link"></button>
                    <button class="ql-customImage"><svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg></button>
                    <button class="ql-video"></button>
                  </span>
                </div>
                <vue-editor
                  ref="fieldForm_description_html" 
                  v-model="fieldForm.description_html.value" 
                  :editorOptions="fieldForm.description_html.editorSettings"
                  :customModules="fieldForm.description_html.modulesForEditor"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'description_html')"
                >
                </vue-editor>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.description_html.isValid === null) ? false : !fieldForm.description_html.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'description_html')}}
                </label>
              </div>
              <CTextarea 
                v-if="!fieldForm.description_html.showHTML"
                rows="10"
                name="description"
                v-model="fieldForm.description_html.value"
                placeholder="Description ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'description_html')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'description_html')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'description_html')"
                />   
            </CCol>  
          </CRow>                                             
        </CForm>
          <CRow v-if="activeOauthClientId == 1">
            <CCol sm="12">
              <CTextarea 
                name="url_referer"
                v-model="fieldForm.url_referer.value"
                placeholder="URL REFERER ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'url_referer')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'url_referer')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'url_referer')"
                label="URL REFERER"             
                /> 
                <label class="text-info">
                  example : (must be without 'http://'' or 'https://' and must be add last '/') event.ac.id/||event.com/new/
                </label>                 
            </CCol>
          </CRow>

        <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '') && false">
          <CCol sm="2">
              <label>Set Auto Publish Event Local</label><br>
              <label class="c-switch form-check-label c-switch-success">
                <input type="checkbox" class="c-switch-input form-check-input"                           
                  v-model="force_event_publish_domain">
                <span class="c-switch-slider"></span>
              </label>
              <CButton
                color="success"
                square
                size="sm"
                @click="processSaveAutoPublishEventLocal()"
              >
              Save Auto
            </CButton>               
          </CCol>
          <CCol sm="2">
              <label>Set Auto Publish Event From Share</label><br>
              <label class="c-switch form-check-label c-switch-success">
                <input type="checkbox" class="c-switch-input form-check-input"                           
                  v-model="force_event_publish_share">
                <span class="c-switch-slider"></span>
              </label>
              <CButton
                color="success"
                square
                size="sm"
                @click="processSaveAutoPublishEventShare()"
              >
              Save Auto
            </CButton>               
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <ModalAddImageEditor ref="ModalAddImageEditor" />        
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import store from '../../store';

import moment from "moment";
import { api } from '../../configurations/services';
import Multiselect from 'vue-multiselect';

import { VueEditor, Quill } from 'vue2-editor';
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";
import ModalAddImageEditor from '../../components/ModalAddImageEditor.vue';

import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'DomainForm',
  components: {
    Multiselect,
    VueEditor,
    // For ModalAddImageEditor must add :
      // import baseCallApiHelper from '../../helpers/baseCallApi';    
    ModalAddImageEditor
  },
  data () {
    return {
      store,
      moment,
      globalFunctions,
      vm : this,
      activeOauthClientId : localStorage.getItem('oauthClientId'),
      activeSystemUserName : localStorage.getItem('systemUserName'),
      activeSystemUserId : localStorage.getItem('systemUserId'),
      activeSystemUserDomain : localStorage.getItem('systemUserDomain'),
      createdBy : "-",
      createdOn : "-",
      modifiedBy : "-",
      modifiedOn : "-",         
      fieldForm: {
        id : {
          value : null,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null          
        },
        code : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.200'],
          isValid : null          
        },
        name : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.200'],
          isValid : null         
        },
        email : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.50', 'pattern.email'],
          isValid : null         
        },
        email_cc : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.65535'],
          isValid : null         
        },
        link_web : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.65535'],
          isValid : null         
        },        
        phone_number : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.50'],
          isValid : null         
        },
        description_html : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.65535'],
          isValid : null,
          showHTML : true,
          modulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
          editorSettings: {
            modules: {
              imageDrop: true,
              imageResize: {},
              toolbar: {
                container: "#editor-toolbar-container",
                handlers: {
                  customImage: () => {
                    this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;

                    this.$refs.ModalAddImageEditor.objectEditor = this.$refs.fieldForm_description_html.quill;
                    this.$refs.ModalAddImageEditor.toggleModalListImageEditor();
                  }
                }           
              }          
            }    
          }               
        },
        image : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        url_referer : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null       
        } ,        
        avatar_path : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },                                         
        su_oauth_clients_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null       
        }  
      },
      force_event_publish_domain : 0,
      force_event_publish_share : 0
    }
  },
  created () {
    if (this.$route.params.id) {
      this.processGetDomainDetail();
    } else {
      // if super admin
      if (this.activeOauthClientId == 1 || this.activeSystemUserId == 2) {
        this.fieldForm.su_oauth_clients_id.validationRules = ['required', 'min.3', 'max.2000'];
        this.processGetOauthClientsList();
      }      
    }
  },
  mounted() {
  },
  methods: {
    processGetDomainDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get domain detail",
        null,
        api.domain.read.method,
        api.domain.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value  = data.data.id;
            this.fieldForm.code.value = data.data.code;
            this.fieldForm.name.value = data.data.name;
            this.fieldForm.email.value = data.data.email;
            this.fieldForm.email_cc.value = data.data.email_cc;
            this.fieldForm.phone_number.value = data.data.phone_number;
            this.fieldForm.description_html.value = data.data.description_html;
            this.fieldForm.avatar_path.value = this.fieldForm.avatar_path.tempValue = data.data.avatar_path;
            this.fieldForm.link_web.value = data.data.link_web;

            this.fieldForm.url_referer.value = data.data.url_referer;

            this.force_event_publish_domain = data.data.force_event_publish_domain;
            this.force_event_publish_share = data.data.force_event_publish_share;

            this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"];

          } else {
          }
        }, 
        true, 
        true,
        true
      );
    },   
    processFormDomain: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            code  : this.fieldForm.code.value,
            name     : this.fieldForm.name.value,
            email     : this.fieldForm.email.value,
            email_cc     : this.fieldForm.email_cc.value,
            phone_number     : this.fieldForm.phone_number.value,
            url_referer : this.fieldForm.url_referer.value,
            description_html     : this.fieldForm.description_html.value,
            link_web : this.fieldForm.link_web.value,
            avatar_path : this.fieldForm.avatar_path.value
        }; 


        if (this.fieldForm.id.value === null) {

          if (this.activeOauthClientId == 1 || this.activeSystemUserId == 2) {
            data.su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' 
              || this.fieldForm.su_oauth_clients_id.value === '') ? null : this.fieldForm.su_oauth_clients_id.value.id;
          }

          baseCallApiHelper.callApi(
            "Create domain",
            null,
            api.domain.create.method,
            api.domain.create.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldForm.id.value = data.data.id;

                this.fieldForm.avatar_path.value = this.fieldForm.avatar_path.tempValue = data.data.avatar_path;

                this.createdBy = this.activeSystemUserName;
                this.createdOn = data.data["created_on"];
                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];
              } 
            }, 
            true, 
            true,
            true
          );
        } else {

          data.id = this.fieldForm.id.value;
          baseCallApiHelper.callApi(
            "Update domain",
            null,
            api.domain.update.method,
            api.domain.update.url,  
            data, 
            (status, data, message) => {
              if(status) {
                  this.modifiedBy = this.activeSystemUserName;
                  this.modifiedOn = data.data["modified_on"];
                  this.fieldForm.avatar_path.tempValue = this.fieldForm.avatar_path.value;               
              } 
            }, 
            true, 
            true,
            true
          );

        }
        e.preventDefault(); 
      }

    },
    optionsOauthClients ({ id, name }) {
      return `${id} : ${name}`
    },     
    processGetOauthClientsList: function () {
      const data = {};
      baseCallApiHelper.callApi(
        "Get Oauth Clients",
        {},
        api.oauth_clients.list.method,
        api.oauth_clients.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.su_oauth_clients_id.options =  data.data;

            if (this.fieldForm.su_oauth_clients_id.tempValue !== "") {
              var tempValue = this.fieldForm.su_oauth_clients_id.tempValue;
              this.fieldForm.su_oauth_clients_id.value = this.fieldForm.su_oauth_clients_id.options.find(element => element.id === tempValue);
            }
          }
        }, 
        true, 
        true,
        true
      );
    },
   processSaveAutoPublishEventLocal: function (e) {
      if (this.fieldForm.id.value != null && this.fieldForm.id.value != '') {
        const data = {
            id  : this.fieldForm.id.value,
            force_event_publish_domain     : this.force_event_publish_domain,
        }; 

          baseCallApiHelper.callApi(
            "save auto publish local",
            null,
            api.domain.updateforcepublish.method,
            api.domain.updateforcepublish.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.createdBy = this.activeSystemUserName;
                this.createdOn = data.data["created_on"];
                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];
              } 
            }, 
            true, 
            true,
            true
          );
      }
    },    
   processSaveAutoPublishEventShare: function (e) {
      if (this.fieldForm.id.value != null && this.fieldForm.id.value != '') {
        const data = {
            id  : this.fieldForm.id.value,
            force_event_publish_share     : this.force_event_publish_share,
        }; 

          baseCallApiHelper.callApi(
            "save auto publish share",
            null,
            api.domain.updateforcepublishshare.method,
            api.domain.updateforcepublishshare.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.createdBy = this.activeSystemUserName;
                this.createdOn = data.data["created_on"];
                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];
              } 
            }, 
            true, 
            true,
            true
          );
      }

    },

    toggleModalChooseAvatar: function() {
      this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;
      this.$refs.ModalAddImageEditor.objectParameter = this.fieldForm;
      this.$refs.ModalAddImageEditor.fieldName = "avatar_path";

      this.$refs.ModalAddImageEditor.toggleModalListImageEditor();      
    }    

  }
}

</script>
