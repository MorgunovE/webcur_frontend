// main.js
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "./api/axios";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const app = createApp(App);

app.use(store).use(router).use(vuetify);

store.dispatch("auth/reconnect").then(() => {
  app.mount("#app");
});