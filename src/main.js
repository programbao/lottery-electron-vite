import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import { createPinia } from 'pinia'
const app = createApp(App);
const state = createPinia();
const options = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: false,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  // draggable: true,
  // draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
}
app.use(Toast, options);
app.use(state);

app.mount('#app')
