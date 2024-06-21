<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormVisitor"
          autocomplete="off"
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
                @click="globalFunctions.reloadAddNew($router, 'visitor/add')"
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
          <CRow>
            <CCol sm="6" style="display:table-cell;vertical-align: middle;text-align:left;">           
              <div style="display:block; vertical-align: middle; text-align: left; width:500px">

                <div>
                  <span style="background: #e2e2e2; vertical-align: middle; text-align: center; display:table-cell; width: 600px; height: 300px; border: 2px solid rgb(216, 216, 216); border-radius: 6px;">                
                    <img 
                      style="margin: 0 auto;display: block;height: auto;width: auto;max-width:590px;max-height:290px;"
                      :src="fieldForm.avatar_path.value" 
                    />  
                  </span>
                </div>
              </div>
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
            <CCol sm="6">
              <CSelect
                name="gender"
                :value.sync="fieldForm.gender.value"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'gender')"                
                label="Gender"
                :options="['male', 'female']"
              />
            </CCol>
            <CCol sm="6">
              <div>
                <label>Birth Date</label>              
                <datepicker 
                  name="birth_date"
                  input-class="form-control"
                  v-model="fieldForm.birth_date.value"
                  placeholder="Date ..."
                  :format="globalFunctions.formatDatePickerShow"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'birth_date')"

                >              
                </datepicker>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.birth_date.isValid === null) ? false : !fieldForm.birth_date.isValid">
                  {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'birth_date')}}
                </label>                  
              </div>
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
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import store from '../../store';

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'VisitorForm',
  components: {
    Multiselect,
  	Datepicker 
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
        gender : {
          value : "male",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        birth_date : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        is_active : {
          value : "",
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
    if (this.$route.params.id) {
      this.processGetVisitorDetail();
      this.fieldForm.password.validationRules = ['max.20', 'pattern.password', 'same.password_confirmation'];
      this.fieldForm.password_confirmation.validationRules = ['max.20', 'pattern.password', 'same.password'];
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
    processGetVisitorDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get visitor detail",
        null,
        api.visitor.read.method,
        api.visitor.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value = data.data.id;
            this.fieldForm.name.value = data.data.name;
            this.fieldForm.email.value = data.data.email;
            this.fieldForm.phone_number.value = data.data.phone_number;
            this.fieldForm.gender.value = data.data.gender;
            this.fieldForm.birth_date.value = data.data.birth_date;
            this.fieldForm.avatar_path.value = data.data.avatar_path;

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
    processFormVisitor: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            name                  : this.fieldForm.name.value,
            email                 : this.fieldForm.email.value,
            phone_number          : this.fieldForm.phone_number.value,
            gender                : this.fieldForm.gender.value,
            birth_date            : (this.fieldForm.birth_date.value !== "" && this.fieldForm.birth_date.value !== null) 
                                      ? globalFunctions.formatDatePickerInput(this.fieldForm.birth_date.value) : null,
            is_me                 : true
        }; 

        if (this.fieldForm.id.value === null) {

          var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' || this.fieldForm.su_oauth_clients_id.value ==='') ? null : this.fieldForm.su_oauth_clients_id.value.id;
          
          if (this.activeOauthClientId == 1) {
            data.su_oauth_clients_id = su_oauth_clients_id;
          }

          data.password = globalFunctions.encryptOurBoard(this.fieldForm.password.value);
          data.password_confirmation = globalFunctions.encryptOurBoard(this.fieldForm.password_confirmation.value);          
          baseCallApiHelper.callApi(
            "Create visitor",
            null,
            api.visitor.create.method,
            api.visitor.create.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldForm.id.value = data.data.id
                this.fieldForm.password.value = "";
                this.fieldForm.password_confirmation.value = ""; 
                this.fieldForm.password.validationRules = ['max.20', 'pattern.password', 'same.password_confirmation'];
                this.fieldForm.password_confirmation.validationRules = ['max.20', 'pattern.password', 'same.password']; 

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
          if (this.fieldForm.password.value !== "") {
            data.password = globalFunctions.encryptOurBoard(this.fieldForm.password.value);
            data.password_confirmation = globalFunctions.encryptOurBoard(this.fieldForm.password_confirmation.value);
          }
          data.id = this.fieldForm.id.value;
          baseCallApiHelper.callApi(
            "Update visitor",
            null,
            api.visitor.update.method,
            api.visitor.update.url,  
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
    }


  }
}

</script>
