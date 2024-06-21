<template>
  <div>
    <CCard>
      <CCardBody>
        <CButton color="info" square size="sm" @click="showMainForm = !showMainForm" class="button-show">{{(showMainForm) ? 'Hide Main Form' : 'show Main Form'}}</CButton>
        <CForm style="clear:both"
          @submit.prevent="processFormEditorialLetter" v-if="showMainForm"
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
                @click="globalFunctions.reloadAddNew($router, 'editorial-letter/add')"
              >
              Add new
            </CButton>
          </div>
          <CRow v-if="showFieldFormValidation">
            <CCol sm="12">
              <hr/>
              <CRow v-for="(fieldFormValidation, index) in  fieldForm" :key="index">
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353; padding-left:20px" 
                    v-show="(fieldFormValidation.isValid === null || fieldFormValidation.isValid) ? false : true" >
                    {{index + " " + globalFunctions.getInvalidFeedback(vm, 'fieldForm', index)}}
                </label>
              </CRow>
              <hr/>
            </CCol>
          </CRow>             
          <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
            <CCol sm="12">
                <label class="text-info">Created by : {{createdBy}} , {{ moment(createdOn).format('LLL') }}</label>
                <label class="text-info" style="float:right;">Modified by : {{modifiedBy}} , {{ moment(modifiedOn).format('LLL') }}</label>

            </CCol>
          </CRow> 
          <CRow v-if="((activeOauthClientId == 1) && (fieldForm.id.value === null || fieldForm.id.value === ''))">
            <CCol sm="12">
              <div>
                <label>Oauth Clients</label>
                <multiselect 
                  v-model="fieldForm.su_oauth_clients_id.value" 
                  :options="fieldForm.su_oauth_clients_id.options" 
                  :custom-label="optionsOauthClients" 
                  :allow-empty="true"
                  placeholder="Select one"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'su_oauth_clients_id'); processGetListDomain();"
                  label="name" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.su_oauth_clients_id.isValid === null) ? false : !fieldForm.su_oauth_clients_id.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'su_oauth_clients_id')}}
                  </label>
              </div>
            </CCol>
          </CRow>             
          <CRow v-if="showDomain">
            <CCol sm="12">
              <div>
                <label>Select Domain</label>
                <multiselect 
                  v-model="fieldForm.domain_id.value" 
                  :options="fieldForm.domain_id.options" 
                  :custom-label="optionsDomain" 
                  :allow-empty="true"
                  placeholder="Select one"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'domain_id')"                 
                  label="code" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.domain_id.isValid === null) ? false : !fieldForm.domain_id.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'domain_id')}}
                  </label>
              </div> 
            </CCol>
          </CRow>   
          <CRow>
            <CCol sm="6">
              <CInput
                name="name"
                v-model="fieldForm.name.value"
                placeholder="Name Editorial Letter ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'name')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'name')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'name')"                
                label="Name "
              />
            </CCol>
            <CCol sm="6">
              <br>
              <input type="radio" id="publish_1" value="publish_local" v-model="fieldForm.publish_status_form.value"
                style="margin-right:15px;cursor:pointer;">
              <label for="publish_1" style="cursor:pointer;">PUBLISH ON YOUR WEBSITE</label>
              <br>
                <label class="text-info">
                  (this option only for your website)
                </label>
              <br>
              <input type="radio" id="publish_2" value="publish_global" v-model="fieldForm.publish_status_form.value"
                style="margin-right:15px;cursor:pointer;">
              <label for="publish_2" style="cursor:pointer;">PUBLISH ON WEB Editorial Letter</label>
              <br>
                <label class="text-info">
                  (this option will need approval from WEB Editorial Letter admin)
                </label>
              <br>
              <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.publish_status_form.isValid === null) ? false : !fieldForm.publish_status_form.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'publish_status_form')}}
              </label>
            </CCol>
          </CRow>                     
          <CRow>
            <CCol sm="12">
              <hr/>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6" style="display:table-cell;vertical-align: middle;text-align:left;">
                <CButton
                  style="margin-left:8px;"
                  color="info"
                  square
                  size="sm"
                  @click="toggleModalChooseEditorialBanner()"
                >
                  Choose Editorial Letter Banner
              </CButton>
              <br/><br/>            
              <div v-if="fieldForm.editorial_letter_image_id.value" style="display:block; vertical-align: middle; text-align: left; width:500px">

                <div>
                  <span style="background: #e2e2e2; vertical-align: middle; text-align: center; display:table-cell; width: 600px; height: 300px; border: 2px solid rgb(216, 216, 216); border-radius: 6px;">                
                    <img 
                      style="margin: 0 auto;display: block;height: auto;width: auto;max-width:590px;max-height:290px;"
                      :src="fieldForm.editorial_letter_image_id.value[0].path" 
                    />  
                  </span>
                </div>
                <br/>
                <CButton
                  style="margin-left:8px;"
                  color="warning"
                  square
                  size="sm"
                  @click="fieldForm.editorial_letter_image_id.value = ''"
                >
                    <span style="color:#fff;">Remove Editorial Letter Banner</span>
                </CButton>

              </div>
              <br>
            </CCol>                          
          </CRow>            
          <CRow>
            <CCol sm="12">
              <div>
                <label>Editorial Letter</label>&nbsp;&nbsp;              
                <CButton variant="outline" color="info" square size="sm" @click="fieldForm.editorial_letter_html.showHTML = false">HTML Code</CButton>&nbsp;&nbsp;&nbsp;
                <CButton variant="outline" color="info" square size="sm" @click="fieldForm.editorial_letter_html.showHTML = true">Visual</CButton> :
              </div>
              <div v-if="fieldForm.editorial_letter_html.showHTML">
                <div id="editor-toolbar-editorial_letter_html">
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
                  ref="fieldForm_editorial_letter_html" 
                  v-model="fieldForm.editorial_letter_html.value" 
                  :editorOptions="fieldForm.editorial_letter_html.editorSettings"
                  :customModules="fieldForm.editorial_letter_html.modulesForEditor"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'editorial_letter_html')"
                >
                </vue-editor>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.editorial_letter_html.isValid === null) ? false : !fieldForm.editorial_letter_html.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'editorial_letter_html')}}
                </label>
              </div>
              <CTextarea 
                v-if="!fieldForm.editorial_letter_html.showHTML"
                rows="10"
                name="description"
                v-model="fieldForm.editorial_letter_html.value"
                placeholder="Description ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'editorial_letter_html')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'editorial_letter_html')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'editorial_letter_html')"
             
                />   
            </CCol>          
          </CRow>
          <hr/>                                                                             
          <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')" >
            <CCol sm="12">
              <CButton color="success" square size="sm"
                @click="processFormCode()"
              >
                Edit Slug
              </CButton>
              <CInput
                name="code"
                v-model="fieldFormCode.code.value"
                placeholder="Slug ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldFormCode', 'code')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldFormCode', 'code')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormCode', 'code')"                
                label="Slug "
              />
              <label class="text-info">The “slug” is unique name for the URL-friendly version.
                  <br> It will be forced to lowercase and replace spaces with “-”.
              </label>
            </CCol>
          </CRow>         
        </CForm>
        <CButton v-if="showMainForm" color="info" square size="sm" @click="showMainForm = !showMainForm" class="button-show">{{(showMainForm) ? 'Hide Main Form' : 'show Main Form'}}</CButton>
        <hr style="clear:both"/>
        <CButton color="info" square size="sm" @click="showSubForm = !showSubForm" class="button-show">{{(showSubForm) ? 'Hide Sub Form' : 'show Sub Form'}}</CButton>
        <div v-if="showSubForm && (fieldForm.id.value !== null && fieldForm.id.value !== '')" style="clear:both">
          <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
            <CCol sm="12">
              <div>
                <CButton
                    color="success"
                    square
                    size="sm"
                    @click="processSaveShareToDomain()"
                  >
                  Set Share To Domain
                </CButton>
                <multiselect 
                  v-model="fieldFormShare.editorial_letter_share_domain.value" 
                  :options="fieldFormShare.editorial_letter_share_domain.options" 
                  :custom-label="optionsDomain" 
                  :allow-empty="true"
                  :multiple="true"
                  placeholder="Select Domain To Share"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormShare', 'editorial_letter_share_domain')"                 
                  label="code" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldFormShare.editorial_letter_share_domain.isValid === null) ? false : !fieldFormShare.editorial_letter_share_domain.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldFormShare', 'editorial_letter_share_domain')}}
                  </label>
              </div> 
            </CCol>
          </CRow>         
        </div>
        <CButton color="info" v-if="showSubForm && (fieldForm.id.value !== null && fieldForm.id.value !== '')" square size="sm" @click="showSubForm = !showSubForm" class="button-show">{{(showSubForm) ? 'Hide Sub Form' : 'show Sub Form'}}</CButton>
        <hr style="clear:both"/>
      </CCardBody>
    </CCard>
    <ModalAddImageEditor ref="ModalAddImageEditor" />        

  </div>
</template>

<style scoped>

  /* #table-attendance {
    height: 500px;
  } */

  .button-show {
    float: right;
    margin: 10px 0px;
  }

  .box_list_image {
    display: flex;
    flex-wrap: wrap;   
    justify-content: center;
  }

  .item_image {
    padding:8px 0px 8px 15px;
  }

  .span_image_thumbnail {
    vertical-align: middle; 
    text-align: center; 
    display:table-cell; 
    width: 420px; 
    height: 210px; 
    border: 2px solid #acacac; 
    border-radius: 6px;
    cursor: pointer;
  }

  .span_image_thumbnail:hover {
    border: 2px solid #ffa600; 
  }

  .image_thumbnail {
    margin: 0 auto;display: block;height: auto;width: auto;max-width:420px;max-height:210px;
  }

  .span_image_thumbnail_modal {
    vertical-align: middle; 
    text-align: center; 
    display:table-cell; 
    width: 210px; 
    height: 115px; 
    border: 2px solid #acacac; 
    border-radius: 6px;
    cursor: pointer;
  }

  .span_image_thumbnail_modal:hover {
    border: 2px solid #ffa600; 
  }

  .image_thumbnail_modal {
    margin: 0 auto;display: block;height: auto;width: auto;max-width:210px;max-height:115px;
  }

  .image_selected {
    border: 8px solid #7bff00; 
  }


</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"></style>

<script>
import router from '../../router';
import store from '../../store';
import Multiselect from 'vue-multiselect';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

import { VueEditor, Quill } from 'vue2-editor';
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";
import ModalAddImageEditor from '../../components/ModalAddImageEditor.vue';

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'EditorialLetterForm',
  components: {
    Multiselect,
    VueCtkDateTimePicker,
    VueEditor,
    // For ModalAddImageEditor must add :
      // import baseCallApiHelper from '../../helpers/baseCallApi';    
    ModalAddImageEditor,
  },
  data () {
    return {
      router,
      store,
      moment,
      globalFunctions,
      vm : this,
      activeOauthClientId : localStorage.getItem('oauthClientId'),
      activeSystemUserName : localStorage.getItem('systemUserName'),
      activeSystemUserId : localStorage.getItem('systemUserId'),
      activeSystemUserDomain : localStorage.getItem('systemUserDomain'),
      activeSystemUserDomainId : localStorage.getItem('systemUserDomainId'),
      createdBy : "-",
      createdOn : "-",
      modifiedBy : "-",
      modifiedOn : "-",
      showDomain : false,
      oauthClientsIdForm : "",
      showFieldFormValidation : false,
      fieldFormCode : {
        code : {
          value : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.5'],
          isValid : null        
        }
      },
      fieldForm: {
        id : {
          value : null,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null          
        },
        name : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.100'],
          isValid : null        
        },       

        editorial_letter_image_id : {
          value : null,
          path : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },        
        editorial_letter_html : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.65535'],
          isValid : null,
          showHTML : true,
          modulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
          editorSettings: {
            modules: {
              imageDrop: true,
              imageResize: {},
              toolbar: {
                container: "#editor-toolbar-editorial_letter_html",
                handlers: {
                  customImage: () => {  
                  this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;

                    this.$refs.ModalAddImageEditor.objectEditor = this.$refs.fieldForm_editorial_letter_html.quill;
                    this.$refs.ModalAddImageEditor.toggleModalListImageEditor();
                  }
                }           
              }          
            }    
          }              
        },
        publish_status : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        publish_status_form : {
          value : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3'],
          isValid : null        
        },        
        domain_id : {
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
      fieldFormShare : {
        editorial_letter_share_domain : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },  
      },
      showMainForm : true,    
      showSubForm : true

    }
  },
  created () {
    if (this.$route.params.id) {
      this.fieldForm.id.value = this.$route.params.id;

      this.showMainForm = true;     
      this.showSubForm = true;
      
      this.processGetEditorialLetterDetail();

    } else {
        this.showMainForm = true;     
        this.showSubForm = false;

      // if super admin
      if (this.activeOauthClientId == 1) {
        this.processGetOauthClientsList();
      }
      
      // if (this.activeSystemUserDomain.toLowerCase() == 'master' && this.activeOauthClientId != 1) {
        // this.processGetListDomain();
      // }
    }
  },
  mounted() {
  },
  methods: {
    processGetEditorialLetterDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get editorial letter  detail",
        null,
        api.editorial_letter.read.method,
        api.editorial_letter.read.url + '/' + this.$route.params.id + '?is_form=1', 
        data, 
        (status, data, message) => {
          if(status) {

            this.oauthClientsIdForm = data.data.oauth_clients_id;
            this.fieldForm.domain_id.tempValue = data.data.domain_id;
            this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.id === data.data.domain_id);

            this.fieldForm.id.value = data.data.id;
            this.fieldFormCode.code.value = this.fieldFormCode.code.tempValue = data.data.code;
            this.fieldForm.name.value = data.data.name;

            this.fieldForm.publish_status.value = data.data.publish_status;

            if (this.fieldForm.publish_status.value === 'publish_local') {
              this.fieldForm.publish_status_form.value = 'publish_local';
              this.fieldForm.publish_status_form.tempValue = 'publish_local';
            } else {
              this.fieldForm.publish_status_form.value = 'publish_global';
              this.fieldForm.publish_status_form.tempValue = 'publish_global';
            }


            this.fieldForm.editorial_letter_image_id.value = '';
            if (data.data.editorial_letter_image_id !== null && data.data['editorial_letter_image_id.path'] !== null) {
              this.fieldForm.editorial_letter_image_id.value =[{
                id : data.data.editorial_letter_image_id,
                path : data.data['editorial_letter_image_id.path']                  
              }]
            }
            this.fieldForm.editorial_letter_html.value = data.data.editorial_letter_html;

            this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"];


            // Share Domain ------------------------
              this.processGetListDomainForShare();
              this.fieldFormShare.editorial_letter_share_domain.tempValue = data.editorial_letter_share_domain;

              var valueShareToDomain = [];
              var optionsShareToDomain = this.fieldFormShare.editorial_letter_share_domain.options;
              data.editorial_letter_share_domain.forEach(function(item) {
                valueShareToDomain.push(optionsShareToDomain.find(element => element.id === item.domain_id));
              });
              this.fieldFormShare.editorial_letter_share_domain.value = valueShareToDomain;
            // ------------------------ Share Domain


            if (this.activeOauthClientId == 1) {
              this.processGetListDomain();
            }

          } else {
          }
        }, 
        true, 
        true,
        true
      );
    },
    processFormEditorialLetter: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            name                     : this.fieldForm.name.value,
            editorial_letter_image_id        : (typeof(this.fieldForm.editorial_letter_image_id.value) === 'undefined' || typeof(this.fieldForm.editorial_letter_image_id.value[0]) === 'undefined' 
              || typeof(this.fieldForm.editorial_letter_image_id.value[0].id) === 'undefined') 
              ? null : this.fieldForm.editorial_letter_image_id.value[0].id,              
            editorial_letter_html      : this.fieldForm.editorial_letter_html.value,
        }; 


        if (this.fieldForm.id.value === null) {

          if (this.activeOauthClientId == 1) {
            data.domain_id = this.fieldForm.domain_id.tempValue = (typeof(this.fieldForm.domain_id.value) === 'undefined' || this.fieldForm.domain_id.value ==='') ? null : this.fieldForm.domain_id.value.id;        
          }

          var allowForSuAdmin = true;

          var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' || this.fieldForm.su_oauth_clients_id.value ==='') ? null : this.fieldForm.su_oauth_clients_id.value.id;

          if (this.activeOauthClientId == 1) {
            if(su_oauth_clients_id == null) {
              allowForSuAdmin = false;
            } else {
              data.su_oauth_clients_id = su_oauth_clients_id;
            }
          }

          data.publish_status = this.fieldForm.publish_status_form.value;

          if (allowForSuAdmin) {
            baseCallApiHelper.callApi(
              "Create editorial letter ",
              null,
              api.editorial_letter.create.method,
              api.editorial_letter.create.url, 
              data, 
              (status, data, message) => {
                if(status) {
                  // console.log(data);
                  this.fieldForm.id.value = this.$route.params.id = data.data.id
                  this.fieldFormCode.code.value = data.data.code;

                  this.oauthClientsIdForm = su_oauth_clients_id;

                  this.showDomain = false;

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
            alert("If Super Admin, su_oauth_clients_id cannot be null ");
          }


        } else {
          
          if (this.fieldForm.publish_status_form.value != this.fieldForm.publish_status_form.tempValue) {
            data.publish_status = this.fieldForm.publish_status_form.value ;
          }

          data.id = this.fieldForm.id.value;
          baseCallApiHelper.callApi(
            "Update editorial letter ",
            null,
            api.editorial_letter.update.method,
            api.editorial_letter.update.url,  
            data, 
            (status, data, message) => {
              if(status) {

                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];
                this.showSubForm = true;
                this.processGetEditorialLetterDetail();

              } 
            }, 
            true, 
            true,
            true
          );

        }
        e.preventDefault(); 
      } else {
        this.showFieldFormValidation = true;
      }

    },
    processFormCode: function () {
      if (globalFunctions.validationForm(this, 'fieldFormCode') && (this.fieldForm.id.value !== null && this.fieldForm.id.value !== '')) {
        const data = {
            id   : this.fieldForm.id.value,
            code : this.fieldFormCode.code.value
        };
          baseCallApiHelper.callApi(
            "Update slug editorial letter ",
            null,
            api.editorial_letter.updatecode.method,
            api.editorial_letter.updatecode.url,  
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldFormCode.code.value = data.data.code;
                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];

              } else {
                this.fieldFormCode.code.isValid = false;
                this.fieldFormCode.code.invalidFeedback = message;

              }
            }, 
            true, 
            true,
            true
          );                 
      }
    },

    optionsOauthClients ({ id, name }) {
      return `${id} : ${name}`
    },     
    processGetOauthClientsList: function () {
      this.fieldForm.su_oauth_clients_id.validationRules = ['required', 'min.3', 'max.2000'];

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
        false, 
        true,
        true
      );
    },
    optionsDomain ({ id, code, name, link_web }) {
      var title = name;
      if (link_web !== "" && link_web !== null)
        title += ' - ' + link_web;

      return `${code} : ${title} `
    },                      
    processGetListDomain: function () {
      this.fieldForm.domain_id.validationRules = ['required', 'min.3', 'max.2000'];
      
      var data = {};
      if (!this.$route.params.id && this.activeOauthClientId == 1) {
        data = {
          "filter" : "oauth_clients_id = " + this.fieldForm.su_oauth_clients_id.value.id
        };
      }  else if (this.$route.params.id) {
        data = {
          "filter" : "oauth_clients_id = " + this.oauthClientsIdForm
        };        
      }

      baseCallApiHelper.callApi(
        "Get List Domain",
        {},
        api.domain.list.method,
        api.domain.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.domain_id.options =  data.data;
            if (this.fieldForm.domain_id.tempValue !== "") {
              this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.id === this.fieldForm.domain_id.tempValue);
            }


          }
        }, 
        false, 
        true,
        true
      );

      this.showDomain = true;
      
    },
    processGetListDomainForShare: function () {     
        var data = {
          "filter" : "(oauth_clients_id = " + this.oauthClientsIdForm + " and code <> 'master' and id <> " + this.fieldForm.domain_id.tempValue + ")"
        };

      baseCallApiHelper.callApi(
        "Get List Domain Share",
        {"Privilege": "readeditorialletter"},
        api.domain.list.method,
        api.domain.list.url, 
        data, 
        (status, data, message) => {
          if(status) {
          this.fieldFormShare.editorial_letter_share_domain.options = data.data;

          if (this.fieldFormShare.editorial_letter_share_domain.tempValue !== "") {
            var valueShareToDomain = [];
            var optionsShareToDomain = this.fieldFormShare.editorial_letter_share_domain.options;
            this.fieldFormShare.editorial_letter_share_domain.tempValue.forEach(function(item) {
              valueShareToDomain.push(optionsShareToDomain.find(element => element.id === item.domain_id));
            });
            this.fieldFormShare.editorial_letter_share_domain.value = valueShareToDomain; 
          }


          }
        }, 
        false, 
        true,
        true
      );      
    },  
    processSaveShareToDomain: function() {
      if (this.fieldForm.id.value != null && this.fieldForm.id.value != '') {
        const data = {
            editorial_letter_id  : this.fieldForm.id.value,
            editorial_letter_share_domain     : this.fieldFormShare.editorial_letter_share_domain.value,
        }; 

          baseCallApiHelper.callApi(
            "Share editorial letter",
            null,
            api.editorial_letter.updateshareeditorialletter.method,
            api.editorial_letter.updateshareeditorialletter.url, 
            data, 
            (status, data, message) => {
              if(status) {
              } 
            }, 
            true, 
            true,
            true
          );
      }
    },


 
    toggleModalChooseEditorialBanner: function() {
      this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;
      this.$refs.ModalAddImageEditor.objectParameter = this.fieldForm;
      this.$refs.ModalAddImageEditor.fieldName = "editorial_letter_image_id";
      this.$refs.ModalAddImageEditor.is_arrayWithIdImage = true;

      this.$refs.ModalAddImageEditor.toggleModalListImageEditor();      
    }      
  }
}

</script>
