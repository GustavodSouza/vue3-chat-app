import App from '../App.vue'
import * as Vue from 'vue'
import pinia from 'src/store/index';

const app = Vue.createApp(App)

app.use(pinia)
app.mount('#app')
