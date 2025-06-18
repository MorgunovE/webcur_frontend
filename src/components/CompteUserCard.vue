<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card class="pa-6 mb-4" elevation="8">
        <v-card-title>
          <h2 class="mb-4">Mon compte</h2>
          <v-avatar size="40" class="mr-3">
            <v-icon color="primary">mdi-account-circle</v-icon>
          </v-avatar>
          {{ utilisateur?.nom_utilisateur || 'Utilisateur' }}
        </v-card-title>
        <v-card-text>
          <div>Email : {{ utilisateur?.email }}</div>
          <v-btn color="error" class="mt-4" @click="seDeconnecter">Se déconnecter</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="pa-6 mb-4" elevation="8">
        <v-card-title>Modifier le profil</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="nouveauNom"
            label="Nouveau nom d'utilisateur"
          />
          <v-btn color="primary" @click="mettreAJourUtilisateur(nouveauNom)">
            Mettre à jour
          </v-btn>
          <v-divider class="my-4"></v-divider>
          <v-btn color="error" @click="supprimerMonCompte">
            Supprimer mon compte
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const utilisateur = computed(() => store.state.auth.utilisateur);
const nouveauNom = ref(utilisateur.value ? utilisateur.value.nom_utilisateur : "");

async function seDeconnecter() {
  await store.dispatch("auth/deconnexion");
  await router.push("/");
}

async function mettreAJourUtilisateur(nouveauNom) {
  if (utilisateur.value) {
    await store.dispatch("utilisateur/mettreAJourUtilisateur", {
      id: utilisateur.value.id,
      donnees: { nom_utilisateur: nouveauNom },
    });
    const updatedUser = {
      ...utilisateur.value,
      nom_utilisateur: nouveauNom,
    };
    store.commit("auth/setUtilisateur", updatedUser);
  }
}

async function supprimerMonCompte() {
  if (utilisateur.value) {
    await store.dispatch("utilisateur/supprimerUtilisateur", utilisateur.value.id);
    await seDeconnecter();
  }
}
</script>