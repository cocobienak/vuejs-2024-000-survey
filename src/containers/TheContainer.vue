<template>
  <div class="c-app">
    <div 
      v-if="$store.getters.isloading"
      style="position:fixed;width:100%;height:100%;background-color: rgba(48, 48, 48, 0.9);z-index:10001;"
    >
      <CSpinner
        color="success"
        style="width:4rem;height:4rem;position:fixed;top:50%;left:47%;z-index:10002;"
        grow
      /> 
      <CSpinner
        color="warning"
        style="width:7rem;height:7rem;position:fixed;top:50%;left:50%;z-index:10002;"
      />
      <CSpinner
        color="info"
        style="width:7rem;height:7rem;position:fixed;top:50%;left:50%;z-index:10002;"
        grow
      />
      <CSpinner
        color="danger"
        style="width:4rem;height:4rem;position:fixed;top:60%;left:56%;z-index:10002;"
        grow
      />   
    </div>
    <!-- :header="'Code : ' + toast.responseCode" -->
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
    <TheSidebar/>
    <CWrapper>
      <TheHeader/>
      <div class="c-body">
        <main class="c-main" style="padding:0px 0px 0px 0px;">
          <CContainer fluid style="padding:10px 0px 10px 0px;">
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter/>
    </CWrapper>
  </div>
</template>

<style lang="scss">
  // Import Main styles for this application
  @import '../assets/scss/styleContainer.scss';
</style>

<script>

import TheSidebar from './TheSidebar'
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'

export default {
  name: 'TheContainer',
  components: {
    TheSidebar,
    TheHeader,
    TheFooter
  },
  created () {
    document.querySelector("body").style.overflow = "auto";

  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
