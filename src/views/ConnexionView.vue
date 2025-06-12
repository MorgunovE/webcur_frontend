<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h2>Connexion</h2>
        <v-form @submit.prevent="seConnecter">
          <v-text-field v-model="email" label="Email" required />
          <v-text-field
            v-model="motDePasse"
            label="Mot de passe"
            type="password"
            required
          />
          <v-btn type="submit" color="primary">Se connecter</v-btn>
        </v-form>
        <v-alert v-if="erreur" type="error" class="mt-2">{{ erreur }}</v-alert>
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
import NavigationPrincipale from "../components/NavigationPrincipale.vue";

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
    await router.push("/");
  } else {
    erreur.value = "Identifiants invalides";
  }
}
</script>
