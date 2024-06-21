<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormModule"
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
                @click="globalFunctions.reloadAddNew($router, 'module/add')"
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
            <CCol sm="6">
              <CInput
                name="moduleId"
                v-model="fieldForm.moduleId.value"
                placeholder="Module ID must be unique..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'moduleId')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'moduleId')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'moduleId')"
                label="Module ID"
                :readonly="fieldForm.moduleId.readOnly"
                />
            </CCol>
            <CCol sm="6">
                <CInput
                name="code"
                v-model="fieldForm.code.value"
                placeholder="Code module ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'code')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'code')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'code')"                
                label="Code"
                />
            </CCol>
          </CRow>
          <CRow>
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

<script>
import store from '../../store';

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'ModuleForm',
  components: { },
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
        moduleId : {
          value : null,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'pattern.number'],
          isValid : null,
          readOnly : false          
        },
        code : {
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
      }

    }
  },
  created () {
    if (this.$route.params.id) {
      this.processGetModuleDetail();
      this.fieldForm.moduleId.readOnly = true;
    }
  },
  mounted() {
  },
  methods: {
    processGetModuleDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get module detail",
        null,
        api.module.read.method,
        api.module.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value = this.fieldForm.moduleId.value = data.data.id;
            this.fieldForm.code.value = data.data.code;
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
    processFormModule: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            description  : this.fieldForm.description.value,
            code     : this.fieldForm.code.value
        }; 


        if (this.fieldForm.id.value === null) {
          data.id = this.fieldForm.moduleId.value;
          baseCallApiHelper.callApi(
            "Create module",
            null,
            api.module.create.method,
            api.module.create.url, 
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
            "Update module",
            null,
            api.module.update.method,
            api.module.update.url,  
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

    }     
  }
}

</script>
