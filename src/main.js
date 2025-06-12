import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import "./assets/styles/main.scss";

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(store);
app.mount("#app");
