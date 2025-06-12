<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h2>Inscription</h2>
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
          <v-btn type="submit" color="primary">S'inscrire</v-btn>
        </v-form>
        <v-alert v-if="erreur" type="error" class="mt-2">{{ erreur }}</v-alert>
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
import NavigationPrincipale from "../components/NavigationPrincipale.vue";

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
