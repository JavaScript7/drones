import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {...JSON.parse(sessionStorage.getItem('userInfo'))}, //
    isLogin: false,
    errMsg: '',
    token: '',
    count: 0,
    num: 10,
    message: '',
    allDrones: [],
    curSubaccountIndex: 0, // 默认子账户第一个
    curSubaccountId: '', // 默认子账户第一个账户账号（数据中心，团队管理）
    subaccounts: [] // 所有子账号
  },
  getters: {
    role: state => state.userInfo.type === 'sub' ? 'sub' : 'manager',
    auth: state => state.userInfo.type === 'manager' ? true : false,
    // doneNum (state) {
    //   return state.num + '元'
    // },
    doneNum: state => state.num + '元'
  },
  mutations: { // this.$store.commit()
    GET_SUBACCOUNTS: (state, data) => { // 获取所有的子账户信息(管理员)
      state.subaccounts = data
    },
    LOGIN_OUT: (state, data) => {
      state.userInfo = {}
    },
    USER_INFO: (state, data) => {
      state.userInfo = {...data}
    },
    ERR_MEG: (state, data) => {
      state.errMsg = data
    },
    GET_TOKEN: (state, data) => {
      state.token = data
    },
    LOG_MSG: (state, data) => {
      state.message = data
    },
    CHANGE_SUBACCPUNT: (state, data) => {
      state.curSubaccountIndex = data
    },
    GET_CUR_SUBACCOUNT_ID: (state, data) => {
      state.curSubaccountId = data
    },
    increment (state) {
      state.count++
    }
  },
  actions: { // this.$store.dispatch
    // incAsync (context) {
    //   context.commit('increment')
    // },
    incAsync ({ commit, state }, products) {
      setTimeout(() => {
        commit('increment')
        // console.log(products)
        // console.log(state.num)
      }, 1000)
    },
    actionA ({ commit }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('LOG')
          resolve()
        }, 1000)
      })
    }
  }
})

export default store
