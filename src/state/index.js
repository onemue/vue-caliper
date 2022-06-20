// import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

// Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})


export default new Vuex.Store({
    state: {
      // 存放状态
      imageUrl: "",
      historys: [],
      operationRecord: []
    },
    getters: {
      // state的计算属性
    },
    mutations: {
      // 更改state中状态的逻辑，同步操作
        setImageUrl(payload) {
            this.state.imageUrl = payload;
        },
        setHistorys(payload) {
            this.state.historys = payload;
        },
        addHistorys(payload) {
            this.state.historys.push(payload);
        },
        setOperationRecord(payload) {
            this.state.operationRecord = payload;
        },
        addOperationRecord(payload) {
            this.state.operationRecord.push(payload);
        },
        removeOperationRecord(payload) {
            this.state.operationRecord = this.state.operationRecord.filter(item => item.id !== payload);
        }
    },
    actions: {
      // 提交mutation，异步操作
    },
    // 如果将store分成一个个的模块的话，则需要用到modules。
     //然后在每一个module中写state, getters, mutations, actions等。
    plugins: [vuexLocal.plugin /*, vuexLocalStorage.plugin */],
  });