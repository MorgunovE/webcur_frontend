<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>

      <v-container fluid class="hero-section-login py-12 mb-8">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="text-center">
            <h1 class="display-1 font-weight-bold white--text mb-16 mt-16">
              Connectez-vous à WebCur
            </h1>
            <p class="subtitle-1 white--text b-16 mt-16">
              Accédez à votre tableau de bord personnalisé pour suivre vos devises et actions favorites.
            </p>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="6" lg="4">
            <v-card class="pa-8" elevation="10">
              <h2 class="mb-6 text-center">Connexion</h2>
              <v-form @submit.prevent="seConnecter">
                <v-text-field v-model="email" label="Email" required data-cy="login-email" />
                <v-text-field
                  v-model="motDePasse"
                  label="Mot de passe"
                  type="password"
                  required
                  data-cy="login-password"
                />
                <v-btn type="submit" color="primary" block class="mt-4" data-cy="login-submit">
                  Se connecter
                </v-btn>
              </v-form>
              <v-alert v-if="erreur" type="error" class="mt-4">{{ erreur }}</v-alert>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";

const email = ref("");
const motDePasse = ref("");
const erreur = ref("");
const store = useStore();
const router = useRouter();

async function seConnecter() {
  const ok = await store.dispatch("auth/connexion", {
    email: email.value,
    mot_de_passe: motDePasse.value,
  });
  if (ok) {
    await router.push("/account");
  } else {
    erreur.value = "Identifiants invalides";
  }
}
</script>

<style scoped>
.hero-section-login {
  background: linear-gradient(
      rgba(25, 25, 50, 0.55),
      rgba(25, 25, 50, 0.55)
    ),
    url('@/assets/images/hero-login.png') center/cover no-repeat;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  min-height: 340px;
  color: white;
}

</style>