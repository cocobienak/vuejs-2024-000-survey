<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm>
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
                name="domain_code"
                v-model="fieldForm.domain_code.value"
                placeholder="Code domain ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'domain_code')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'domain_code')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'domain_code')"                
                label="Domain"
              />
            </CCol>
            <CCol sm="6">
              <CInput
                name="event_name"
                v-model="fieldForm.event_name.value"
                placeholder="Code domain ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'event_name')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'event_name')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'event_name')"                
                label="Event"
              />
            </CCol>
          </CRow> 
          <CRow>
            <CCol sm="6">
              <CInput
                name="visitor_email"
                v-model="fieldForm.visitor_email.value"
                placeholder="Visitor User ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'visitor_email')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'visitor_email')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'visitor_email')"                
                label="Visitor User"
              />
            </CCol>
            <CCol sm="6">
              <CInput
                name="from"
                v-model="fieldForm.from.value"
                placeholder="..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'from')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'from')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'from')"                
                label="From"
              />
            </CCol>
          </CRow>                          
          <CRow>
            <CCol sm="12">
              <CInput
                name="subject"
                v-model="fieldForm.subject.value"
                placeholder="Visitor User ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'subject')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'subject')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'subject')"                
                label="Subject"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="12">
              <CTextarea 
                v-if="!fieldForm.message.showHTML"
                rows="10"
                name="Message"
                v-model="fieldForm.message.value"
                placeholder="Message ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'message')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'message')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'message')"
              /> 
            </CCol>
          </CRow>

          <CRow>
            <CCol sm="12">
              <CTextarea 
                rows="10"
                name="log"
                v-model="fieldForm.sent_email_data.value"
                placeholder="Log ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'sent_email_data')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'sent_email_data')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'sent_email_data')"
                label="LOG"
              /> 
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
  name: 'DomainMessageForm',
  components: {
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
        domain_code : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null          
        },
        event_name : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null         
        },        
        visitor_email : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null         
        },
        from : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null         
        },
        subject : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null         
        },  
        message : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null         
        },               
        sent_email_data : {
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
      this.processGetDomainMessageDetail();
    }
  },
  mounted() {
  },
  methods: {
    processGetDomainMessageDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get domain group detail",
        null,
        api.domain_message.read.method,
        api.domain_message.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.id.value  = data.data.id;

            this.fieldForm.domain_code.value = data.data["domain_id.code"];
            this.fieldForm.event_name.value = data.data["event_id.name"];
            this.fieldForm.visitor_email.value = data.data["visitor_id.email"];

            this.fieldForm.message.value = data.data.message;

            this.fieldForm.subject.value = data.data.subject;
            this.fieldForm.message.from = data.data.from;
            this.fieldForm.sent_email_data.value = data.data.sent_email_data;

            this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"];

            this.oauthClientsIdForm = data.data.oauth_clients_id;

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
