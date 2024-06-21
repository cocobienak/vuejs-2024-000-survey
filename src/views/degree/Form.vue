<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormDegree"
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
                @click="globalFunctions.reloadAddNew($router, 'degree/add')"
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
          <CRow>
            <CCol sm="6">
                <CInput
                name="title"
                v-model="fieldForm.title.value"
                placeholder="Short Title Degree ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'title')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'title')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'title')"                
                label="Short Title Degree"
                />
            </CCol>
            <CCol sm="6">
              <CTextarea
                name="description"
                v-model="fieldForm.description.value"
                placeholder="Description ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'description')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'description')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'description')"
                label="Description"
                />
            </CCol>
            <CCol sm="6">

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
import router from '../../router';

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'DegreeForm',
  components: {     
    Multiselect
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
        title : {
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
      this.processGetDegreeDetail();
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
    processGetDegreeDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get degree detail",
        null,
        api.degree.read.method,
        api.degree.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value = data.data.id;
            this.fieldForm.title.value = data.data.title;
            this.fieldForm.description.value = data.data.description;

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
    processFormDegree: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        
        const data = {
            description  : this.fieldForm.description.value,
            title     : this.fieldForm.title.value,
        }; 

        if (this.fieldForm.id.value === null) {

          var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' || this.fieldForm.su_oauth_clients_id.value ==='') ? null : this.fieldForm.su_oauth_clients_id.value.id;
          
          if (this.activeOauthClientId == 1) {
            data.su_oauth_clients_id = su_oauth_clients_id;
          }

          baseCallApiHelper.callApi(
            "Create degree",
            null,
            api.degree.create.method,
            api.degree.create.url, 
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
            "Update degree",
            null,
            api.degree.update.method,
            api.degree.update.url,  
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
  }
}

</script>
