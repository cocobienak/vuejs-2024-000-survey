import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  tokenAuth: localStorage.getItem('tokenAuth') || '',
  statusAuth: '',
  isLoading: false,
  toastsMessage: [],
  toastsMessageOld: [],
  toastsCount: 0,
  toastsTime: null,
}

const mutations = {
  set (state, [variable, value]) {
    state[variable] = value
  },
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  }
}

const getters = {
  isAuthenticated: state => !!state.tokenAuth,
  statusAuth: state => state.statusAuth,
  isloading: state => state.isLoading,
  toastsMessage: state => state.toastsMessage,
  toastsMessageOld: state => state.toastsMessageOld,
  toastsCount: state => state.toastsCount,
  toastsTime: state => state.toastsTime

}

export default new Vuex.Store({
  state,
  mutations,
  getters
})