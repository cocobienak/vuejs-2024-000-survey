<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormDomainGroup"
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
                @click="globalFunctions.reloadAddNew($router, 'domain-group/add')"
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
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'su_oauth_clients_id');processGetListDomain();"
                  label="name" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.su_oauth_clients_id.isValid === null) ? false : !fieldForm.su_oauth_clients_id.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'su_oauth_clients_id')}}
                  </label>
              </div>
            </CCol>
          </CRow>          
          <CRow v-if="showFormInput">
            <CCol sm="6">
             <div>
              <label>Domain Parent</label>
              <multiselect 
                v-model="fieldForm.domain_id.value" 
                :options="fieldForm.domain_id.options" 
                :custom-label="optionsDomain" 
                deselect-label="Can't remove this value"
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
            <CCol sm="6">
             <div>
              <label>Domain Child</label>
              <multiselect 
                v-model="fieldForm.domain_child_id.value" 
                :options="fieldForm.domain_child_id.options" 
                :custom-label="optionsDomain" 
                :multiple="true"
                :allow-empty="true"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'domain_child_id')"
                label="code" track-by="code">
              </multiselect>
              <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                v-show="(fieldForm.domain_child_id.isValid === null) ? false : !fieldForm.domain_child_id.isValid">
                  {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'domain_child_id')}}
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

import moment from "moment";
import { api } from '../../configurations/services';
import Multiselect from 'vue-multiselect';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'DomainGroupForm',
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
      oauthClientsIdForm : null,
      fieldForm: {
        id : {
          value : null,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null          
        },
        domain_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required'],
          isValid : null          
        },
        domain_child_id : {
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
      showFormInput : false

    }
  },
  created () {
    if (this.$route.params.id) {
      this.processGetDomainGroupDetail();
      this.showFormInput = true;
    } else {
            // if super admin
      if (this.activeOauthClientId == 1) {
        this.fieldForm.su_oauth_clients_id.validationRules = ['required', 'min.3', 'max.2000'];
        this.processGetOauthClientsList();
      } else {
        this.showFormInput = true;
        this.processGetListDomain();
      }
      
    }
  },
  mounted() {
  },
  methods: {
    processGetDomainGroupDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get domain group detail",
        null,
        api.domain_group.read.method,
        api.domain_group.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value  = data.data.id;

            this.fieldForm.domain_id.tempValue = data.data.domain_id;
            this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.id === data.data.domain_id);

            this.fieldForm.domain_child_id.value = this.fieldForm.domain_child_id.tempValue = data.data.domain_child_id;

            try {
              this.fieldForm.domain_child_id.tempValue = JSON.parse(data.data.domain_child_id);
              var domainChildIdVal = [];
              var domainChildIdOpt = this.fieldForm.domain_child_id.options;            
              this.fieldForm.domain_child_id.tempValue.forEach(function(item) {
                domainChildIdVal.push(domainChildIdOpt.find(element => element.id === item.id));
              });
              this.fieldForm.domain_child_id.value = domainChildIdVal;
            } catch (e) {
              this.fieldForm.domain_child_id.value = [];
            }

            this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"];

            this.oauthClientsIdForm = data.data.oauth_clients_id;
            this.processGetListDomain();

          } else {
          }
        }, 
        true, 
        true,
        true
      );
    },   
    processFormDomainGroup: function (e) {

        var domainChildIdVal = [];
        if (typeof(this.fieldForm.domain_child_id.value) !== 'undefined' && this.fieldForm.domain_child_id.value !== '') { 
          this.fieldForm.domain_child_id.value.forEach(function(item) {
            var temp = {
              id : item.id,
              code : item.code
            }
            domainChildIdVal.push(temp);
          });
        }

      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            domain_id  : (typeof(this.fieldForm.domain_id.value) === 'undefined' || this.fieldForm.domain_id.value ==='') ? null : this.fieldForm.domain_id.value.id,
            domain_child_id     : domainChildIdVal
        }; 


        if (this.fieldForm.id.value === null) {

          if (this.activeOauthClientId == 1) {
            data.su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' || this.fieldForm.su_oauth_clients_id.value ==='') ? null : this.fieldForm.su_oauth_clients_id.value.id;
          }
          
          baseCallApiHelper.callApi(
            "Create domain group",
            null,
            api.domain_group.create.method,
            api.domain_group.create.url, 
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
            "Update domain group",
            null,
            api.domain_group.update.method,
            api.domain_group.update.url,  
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
      var data = {
          "filter" : "code <> 'master'"
        };
      if (!this.$route.params.id && this.activeOauthClientId == 1) {
        data = {
          "filter" : "code <> 'master' AND oauth_clients_id = " + this.fieldForm.su_oauth_clients_id.value.id
        };
      } else if (this.$route.params.id) {
        data = {
          "filter" : "code <> 'master' AND oauth_clients_id = " + this.oauthClientsIdForm
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

            var domainChildIdOpt = this.fieldForm.domain_child_id.options =  data.data;
            if (this.fieldForm.domain_child_id.tempValue !== "") {
              var domainChildIdVal = [];            
              this.fieldForm.domain_child_id.tempValue.forEach(function(item) {
                domainChildIdVal.push(domainChildIdOpt.find(element => element.id === item.id));
              });
              this.fieldForm.domain_child_id.value = domainChildIdVal;
            }
          }
        }, 
        true, 
        true,
        true
      );
      
      this.showFormInput = true;

    },             
  }
}

</script>
