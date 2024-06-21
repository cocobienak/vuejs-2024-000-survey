<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar" style="border:1px solid;">
         <CIcon name="cil-user"/>
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
    <CDropdownItem
      @click="$router.push({ path: `/system-user/edit-self/${activeSystemUserId}` })"
    >
      <CIcon name="cil-user" 
      /> Profile
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem
     @click="processLogout"
    >
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { api } from '../configurations/services';
import baseCallApiHelper from '../helpers/baseCallApi';
import store from '../store';

export default {
  name: 'TheHeaderSubMenuUser',
  data () {
    return { 
      activeOauthClientId : localStorage.getItem('oauthClientId'),
      activeSystemUserName : localStorage.getItem('systemUserName'),
      activeSystemUserId : localStorage.getItem('systemUserId'),
      activeSystemUserDomain : localStorage.getItem('systemUserDomain')
    }
  },
  methods:{
    processLogout: function (e) {

      baseCallApiHelper.callApi(
        "Logout",
        null,
        api.system_user.logout.method,
        api.system_user.logout.url,  
        null, 
        (status, data, message) => {
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

            this.$router.push('/login');
        }, 
        true, 
        true,
        true
      );

      e.preventDefault();
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>