<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>
      <!-- Hero Image Section -->
      <v-container fluid class="hero-section-register py-12 mb-8">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="text-center">
            <h1 class="display-1 font-weight-bold white--text mb-16 mt-16">
              Rejoignez WebCur dès aujourd'hui
            </h1>
            <p class="subtitle-1 white--text mt-16 mb-16">
              Créez votre compte pour suivre vos devises et actions favorites.
            </p>
          </v-col>
        </v-row>
      </v-container>
      <!-- Registration Card -->
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="6" lg="4">
            <v-card class="pa-8" elevation="10">
              <h2 class="mb-6 text-center">Inscription</h2>
              <v-form @submit.prevent="sInscrire">
                <v-text-field v-model="email" label="Email" required />
                <v-text-field
                  v-model="motDePasse"
                  label="Mot de passe"
                  type="password"
                  required
                />
                <v-text-field
                  v-model="nomUtilisateur"
                  label="Nom d'utilisateur"
                  required
                />
                <v-btn type="submit" color="primary" block class="mt-4">
                  S'inscrire
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
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";

const email = ref("");
const motDePasse = ref("");
const nomUtilisateur = ref("");
const erreur = ref("");
const router = useRouter();
const store = useStore();

async function sInscrire() {
  try {
    await store.dispatch("utilisateur/inscription", {
      email: email.value,
      mot_de_passe: motDePasse.value,
      nom_utilisateur: nomUtilisateur.value,
    });
    await router.push("/login");
  } catch (e) {
    erreur.value = "Erreur lors de l'inscription";
  }
}
</script>

<style scoped>
.hero-section-register {
  background: linear-gradient(
      rgba(25, 25, 50, 0.55),
      rgba(25, 25, 50, 0.55)
    ),
    url('@/assets/images/hero-register.png') center/cover no-repeat;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  min-height: 340px;
  color: white;
}
.hero-img-register {
  max-width: 120px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.12);
}
</style>