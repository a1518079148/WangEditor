import { createApp } from 'vue'
import App from './App.vue'
import '@wangeditor/editor/dist/css/style.css'
import plugin from './plugin'
const app = createApp(App)
app.use(plugin)
app.mount('#app')
