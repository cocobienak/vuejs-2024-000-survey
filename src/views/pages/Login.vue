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
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4" style="background-color: rgba(0, 226, 144, 0.3)">
              <CCardBody>
                <CForm
                    @submit.prevent="processFormLogin"
                >
                  <h1 style="color:#ffffff">Login
                  </h1>
                  <p style="color:#ffffff">Sign In to your account</p>
                  <CInput
                    name="username"
                    v-model="fieldForm.username.value"
                    placeholder="Username / email / phone number"
                    autocomplete="username-email"
                    :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'username')"
                    :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'username')"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'username')"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    name="password"
                    v-model="fieldForm.password.value"
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'password')"
                    :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'password')"                    
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'password')"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton type="submit" color="primary" class="px-4">Login</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <!-- <CButton color="link" class="px-0">Forgot password?</CButton> -->
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <!-- <CCard
              style="background-color: rgba(241, 178, 0, 0.3)"
              text-color="white"
              class="text-center"
            >
              <CCardBody>
                <div 
                  style="background-color: rgb(255, 255, 255, 0.7);
                    padding-top: 5px;padding-bottom: 5px;margin-bottom:15px;
                    border-radius: 10px; border: 2px solid #0c00b1;"
                >
                  <CIcon 
                    class="c-sidebar-brand-full" 
                    name="logo" 
                    size="custom-size" 
                    :height="50" 
                    viewBox="0 0 400 106.31479736098021"
                  />
                </div>
                <h2>Sign up</h2>
                <p></p>
                <CButton
                  color="light"
                  variant="outline"
                  size="lg"
                >
                  Register Now!
                </CButton>
              </CCardBody>
            </CCard> -->
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
    <div style="position:absolute;width:100%;height:100%;background:#050505a8;">
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
      </div>
      <div class="circle-container">
        <div class="circle"></div>
    </div>
    </div>
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

export default {
  name: 'Login',
  data () {
    return  {
      store,
      moment,
      globalFunctions,
      vm : this,
      fieldForm: {
        username : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.6', 'max.50'],
          isValid : null
        },
        password : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.6', 'max.20'],
          isValid : null        
        }
      }
    }
  },
  created () {
    document.querySelector("body").style.overflow = "hidden";
  },
  mounted(){
  },
  methods:{
    processFormLogin: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {

        const data = {
            username		: this.fieldForm.username.value,
            password    : globalFunctions.encryptOurBoard(this.fieldForm.password.value),
        };

        baseCallApiHelper.callApi(
          "Login",
          null,
          api.system_user.login.method,
          api.system_user.login.url, 
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

              localStorage.setItem('backlinkclient', '');
              localStorage.setItem('backlinkNameclient', '');

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
            }
          }, 
          true, 
          true,
          false
        );

        e.preventDefault(); 
      }

    }
  }
}
</script>
