import { createPinia } from 'pinia';

import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import './styles/main.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

export default {
  title: 'SP Base Vue',
};
