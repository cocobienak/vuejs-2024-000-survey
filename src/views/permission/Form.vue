<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormPermission"
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
                @click="globalFunctions.reloadAddNew($router, 'permission/add')"
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
                name="permissionId"
                v-model="fieldForm.permissionId.value"
                placeholder="Permission ID must be unique..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'permissionId')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'permissionId')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'permissionId')"
                label="Permission ID"
                :readonly="fieldForm.permissionId.readOnly"
                />
            </CCol>
            <CCol sm="6">
                <CInput
                name="privilege"
                v-model="fieldForm.privilege.value"
                placeholder="Privilege must confirm with backend developer..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm','privilege')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'privilege')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'privilege')"                
                label="Privilege"
                />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6">
                <CInput
                name="label"
                v-model="fieldForm.label.value"
                placeholder="Label permission ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'label')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'label')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'label')"                
                label="Label"
                />
            </CCol>
            <CCol sm="6">
              <CTextarea
                name="endpoint"
                v-model="fieldForm.endpoint.value"
                placeholder="get:/api/permission/read/[p]|post:/api/permission/list"
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'endpoint')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'endpoint')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'endpoint')"
                label="End Point"
                />
                <label class="text-info">(method)(:)(path_api)(/)(symbol parameter => [p])(separate => |) 
                  example => get:/api/permission/read/[p]|post:/api/permission/list</label>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6">
            <div>
              <label>Module</label>
              <multiselect 
                v-model="fieldForm.module_id.value" 
                :options="fieldForm.module_id.options" 
                :custom-label="optionsLabelModule" 
                deselect-label="Can't remove this value"
                placeholder="Select one"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'module_id')"
                label="code" track-by="code">
              </multiselect>
              <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                v-show="(fieldForm.module_id.isValid === null) ? false : !fieldForm.module_id.isValid">
                  {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'module_id')}}
                </label>
            </div>
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
  name: 'PermissionForm',
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
      fieldForm: {
        id : {
          value : null,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null          
        },
        permissionId : {
          value : null,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'pattern.number'],
          isValid : null,
          readOnly : false          
        },
        privilege : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.100'],
          isValid : null
        },
        endpoint : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.1', 'max.65535'],
          isValid : null        
        },
        label : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.100'],
          isValid : null        
        },
        module_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required'],
          isValid : null        
        },
        is_active : {
          value : 0,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        }

      }

    }
  },
  created () {
    this.processGetModule()
    if (this.$route.params.id) {
      this.processGetPermissionDetail();
      this.fieldForm.permissionId.readOnly = true;
    }
  },
  mounted() {
  },
  methods: {
    processGetPermissionDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get permission detail",
        null,
        api.permission.read.method,
        api.permission.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value = this.fieldForm.permissionId.value = data.data.id;
            this.fieldForm.privilege.value = data.data.privilege;
            this.fieldForm.endpoint.value = data.data.endpoint;
            this.fieldForm.label.value = data.data.label;
            this.fieldForm.module_id.tempValue = data.data.module_id;
            this.fieldForm.module_id.value = this.fieldForm.module_id.options.find(element => element.id === data.data.module_id);
            this.fieldForm.is_active.value = data.data.is_active;

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
    processFormPermission: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            privilege : this.fieldForm.privilege.value,
            endpoint  : this.fieldForm.endpoint.value,
            label     : this.fieldForm.label.value,
            module_id : this.fieldForm.module_id.value.id,
            is_active : this.fieldForm.is_active.value

        }; 


        if (this.fieldForm.id.value === null) {
          data.id = this.fieldForm.permissionId.value;
          baseCallApiHelper.callApi(
            "Create permission",
            null,
            api.permission.create.method,
            api.permission.create.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldForm.id.value = this.fieldForm.permissionId.value;
                this.fieldForm.permissionId.readOnly = true;

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
            "Update permission",
            null,
            api.permission.update.method,
            api.permission.update.url,  
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
    optionsLabelModule ({ code, description }) {
      description = (description === null) ? '-' : description;
      return `${code} : ${description}`
    },
    processGetModule: function () {
        const data = {
          select : ["id", "code", "description"],
          filter : "",
          order_by : "code asc" // always include 'created_on desc' for grab the new data from database
        };
      baseCallApiHelper.callApi(
        "Get Module",
        null,
        api.module.list.method,
        api.module.list.url, 
        data, 
        (status, data, message) => {
          this.fieldForm.module_id.options =  data.data;

          if (this.fieldForm.module_id.tempValue !== "") {
            var tempValue = this.fieldForm.module_id.tempValue;
            this.fieldForm.module_id.value = this.fieldForm.module_id.options.find(element => element.id === tempValue);
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
