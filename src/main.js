import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store'; // 스토어 임포트
import '@/assets/styles.css';

createApp(App)
    .use(router)
    .use(vuetify)
    .use(store) // 스토어 사용
    .mount('#app');
