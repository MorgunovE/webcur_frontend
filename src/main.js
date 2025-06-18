import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios, { detectApiBaseUrl } from "./api/axios";

async function bootstrap() {
  await detectApiBaseUrl();

  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const app = createApp(App);
  app.use(store).use(router).use(vuetify);

  await store.dispatch("auth/reconnect");
  app.mount("#app");
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap app:", err);
});