<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormRole"
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
                @click="globalFunctions.reloadAddNew($router, 'role/add')"
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
                  label="code" track-by="code">
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
                name="roleName"
                v-model="fieldForm.roleName.value"
                placeholder="Role name like 'Administrator or Data Entry...'"
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'roleName')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'roleName')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'roleName')"
                label="Role Name"
                />
            </CCol>
            <CCol sm="6">
                <CInput
                name="description"
                v-model="fieldForm.description.value"
                placeholder="Role description..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'description')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'description')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'description')"                
                label="Description"
                />
            </CCol>
          </CRow>         

          <hr/>
          <div v-if="rendertemplatePermission">
            <CRow v-for="(moduleItem, moduleIndex) in this.templatePermission" :key="`module${moduleIndex}`" style="border-bottom: solid 1px #a1a1a1;">
              <CCol sm="4">
                  <div>
                    <label class="font-weight-bolder">{{ moduleItem[0][0]["module_id.code"] }}</label>
                    <CRow v-for="(permissionItem, permissionIndex) in moduleItem[0]" :key="`permission${permissionIndex}`">
                      <CCol sm="6">
                        <label>{{ (permissionItem["permission_id.label"]) ? permissionItem["permission_id.label"] : permissionItem["label"] }}</label>
                      </CCol>
                      <CCol sm="6"> :
                        <label class="c-switch form-check-label c-switch-success">
                          <input type="checkbox" class="c-switch-input form-check-input"                           
                            v-model="checkboxRolePermission"
                            :value="{permission_id: (permissionItem['permission_id']) ? permissionItem['permission_id'] : permissionItem['id'], action_value : 1}">
                          <span class="c-switch-slider"></span>
                        </label>
                      </CCol>
                    </CRow>
                  </div>
              </CCol>
              <CCol sm="4">
                <div v-if="(typeof(moduleItem[1]) !== 'undefined' && moduleItem[1] !== null)">
                  <label class="font-weight-bolder">{{ moduleItem[1][0]["module_id.code"] }}</label>
                  <CRow v-for="(permissionItem, permissionIndex) in moduleItem[1]" :key="`permission${permissionIndex}`">
                    <CCol sm="6">
                      <label>{{ (permissionItem["permission_id.label"]) ? permissionItem["permission_id.label"] : permissionItem["label"] }}</label>
                    </CCol>
                    <CCol sm="6"> :
                      <label class="c-switch form-check-label c-switch-success">
                        <input type="checkbox" class="c-switch-input form-check-input"                           
                          v-model="checkboxRolePermission"
                          :value="{permission_id: (permissionItem['permission_id']) ? permissionItem['permission_id'] : permissionItem['id'], action_value : 1}">
                        <span class="c-switch-slider"></span>
                      </label>
                    </CCol>
                  </CRow>                  
                </div>
              </CCol>
              <CCol sm="4">
                <div v-if="(typeof(moduleItem[2]) !== 'undefined' && moduleItem[2] !== null)">
                  <label class="font-weight-bolder">{{ moduleItem[2][0]["module_id.code"] }}</label>
                  <CRow v-for="(permissionItem, permissionIndex) in moduleItem[2]" :key="`permission${permissionIndex}`">
                    <CCol sm="6">
                      <label>{{ (permissionItem["permission_id.label"]) ? permissionItem["permission_id.label"] : permissionItem["label"] }}</label>
                    </CCol>
                    <CCol sm="6"> :
                      <label class="c-switch form-check-label c-switch-success">
                        <input type="checkbox" class="c-switch-input form-check-input"                           
                          v-model="checkboxRolePermission"
                          :value="{permission_id: (permissionItem['permission_id']) ? permissionItem['permission_id'] : permissionItem['id'], action_value : 1}">
                        <span class="c-switch-slider"></span>
                      </label>
                    </CCol>
                  </CRow>                    
                </div>
              </CCol>
            </CRow>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import Multiselect from 'vue-multiselect';
import store from '../../store';

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'RoleForm',
  components: {
    Multiselect
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
      showDomain : false,
      oauthClientsIdForm : "",                  
      fieldForm: {
        id : {
          value : null,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null          
        },
        roleName : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.100'],
          isValid : null
        },
        description : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.1', 'max.100'],
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
      templatePermission: [],
      rendertemplatePermission: false,
      checkboxRolePermission:[]

    }
  },
  created () {
    if (this.$route.params.id) {
      this.processGetRoleDetail();
    } else {
      this.processGetTemplatePermission();      
      // if super admin
      if (this.activeOauthClientId == 1) {
        this.processGetOauthClientsList();
      }

      // if (this.activeSystemUserDomain.toLowerCase() == 'master' && this.activeOauthClientId != 1) {
      //   this.processGetListDomain();
      // }

    }
  },
  mounted() {
  },
  methods: {
    processGetRoleDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get role detail",
        null,
        api.role.read.method,
        api.role.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value = this.$route.params.id;
            this.fieldForm.roleName.value = data.data.name;
            this.fieldForm.description.value = data.data.description;

            this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"];

            var i = 0;
            var col = 1;
            for (let key in data.role_permission) {
                
              data.role_permission[key].forEach(permissionItem => {
                if (permissionItem.action_value > 0) {
                  this.checkboxRolePermission.push({permission_id: permissionItem.permission_id, action_value : permissionItem.action_value})
                }
              });    
              if(col === 1) {
                this.templatePermission[i] = [];
                this.templatePermission[i].push(data.role_permission[key]);
                col++;
              } else {
                this.templatePermission[i].push(data.role_permission[key]);
                if(col === 3) {
                  i++;
                  col = 1;
                } else {
                  col++;
                }
              }
            }
            this.rendertemplatePermission = true;

            this.fieldForm.domain_id.tempValue = data.data.domain_id;
            this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.id === data.data.domain_id);

            this.oauthClientsIdForm = data.data.oauth_clients_id;
            // if (this.activeSystemUserDomain.toLowerCase() == 'master' || this.activeOauthClientId == 1) {
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
    processFormRole: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            name		        : this.fieldForm.roleName.value,
            description     : this.fieldForm.description.value,
            role_permission : (this.checkboxRolePermission.length > 0) ? this.checkboxRolePermission : null
        }; 


        if (this.activeSystemUserDomain.toLowerCase() == 'master' || this.activeOauthClientId == 1) {
          data.domain_id = this.fieldForm.domain_id.tempValue = (typeof(this.fieldForm.domain_id.value) === 'undefined' || this.fieldForm.domain_id.value ==='') ? null : this.fieldForm.domain_id.value.id;        
        }

        if (this.fieldForm.id.value === null) {
          var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' || this.fieldForm.su_oauth_clients_id.value ==='') ? null : this.fieldForm.su_oauth_clients_id.value.id;
          
          if (this.activeOauthClientId == 1 || this.activeSystemUserId == 2) {
            data.su_oauth_clients_id = su_oauth_clients_id;
          }

          baseCallApiHelper.callApi(
            "Create role",
            null,
            api.role.create.method,
            api.role.create.url, 
            data, 
            (status, data, message) => {
              if(status) {

                this.$route.params.id = this.fieldForm.id.value = data.data.id
                this.processGetRoleDetail();

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
            "Update role",
            null,
            api.role.update.method,
            api.role.update.url,  
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
    optionsDomain ({ id, code }) {
      return `${id} : ${code}`
    },                   
    processGetListDomain: function () {

      if (this.activeOauthClientId != 1) {
        this.fieldForm.domain_id.validationRules = ['required', 'min.3', 'max.2000'];
      }
      
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
        true, 
        true,
        true
      );
      
      this.showDomain = true;

    },

    processGetTemplatePermission: function () {
      const data = {
      };

      baseCallApiHelper.callApi(
        "Get template permission",
        null,
        api.role.templatePermission.method,
        api.role.templatePermission.url, 
        data, 
        (status, data, message) => {
          if(status) {
            var i = 0;
            var col = 1;
            for (let key in data.data) {
              if(col === 1) {
                this.templatePermission[i] = [];
                this.templatePermission[i].push(data.data[key]);
                col++;

              } else {
                this.templatePermission[i].push(data.data[key]);
                if(col === 3) {
                  i++;
                  col = 1;
                } else {
                  col++;
                }
              }
            }
            this.rendertemplatePermission = true;
          } else {
          }
        }, 
        true, 
        true,
        true
      );
    }
    
  }
}

</script>
