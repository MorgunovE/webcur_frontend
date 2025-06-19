<template>
  <v-container>
    <v-card class="pa-6 mt-8" elevation="6">
      <v-card-title>
        <v-icon color="primary" class="mr-2">mdi-calculator</v-icon>
        Calculer le coût d'achat d'une action
      </v-card-title>
      <v-card-text>
        <div class="mb-2 text-caption">
          Calculez le coût total d'achat d'une action à une date donnée et dans la devise de votre choix.
        </div>
        <v-form @submit.prevent="onCalculerAchatAction">
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="achatSymboleLocal"
                :items="allActions"
                item-title="display"
                item-value="symbole"
                label="Symbole"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="achatDateLocal"
                label="Date"
                type="date"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="achatQuantiteLocal"
                label="Quantité"
                type="number"
                min="1"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="achatDeviseLocal"
                :items="devises"
                label="Devise"
                required
              />
            </v-col>
          </v-row>
          <v-btn type="submit" color="primary" class="mt-2">Calculer</v-btn>
        </v-form>
        <v-alert v-if="achatResultat" type="success" class="mt-4">
          {{ achatResultat.quantite }} {{ achatResultat.symbole }} = {{ achatResultat.cout_total }} {{ achatResultat.devise }} (Taux: {{ achatResultat.taux }})
        </v-alert>
        <v-alert v-if="achatErreur" type="error" class="mt-4">{{ achatErreur }}</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref} from "vue";

const props = defineProps({
  allActions: Array,
  devises: Array,
  achatResultat: Object,
  achatErreur: String,
});

const emit = defineEmits(["calculerAchatAction"]);

const achatSymboleLocal = ref("AAPL");
const achatDateLocal = ref(new Date().toISOString().slice(0, 10));
const achatQuantiteLocal = ref(1);
const achatDeviseLocal = ref("USD");


function onCalculerAchatAction() {
  emit("calculerAchatAction", {
    symbole: achatSymboleLocal.value,
    date: achatDateLocal.value,
    quantite: achatQuantiteLocal.value,
    devise: achatDeviseLocal.value,
  });
}
</script>