import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import "./assets/styles/main.scss";

createApp(App).use(store).use(router).use(vuetify).mount("#app");
