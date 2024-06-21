<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormSystemUser"
          autocomplete="off"
        >
          <CButton type="submit" color="success" square size="sm"
          >
            Save
          </CButton>
          <div style="float:right" v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '' && !$route.path.includes('/edit-self/'))">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="globalFunctions.reloadAddNew($router, 'system-user/add')"
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
          <CRow v-if="((activeOauthClientId == 1) && (fieldForm.id.value != null && fieldForm.id.value != ''))">
            <CCol sm="12">
              <hr/>

              <CButton
                color="primary"
                square
                size="sm"
                @click="generateToken()"
              >
                Generate Token
              </CButton>              
              <CTextarea
                name="token"
                v-model="tokenResult"
                placeholder="..."
                label="Token Result"
                />
              Expired Token : {{tokenExpired}}
            </CCol>
          </CRow>                    
          <CRow>
            <CCol sm="6">
                <CInput
                name="name"
                v-model="fieldForm.name.value"
                placeholder="Full Name ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'name')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'name')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'name')"                
                label="Full Name"
                />
            </CCol>
            <CCol sm="6">
              <label>Status</label><br>
              <label class="c-switch form-check-label c-switch-success">
                <input type="checkbox" class="c-switch-input form-check-input"                           
                  v-model="fieldForm.is_active.value">
                <span class="c-switch-slider"></span>
              </label> 
            </CCol>            
          </CRow>          
          <CRow>
            <CCol sm="6">
                <CInput
                name="email"
                v-model="fieldForm.email.value"
                placeholder="Email ..."
                autocomplete="new-password"
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
                autocomplete="new-password"
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'phone_number')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'phone_number')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'phone_number')"                
                label="Phone Number"
                />
            </CCol>            
          </CRow>
          <CRow>
            <CCol sm="6" >
                <CInput v-if="((activeOauthClientId == 1 || activeSystemUserDomain.toLowerCase() == 'master')  && (fieldForm.id.value === null || fieldForm.id.value === ''))"
                name="username"
                v-model="fieldForm.username.value"
                placeholder="Username ..."
                autocomplete="new-password"
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'username')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'username')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'username'); checkValueInput();"                
                label="Username"
                />
              <div v-if="((fieldForm.id.value !== null && fieldForm.id.value !== ''))" ><label>Username</label> : <strong>{{fieldForm.username.value}}</strong></div>
              <div v-if="(activeOauthClientId == 1 || activeSystemUserDomain.toLowerCase() == 'master')">
                  <label class="text-info" v-if="(activeOauthClientId == 1)">
                    Username `visitor.***.user` (cth : visitor.website.user) digunakan pada saat membuat client baru.
                  </label>
              </div>                
            </CCol>            
          
          </CRow>          
          <CRow>
            <CCol sm="6">
              <CTextarea
                name="address_1"
                v-model="fieldForm.address_1.value"
                placeholder="Address ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'address_1')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'address_1')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'address_1')"
                label="Address-1"
                />
            </CCol>
            <CCol sm="6">
              <CTextarea
                name="address_2"
                v-model="fieldForm.address_2.value"
                placeholder="Address ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'address_2')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'address_2')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'address_2')"
                label="Address-2"
                />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6">
              <CInput
                name="password"
                v-model="fieldForm.password.value"
                placeholder="password"
                autocomplete="new-password"
                type="password"
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'password')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'password')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'password')"
                label="Password"
                />
            </CCol>
            <CCol sm="6">
              <CInput
                name="password_confirmation"
                v-model="fieldForm.password_confirmation.value"
                placeholder="Password Confirmation ..."
                type="password"
                autocomplete="new-password"
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'password_confirmation')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'password_confirmation')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'password_confirmation')"
                label="Password Confirmation"
                />
            </CCol>
          </CRow>                    
        </CForm>
        <CForm 
          @submit.prevent="processFormUpdateRole"
          v-if="renderFormUpdateRole"
        >
          <hr/>
          <CButton type="submit" color="success" square size="sm"
          >
            Save Role
          </CButton>
          <hr/>
          <CRow>
            <CCol sm="12">
            <div>
              <label>Role</label>
              <multiselect 
                v-model="fieldFormRole.role.value" 
                :options="fieldFormRole.role.options" 
                :custom-label="optionsLabelRole" 
                :multiple="true"
                deselect-label="Can't remove this value"
                placeholder="Select one"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormRole', 'role')"
                label="name" track-by="name">
              </multiselect>
              <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                v-show="(fieldFormRole.role.isValid === null) ? false : !fieldFormRole.role.isValid">
                  {{globalFunctions.getInvalidFeedback(this, 'fieldFormRole', 'role')}}
                </label>
            </div>
            </CCol>
          </CRow>                   
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import store from '../../store';
import Multiselect from 'vue-multiselect';

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'SystemUserForm',
  components: {
    Multiselect
   },
  data () {
    return {
      store,
      moment,
      globalFunctions,
      vm : this,
      renderFormUpdateRole : false,
      tokenResult : "", 
      tokenExpired : "",
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
      isSelfData : false,     
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
        email : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.50', 'pattern.email'],
          isValid : null        
        },
        phone_number : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.50', 'pattern.phonenumber'],
          isValid : null        
        },
        username : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },                  
        address_1 : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        address_2 : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        is_active : {
          value : 1,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        password : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.6', 'max.20', 'pattern.password', 'same.password_confirmation'],
          isValid : null        
        },
        password_confirmation : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.6', 'max.20', 'pattern.password', 'same.password'],
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
      fieldFormRole : {
        role : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required'],
          isValid : null        
        }
      }
    }
  },
  created () {
    if (this.$route.params.id) {
      this.renderFormUpdateRole = true;
      this.processGetSystemUserDetail();
      this.fieldForm.password.validationRules = ['max.20', 'pattern.password', 'same.password_confirmation'];
      this.fieldForm.password_confirmation.validationRules = ['max.20', 'pattern.password', 'same.password'];
    } else {
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
    processGetSystemUserDetail: function () {
      var URL = api.system_user.read.url;
      var METHOD = api.system_user.read.method;
      if (this.$router.currentRoute.name == 'System-User-Form-edit-self') {
        URL = api.system_user.readSelf.url;
        METHOD = api.system_user.readSelf.method;
      }


      const data = {
      };
      baseCallApiHelper.callApi(
        "Get system user detail",
        null,
        METHOD,
        URL + '/' + this.$route.params.id,   
        data, 
        (status, data, message) => {
          if(status) {
            this.renderFormUpdateRole = true;

            this.fieldForm.id.value = data.data.id;
            this.fieldForm.name.value = data.data.name;
            this.fieldForm.email.value = data.data.email;
            this.fieldForm.phone_number.value = data.data.phone_number;
            this.fieldForm.address_1.value = data.data.address_1;
            this.fieldForm.address_2.value = data.data.address_2;
            this.fieldForm.is_active.value = data.data.is_active;

            this.fieldForm.username.value = data.data.username;
            this.fieldFormRole.role.tempValue = data.system_user_role;

            this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"];

            this.fieldForm.domain_id.tempValue = data.data.domain_id;
            this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.id === data.data.domain_id);

            this.oauthClientsIdForm = data.data.oauth_clients_id;
            // if (this.activeSystemUserDomain.toLowerCase() == 'master' || this.activeOauthClientId == 1) {
            if (this.activeOauthClientId == 1) {
              this.processGetListDomain();
            }

            this.processGetRole();

            var valueSystemUserRole = [];
            var optionsSystemUserRole = this.fieldFormRole.role.options;
            data.system_user_role.forEach(function(item) {
              valueSystemUserRole.push(optionsSystemUserRole.find(element => element.id === item.role_id));
            });
            this.fieldFormRole.role.value = valueSystemUserRole;

          } else {
          }
        }, 
        true, 
        true,
        true
      );
    },
    processFormSystemUser: function (e) {
      var pattern = new RegExp("^visitor\..*\.user");
      if(pattern.test(this.fieldForm.username.value)) {
        this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.code === 'master');
        this.fieldForm.domain_id.validationRules = [];                                
      }

      var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' || this.fieldForm.su_oauth_clients_id.value ==='') ? null : this.fieldForm.su_oauth_clients_id.value.id;

      if (this.activeOauthClientId == 1 && su_oauth_clients_id === 1) {
        this.fieldForm.domain_id.validationRules = [];
      }

      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            name                  : this.fieldForm.name.value,
            email                 : this.fieldForm.email.value,
            phone_number          : this.fieldForm.phone_number.value,
            address_1             : this.fieldForm.address_1.value,
            address_2             : this.fieldForm.address_2.value,
            is_active             : this.fieldForm.is_active.value,
            is_me                 : true,
            username              :this.fieldForm.username.value
        }; 


        if (this.activeSystemUserDomain.toLowerCase() == 'master' || this.activeOauthClientId == 1) {
          data.domain_id = this.fieldForm.domain_id.tempValue = (typeof(this.fieldForm.domain_id.value) === 'undefined' || this.fieldForm.domain_id.value ==='') ? null : this.fieldForm.domain_id.value.id;        
        }

        if (this.fieldForm.id.value === null) {

          var allowForSuAdmin = true;


          if (this.activeOauthClientId == 1) {
            if(su_oauth_clients_id == null) {
              allowForSuAdmin = false;
            } else {
              data.su_oauth_clients_id = su_oauth_clients_id;
            }
          }


          if(allowForSuAdmin){
            data.password = globalFunctions.encryptOurBoard(this.fieldForm.password.value);
            data.password_confirmation = globalFunctions.encryptOurBoard(this.fieldForm.password_confirmation.value);          
            baseCallApiHelper.callApi(
              "Create system user",
              null,
              api.system_user.create.method,
              api.system_user.create.url, 
              data, 
              (status, data, message) => {
                if(status) {
                  this.fieldForm.id.value = data.data.id;
                  this.fieldForm.password.value = "";
                  this.fieldForm.password_confirmation.value = ""; 
                  this.fieldForm.password.validationRules = ['max.20', 'pattern.password', 'same.password_confirmation'];
                  this.fieldForm.password_confirmation.validationRules = ['max.20', 'pattern.password', 'same.password']; 

                  this.createdBy = this.activeSystemUserName;
                  this.createdOn = data.data["created_on"];
                  this.modifiedBy = this.activeSystemUserName;
                  this.modifiedOn = data.data["modified_on"];

                  this.oauthClientsIdForm = su_oauth_clients_id;

                  this.$route.params.id = data.data.id;

                  this.processGetRole();
                  this.processGetSystemUserDetail();
                  this.renderFormUpdateRole = true;    

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
          if (this.fieldForm.password.value !== "") {
            data.password = globalFunctions.encryptOurBoard(this.fieldForm.password.value);
            data.password_confirmation = globalFunctions.encryptOurBoard(this.fieldForm.password_confirmation.value);
          }

          var URL = api.system_user.update.url;
          var METHOD = api.system_user.update.method;
          data.id = this.fieldForm.id.value;
          if (this.$router.currentRoute.name == 'System-User-Form-edit-self') {
            URL = api.system_user.updateSelf.url;
            METHOD = api.system_user.updateSelf.method;
          }

          baseCallApiHelper.callApi(
            "Update system user",
            null,
            METHOD,
            URL,  
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldForm.password.value = "";
                this.fieldForm.password_confirmation.value = ""; 

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
        true, 
        true,
        true
      );
      
      this.showDomain = true;

    },

    checkValueInput: function() {
      var pattern = new RegExp("^visitor\..*\.user");
      if(pattern.test(this.fieldForm.username.value) && this.activeOauthClientId == 1) {
        this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.code === 'master');
        this.fieldForm.domain_id.validationRules = [];                                
      }
    },
    generateToken: function() {
      if(this.fieldForm.id.value != "" && this.fieldForm.id.value != null) {
        const data = {}; 
        baseCallApiHelper.callApi(
          "Generate token",
          null,
          api.permission.generateToken.method,
          api.permission.generateToken.url + '/' + this.fieldForm.id.value,   
          data, 
          (status, data, message) => {
            if(status) {
              this.tokenResult = 'Bearer ' + data.access_token;
              this.tokenExpired =  moment().add(data.access_token_expire_in, 's').format('YYYY-MM-DD HH:mm:ss');
            } 
          }, 
          true, 
          true,
          true
        );  
      }
    },

    optionsLabelRole ({ name, description }) {
      description = (description === null) ? '-' : description;
      return `${name} : ${description}`
    },    
    processGetRole: function () {
      var filter = "";

      if (this.oauthClientsIdForm != "" && this.oauthClientsIdForm != 0) {
        filter = "oauth_clients_id = " + this.oauthClientsIdForm;
        var pattern = new RegExp("^visitor\..*\.user");
        if(pattern.test(this.fieldForm.username.value)) {
          filter = "id = 3 ";
        }
      }

      const data = {
        select : ["id", "name", "description"],
        // filter : "id <> 2",
        filter : filter,
        order_by : "name asc" // always include 'created_on desc' for grab the new data from database
      };
      baseCallApiHelper.callApi(
        "Get Role",
        {"Privilege": "updatesystemuserrole"},
        api.role.list.method,
        api.role.list.url, 
        data, 
        (status, data, message) => {
          this.fieldFormRole.role.options = data.data;

          if (this.fieldFormRole.role.tempValue !== "") {
            var valueSystemUserRole = [];
            var optionsSystemUserRole = this.fieldFormRole.role.options;
            this.fieldFormRole.role.tempValue.forEach(function(item) {
              valueSystemUserRole.push(optionsSystemUserRole.find(element => element.id === item.role_id));
            });
            this.fieldFormRole.role.value = valueSystemUserRole; 
          }
         
        }, 
        true, 
        true,
        true
      );
    },     
    processFormUpdateRole: function (e) {
      if (globalFunctions.validationForm(this, 'fieldFormRole')) {     
        if (this.oauthClientsIdForm !== 1 && typeof(this.fieldFormRole.role.value.find(element => element.id === 1)) !== 'undefined') {
          alert('This user cannot be set as Super Administrator');
        } else {
          const data = {
            system_user_id    : this.fieldForm.id.value,
            system_user_role  : this.fieldFormRole.role.value
          }; 
          baseCallApiHelper.callApi(
            "Update system user role",
            null,
            api.system_user.updateRole.method,
            api.system_user.updateRole.url,  
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


       
      }      
    }

    
  }
}

</script>
