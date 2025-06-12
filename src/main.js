import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import "./assets/styles/main.scss";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("user_id");

async function bootstrap() {
  if (token) {
    const ok = await store.dispatch("auth/reconnect");
    if (!ok && userId) {
      await router.push("/login");
    }
  }
  createApp(App).use(store).use(router).use(vuetify).mount("#app");
}

bootstrap();
