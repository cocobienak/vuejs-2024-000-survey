<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormSpeaker"
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
                @click="globalFunctions.reloadAddNew($router, 'speaker/add')"
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
         <hr/>
          <CRow>
            <CCol sm="6">
                <CInput
                name="name"
                v-model="fieldForm.name.value"
                placeholder="Name ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'name')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'name')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'name')"                
                label="Name"
                />
            </CCol>            
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
          <CRow>
            <CCol sm="6">
              <div>
                <label>Prefix title</label>
                <multiselect 
                  v-model="fieldForm.prefix_degree.value" 
                  :options="fieldForm.prefix_degree.options" 
                  :custom-label="optionsDegree" 
                  :taggable="true" @tag="addAnotherDegree"
                  :allow-empty="true"
                  :multiple="true"
                  placeholder="Select Prefix Degree"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'prefix_degree')"                 
                  label="title" track-by="title">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.prefix_degree.isValid === null) ? false : !fieldForm.prefix_degree.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'prefix_degree')}}
                  </label>
              </div> 
            </CCol>
            <CCol sm="6">
               <div>
                <label>Sufix title</label>
                <multiselect 
                  v-model="fieldForm.sufix_degree.value" 
                  :options="fieldForm.sufix_degree.options" 
                  :custom-label="optionsDegree" 
                  :allow-empty="true"
                  :taggable="true" @tag="addAnotherDegree"
                  :multiple="true"
                  placeholder="Select Sufix Title"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'sufix_degree')"                 
                  label="title" track-by="title">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.sufix_degree.isValid === null) ? false : !fieldForm.sufix_degree.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'sufix_degree')}}
                  </label>
              </div>   
            </CCol>
          </CRow>          
          <CRow>
            <CCol sm="6">
              <CInput
                name="email"
                v-model="fieldForm.email.value"
                placeholder="Email ..."
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
                placeholder="Phone Number ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'phone_number')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'phone_number')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'phone_number')"                
                label="Phone Number"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6">
              <CTextarea
                name="description_html"
                v-model="fieldForm.description_html.value"
                placeholder="Description ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'description_html')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'description_html')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'description_html')"
                label="Description"
              />
            </CCol>
            <CCol sm="6">
              <CTextarea
                name="address"
                v-model="fieldForm.address.value"
                placeholder="Address ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'address')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'address')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'address')"
                label="Address"
              />
            </CCol>
          </CRow>
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
        </CForm>
      </CCardBody>
    </CCard>
    <ModalAddImageEditor ref="ModalAddImageEditor" />        

  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import store from '../../store';
import Multiselect from 'vue-multiselect';
import router from '../../router';

import moment from "moment";
import { api } from '../../configurations/services';

import ModalAddImageEditor from '../../components/ModalAddImageEditor.vue';

import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'SpeakerForm',
  components: {     
    Multiselect,
    ModalAddImageEditor
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
        name : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.100'],
          isValid : null        
        },
        prefix_degree : {
          value : "",
          tempValue : "",
          options: [],          
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.100'],
          isValid : null        
        },
        sufix_degree : {
          value : "",
          tempValue : "",
          options: [],          
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.100'],
          isValid : null        
        },
        description_html : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        email : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.50', 'pattern.email'],
          isValid : null        
        },
        phone_number : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.50', 'pattern.phonenumber'],
          isValid : null        
        },                 
        address : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
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
      }

    }
  },
  created () {
    this.processGetDegreeList();
    if (this.$route.params.id) {
      this.processGetSpeakerDetail();
    } else {
      // if super admin
      if (this.activeOauthClientId == 1) {
        this.processGetOauthClientsList();
      }

    }
  },
  mounted() {
  },
  methods: {
    processGetSpeakerDetail: function () {

      const data = {
      };
      baseCallApiHelper.callApi(
        "Get speaker detail",
        null,
        api.speaker.read.method,
        api.speaker.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value = data.data.id;
            this.fieldForm.name.value = data.data.name;

            this.fieldForm.address.value = data.data.address;
            this.fieldForm.email.value = data.data.email;
            this.fieldForm.phone_number.value = data.data.phone_number;
            this.fieldForm.avatar_path.value = this.fieldForm.avatar_path.tempValue = data.data.avatar_path;
            this.fieldForm.link_web.value = data.data.link_web;

            this.fieldForm.description_html.value = data.data.description_html;

            if (data.data.prefix_degree !== null) {
              this.fieldForm.prefix_degree.tempValue = data.data.prefix_degree.split(" ");
            } else {
              this.fieldForm.prefix_degree.tempValue = [];
            }

            if (data.data.sufix_degree !== null) {
              this.fieldForm.sufix_degree.tempValue = data.data.sufix_degree.split(" ");
            } else {
              this.fieldForm.sufix_degree.tempValue = [];
            }



            var valueprefix_degree = [];
            var optionsprefix_degree = this.fieldForm.prefix_degree.options;
            var vm = this;
            this.fieldForm.prefix_degree.tempValue.forEach(function(item) {
                var check = optionsprefix_degree.find(element => element.title === item);
                if (typeof check != "undefined") {
                  valueprefix_degree.push(check);
                } else {
                  valueprefix_degree.push({title : item});
                  vm.addAnotherDegree(item);
                }              
            });
            this.fieldForm.prefix_degree.value = valueprefix_degree;

            var valuesufix_degree = [];
            var optionssufix_degree = this.fieldForm.sufix_degree.options;
            this.fieldForm.sufix_degree.tempValue.forEach(function(item) {
                var check = optionssufix_degree.find(element => element.title === item);
                if (typeof check != "undefined") {
                  valuesufix_degree.push(check);
                } else {
                  valuesufix_degree.push({title : item});
                  vm.addAnotherDegree(item);
                } 
            });
            this.fieldForm.sufix_degree.value = valuesufix_degree;

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
    processFormSpeaker: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        var prefixDegree = "";
        if (this.fieldForm.prefix_degree.value !== "" && this.fieldForm.prefix_degree.value !== null) {
          this.fieldForm.prefix_degree.value.forEach(function(item) {
            prefixDegree = prefixDegree + " " + item.title;
          });
        }

        var sufixDegree = "";
        if (this.fieldForm.sufix_degree.value !== "" && this.fieldForm.sufix_degree.value !== null) {
          this.fieldForm.sufix_degree.value.forEach(function(item) {
            sufixDegree = sufixDegree + " " + item.title;
          });
        }

        const data = {
            name  : this.fieldForm.name.value,
            prefix_degree     : prefixDegree.trimStart(),
            sufix_degree  : sufixDegree.trimStart(),
            address     : this.fieldForm.address.value,
            email  : this.fieldForm.email.value,
            phone_number     : this.fieldForm.phone_number.value,
            description_html  : this.fieldForm.description_html.value,
            link_web : this.fieldForm.link_web.value,
            avatar_path : this.fieldForm.avatar_path.value                                              
        }; 

        if (this.fieldForm.id.value === null) {

          var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' || this.fieldForm.su_oauth_clients_id.value ==='') ? null : this.fieldForm.su_oauth_clients_id.value.id;
          
          if (this.activeOauthClientId == 1) {
            data.su_oauth_clients_id = su_oauth_clients_id;
          }

          baseCallApiHelper.callApi(
            "Create speaker",
            null,
            api.speaker.create.method,
            api.speaker.create.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldForm.id.value = data.data.id

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
            "Update speaker",
            null,
            api.speaker.update.method,
            api.speaker.update.url,  
            data, 
            (status, data, message) => {
              if(status) {

                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];                
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
        true, 
        true,
        true
      );
    },
    

    addAnotherDegree: function(newTag) {
      if (this.fieldForm.prefix_degree.options === "") {
        this.fieldForm.prefix_degree.options = [];
      }

      if (this.fieldForm.sufix_degree.options === "") {
        this.fieldForm.sufix_degree.options = [];
      }

      var check = this.fieldForm.prefix_degree.options.find(element => element.title === newTag);
      if (typeof check == "undefined") {
        this.fieldForm.prefix_degree.options.push({title : newTag});
      } 

      var check = this.fieldForm.sufix_degree.options.find(element => element.title === newTag);
      if (typeof check == "undefined") {
        this.fieldForm.sufix_degree.options.push({title : newTag});
      } 
    },
    optionsDegree ({ title }) {
      return `${title}`
    },     
    processGetDegreeList: function () {
      const data = {
        select : ['title'],
      };
      baseCallApiHelper.callApi(
        "Get Degree List",
        {},
        api.degree.list.method,
        api.degree.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.prefix_degree.options =  data.data;

            if (this.fieldForm.prefix_degree.tempValue !== "") {
              var valueprefix_degree = [];
              var optionsprefix_degree = this.fieldForm.prefix_degree.options;
              this.fieldForm.prefix_degree.tempValue.forEach(function(item) {
                var check = optionsprefix_degree.find(element => element.title === item);
                if (typeof check != "undefined") {
                  valueprefix_degree.push(check);
                } else {
                  valueprefix_degree.push({title : item});
                  vm.addAnotherDegree(item);
                }
              });
              this.fieldForm.prefix_degree.value = valueprefix_degree; 
            }

            this.fieldForm.sufix_degree.options =  data.data;
            if (this.fieldForm.sufix_degree.tempValue !== "") {
              var valuesufix_degree = [];
              var optionssufix_degree = this.fieldForm.sufix_degree.options;
              this.fieldForm.sufix_degree.tempValue.forEach(function(item) {
                var check = optionssufix_degree.find(element => element.title === item);
                if (typeof check != "undefined") {
                  valuesufix_degree.push(check);
                } else {
                  valuesufix_degree.push({title : item});
                  vm.addAnotherDegree(item);
                }
              });
              this.fieldForm.sufix_degree.value = valuesufix_degree; 
            }

          }
        }, 
        true, 
        true,
        true
      );
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
