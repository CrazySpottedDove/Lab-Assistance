import { createApp } from 'vue'
import App from './App.vue'
import './assets/less/index.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useAllDataStore } from './assets/stores'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.mount('#app')
