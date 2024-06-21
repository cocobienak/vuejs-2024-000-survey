<template>
  <div class="c-app body-login flex-row align-items-center">
    <div 
      v-if="$store.getters.isloading"
      style="position:absolute;width:100%;height:100%;background-color: rgba(48, 48, 48, 0.9);z-index:10001;"
    >
      <CSpinner
        color="success"
        style="width:4rem;height:4rem;position:absolute;top:50%;left:47%;z-index:10002;"
        grow
      /> 
      <CSpinner
        color="warning"
        style="width:7rem;height:7rem;position:absolute;top:50%;left:50%;z-index:10002;"
      />
      <CSpinner
        color="info"
        style="width:7rem;height:7rem;position:absolute;top:50%;left:50%;z-index:10002;"
        grow
      />
      <CSpinner
        color="danger"
        style="width:4rem;height:4rem;position:absolute;top:60%;left:56%;z-index:10002;"
        grow
      />             
    </div>
    <CToaster :autohide="3000">
      <template>
        <CToast
          v-for="toast in $store.getters.toastsMessage" :key="'toast' + toast.toastKey"
          :show="true"
          :header="toast.eventName"
        >
          {{toast.responseMessage}}.
        </CToast>
      </template>
    </CToaster>
    <CContainer style="z-index:1000">
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCardGroup>
            <CCard class="p-4" style="background:transparent;">
              <div style="background-image: linear-gradient(135deg,#028ed5 0,#7b2183 100%); 
                display:block; opacity:0.8; 
                position: absolute; 
                top: 0; 
                left: 0; 
                width:100%; 
                height:100%;
                z-index:-1;"></div>
              <CCardBody>
                <CForm v-if="showForm"
                    @submit.prevent="processResetPassword"
                >
                
                  <h1 style="color:#ffffff">Reset Password</h1>
                  <CRow>
                    <CCol sm="12">
                      <CInput
                        style="color:#fff"
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
                  </CRow>
                  <CRow>
                    <CCol sm="12">
                      <CInput
                        style="color:#fff"
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
                  <CRow>
                    <CCol col="12" class="text-left">
                      <CButton type="submit" color="warning" class="px-4" style="width:200px; font-size:14px; font-weight:bold;">Reset Password</CButton>
                    </CCol>
                  </CRow>
                </CForm>
                <div v-if="!showForm">
                  <h1 style="color:#ffffff">Reset Password</h1>
                  <p style="color:#ffffff">Anda sudah melakukan reset password.</p>
                  <p style="color:#ffffff">Silahkan menuju link berikut <a style="color:#f9b115" :href="linkCallback">{{linkCallback}}</a>.</p>

                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<style lang="scss">
  // Import Main styles for this application
  @import '../../assets/scss/styleLogin.scss';
</style>

<script>
import store from '../../store';
import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';
import axios from 'axios';

export default {
  name: 'Login',
  data () {
    return  {
      store,
      moment,
      globalFunctions,
      vm : this,
      showForm: true,
      linkCallback: "http://localhost/",
      fieldForm: {
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
      }
    }
  },
  created () {
    document.querySelector("body").style.overflow = "hidden";
  },
  mounted(){
  },
  methods:{
    processResetPassword: function (e) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('dd') && params.has('cd') && globalFunctions.validationForm(this, 'fieldForm')) {
      const data = {
            username		: "visitor.request",
            password    : globalFunctions.encryptOurBoard("Password1234!@")
        };

        baseCallApiHelper.callApi(
          "Validasi Web",
          null,
          api.system_user.login.method,
          api.system_user.login.url, 
          data, 
          (status, data, message) => {
            if(status) {
              var token = data.token_type + ' ' + data.access_token;
              var data = {
                id : params.get('cd'),
                activation_code : params.get('dd'),
                is_me : true,
                password : globalFunctions.encryptOurBoard(this.fieldForm.password.value),
                password_confirmation : globalFunctions.encryptOurBoard(this.fieldForm.password_confirmation.value)
              };

              const client = axios.create({
                baseURL: api.visitor.resetPassword.url,
                json: true
              });

              const headers =  {
                  "Content-Type": "application/json",
                  "Authorization" : token
              };

              client({
                  method: api.visitor.resetPassword.method,
                  data: data,
                  headers: headers,
                  //timeout: 40000,
                  responseType: 'json',
              })
              .then(response => {
                if (response.status === 200) {
                  this.showForm = false;
                  this.linkCallback = response.data.result.data;
                } else {
                  if (typeof(response.data.status) !== 'undefined' && response.data !== null) {
                    alert(response.data.status.response_message);
                  } else {
                    alert("Something went wrong, please call the administrator !!!")
                  }                  
                }
              })
              .catch(error => {
                if (typeof(error.response.data.status) !== 'undefined' && error.response.data !== null) {
                  alert(error.response.data.status.response_message);
                } else {
                  alert("Something went wrong, please call the administrator !!!")
                }
              });
            } else {
              alert("Something went wrong, please call the administrator !!!")
            }
          }, 
          false, 
          true,
          false
        );    

      }
     


        e.preventDefault(); 
    
    }
  }
}
</script>
