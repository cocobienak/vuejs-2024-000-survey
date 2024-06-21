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
      <template >
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
                <CForm>
            
                  <p style="color:#ffffff">{{textInfo}}</p>

                </CForm>
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
  name: 'direct-login',
  data () {
    return  {
      store,
      moment,
      globalFunctions,
      vm : this,
      textInfo : "Harap tunggu, sedang melakukan verifikasi.",
      fieldForm: {
      }
    }
  },
  created () {
      document.querySelector("body").style.overflow = "hidden";
      const params = new URLSearchParams(window.location.search);
      if (params.has('dd') && params.has('cd') && params.has('backlink')) {
        var backLink = params.get('backlink');
        var backLinkname = "Back To Client";
        if (params.has('backlinkname')) {
          backLinkname = params.get('backlinkname');
        }

        const data = {
            id		: params.get('cd'),
            back_door_code    : params.get('dd')
        };

        baseCallApiHelper.callApi(
          "Login",
          null,
          api.system_user.bdloginValidation.method,
          api.system_user.bdloginValidation.url, 
          data, 
          (status, data, message) => {
            if(status) {
              // console.log("Login Expired");
              // console.log(moment().add(data.access_token_expire_in, 's').format('YYYY-MM-DD HH:mm:ss'));
              // console.log("------------------------------------------");

              store.commit('set', ['statusAuth', "success"]);
              store.commit('set', ['tokenAuth', data.token_type + ' ' + data.access_token]);
              localStorage.setItem('tokenAuth', data.token_type + ' ' + data.access_token); // store the token in localstorage
              localStorage.setItem('tokenAuthExpired', moment().add(data.access_token_expire_in, 's').format('YYYY-MM-DD HH:mm:ss'));
              localStorage.setItem('tokenRefresh', data.refresh_token);
              localStorage.setItem('tokenRefreshExpired', data.refresh_token_expire);
              localStorage.setItem('oauthClientId', data.oauth_client_id); 
              localStorage.setItem('systemUserId', data.system_user_id); 
              localStorage.setItem('systemUserName', data.system_user_name);
              localStorage.setItem('systemUserDomainId', data.system_user_domain_id);
              localStorage.setItem('systemUserDomain', data.system_user_domain);
              localStorage.setItem('accessRoleMenu', JSON.stringify(data.access_role_module));

              localStorage.setItem('backlinkclient', backLink);
              localStorage.setItem('backlinkNameclient', backLinkname);

              this.$router.push('/');
            } else {
              store.commit('set', ['statusAuth', ""]);
              store.commit('set', ['tokenAuth', ""]);
              localStorage.removeItem('tokenAuth'); // if the request fails, remove any possible user token if possible
              localStorage.removeItem('tokenAuthExpired');
              localStorage.removeItem('tokenRefresh');
              localStorage.removeItem('tokenRefreshExpired');
              localStorage.removeItem('systemUserId'); 
              localStorage.removeItem('systemUserName');
              localStorage.removeItem('systemUserDomainId');  
              localStorage.removeItem('systemUserDomain');

              localStorage.removeItem('backlinkclient');
              localStorage.removeItem('backlinkNameclient');

              localStorage.removeItem('accessRoleMenu');


              this.textInfo = "Your code is not valid !!!";

            }
          }, 
          true, 
          true,
          false
        );



      } else {
        this.textInfo = "URL is not valid !!!";
      }
   },
  mounted(){
  },
  methods:{
  }
}
</script>
