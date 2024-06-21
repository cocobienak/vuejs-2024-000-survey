<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormConfiguration"
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
                @click="globalFunctions.reloadAddNew($router, 'configuration/add')"
              >
              Add new
            </CButton>
          </div>
          <hr/>
          <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
            <CCol sm="12">
                <label class="text-info">Created by : {{createdBy}} ,  {{ moment(createdOn).format('LLL') }}</label>
                <label class="text-info" style="float:right;">Modified by : {{modifiedBy}} , {{ moment(modifiedOn).format('LLL') }}</label>

            </CCol>
            <hr/>
          </CRow>           <CRow>
            <CCol sm="6">
              <CInput
                name="key"
                v-model="fieldForm.key.value"
                placeholder="Key Name must be unique..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'key')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'key')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'key')"
                label="Key Name"
                :readonly="fieldForm.key.readOnly"
              />
            </CCol>
            <CCol sm="6">
              <CSelect
                name="type_data"
                :value.sync="fieldForm.type_data.value"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'type_data')"
                @change="changeTypeData($event)"                
                label="Type Data"
                :options="fieldForm.type_data.options"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6">
              <template v-if="fieldForm.type_data.value === 'boolean'">
                <label>Value</label><br>
                <label class="c-switch form-check-label c-switch-success">
                  <input type="checkbox" class="c-switch-input form-check-input"                           
                    v-model="fieldForm.value.value"
                  >
                  <span class="c-switch-slider"></span>
                </label>
              </template>
              <CInput v-else-if="Array.from(['integer', 'bigint', 'floating', 'double']).includes(fieldForm.type_data.value)"
                name="value"
                v-model="fieldForm.value.value"
                placeholder="Value ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'value')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'value')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'value')"
                label="Value"
              />
              <div role="group" class="form-group" v-else-if="Array.from(['date', 'datetime', 'time']).includes(fieldForm.type_data.value)">              
                <label>Value</label>              
                <VueCtkDateTimePicker 
                  v-model="fieldForm.value.value"
                  :format="('datetime' === this.fieldForm.type_data.value) ? 'YYYY-MM-DD HH:mm:ss' : ('date' === this.fieldForm.type_data.value) ? 'YYYY-MM-DD' : 'HH:mm'"
                  :formatted="('datetime' === this.fieldForm.type_data.value) ? 'ddd, YYYY MMM DD, HH:mm' : ('date' === this.fieldForm.type_data.value) ? 'YYYY MMM DD' : 'HH:mm'"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'value')"
                  :no-value-to-custom-elem="false"
                  :onlyDate="(fieldForm.type_data.value === 'date') ? true : false"
                  :onlyTime ="(fieldForm.type_data.value === 'time') ? true : false"                  
                >  
                </VueCtkDateTimePicker>   
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldForm.value.isValid === null) ? false : !fieldForm.value.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'value')}}
                </label>   
              </div>                              
              <CTextarea v-else
                name="value"
                v-model="fieldForm.value.value"
                placeholder="Value ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'value')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'value')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'value')"
                label="Value"
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
          </CRow>              
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<style src="vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"></style>

<script>
import store from '../../store';

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'ConfigurationForm',
  components: { 
    VueCtkDateTimePicker,
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
        key : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.200'],
          isValid : null,
          readOnly : false          
        },         
        type_data : {
          value : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null,
          options : []                  
        },
        value : {
          value : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.65535'],
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
    this.processGetTypeDataList();
    if (this.$route.params.id) {
      this.processGetConfigurationDetail();
      this.fieldForm.key.readOnly = true;
    }
  },
  mounted() {
  },
  methods: {
    processGetConfigurationDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get configuration detail",
        null,
        api.configuration.read.method,
        api.configuration.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value = data.data.id;
            this.fieldForm.key.value = data.data.key;
            this.fieldForm.type_data.tempValue = this.fieldForm.type_data.value = data.data.type_data;
            
            this.fieldForm.value.tempValue = this.fieldForm.value.value = (data.data.type_data == "boolean") ? parseInt(data.data.value) : data.data.value;
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
    processFormConfiguration: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            key  : this.fieldForm.key.value,
            type_data     : this.fieldForm.type_data.value,
            value     : this.fieldForm.value.value,
            description  : this.fieldForm.description.value,
        }; 

        if (this.fieldForm.id.value === null) {
          baseCallApiHelper.callApi(
            "Create configuration",
            null,
            api.configuration.create.method,
            api.configuration.create.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldForm.value.tempValue = this.fieldForm.id.value = data.data.id
                this.fieldForm.key.readOnly = true;
                this.fieldForm.type_data.tempValue = this.fieldForm.type_data.value;

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
            "Update configuration",
            null,
            api.configuration.update.method,
            api.configuration.update.url,  
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


    changeTypeData: function(event) {

      if (event.target.value === this.fieldForm.type_data.tempValue) {
        this.fieldForm.value.value = this.fieldForm.value.tempValue;
      } else {
        this.fieldForm.value.value = "";
      }
    },
    processGetTypeDataList: function () {
        const data = {
          select : ["id", "key", "type_data", "value"],
          filter : "key = 'type_data_list'",
          order_by : "key"
        };
      baseCallApiHelper.callApi(
        "Get type data list",
        null,
        api.configuration.list.method,
        api.configuration.list.url, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.type_data.options = globalFunctions.configurationTypeData(data.data[0].type_data, data.data[0].value);
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
