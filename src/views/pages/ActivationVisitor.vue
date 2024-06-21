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
    <!-- :header="'Code : ' + toast.responseCode" -->
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
                    @submit.prevent="processFormActivation"
                >
                
                  <h1 style="color:#ffffff">Aktivasi Akun
                  </h1>
                  <p style="color:#ffffff">Terima kasih sudah mendaftar.</p>
                  <p style="color:#ffffff">Klik button dibawah untuk mengaktifkan akun anda.</p>

                  <CRow>
                    <CCol col="12" class="text-left">
                      <CButton type="submit" color="warning" class="px-4" style="width:200px; font-size:14px; font-weight:bold;">Aktivasi Akun</CButton>
                    </CCol>
                  </CRow>
                </CForm>
                <div v-if="!showForm">
                  <h1 style="color:#ffffff">Aktivasi Akun</h1>
                  <p style="color:#ffffff">Terima kasih sudah mengaktifkan akun anda.</p>
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
      }
    }
  },
  created () {
    document.querySelector("body").style.overflow = "hidden";
  },
  mounted(){
  },
  methods:{
    processFormActivation: function (e) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('dd') && params.has('cd')) {
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
              var activationData = {
                id : params.get('cd'),
                activation_code : params.get('dd') 
              };

              const client = axios.create({
                baseURL: api.visitor.activation.url,
                json: true
              });

              const headers =  {
                  "Content-Type": "application/json",
                  "Authorization" : token
              };

              client({
                  method: api.visitor.activation.method,
                  data: activationData,
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
