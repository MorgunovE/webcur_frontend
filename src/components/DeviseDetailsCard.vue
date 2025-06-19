<template>
  <v-container>
    <v-card class="pa-6 mt-8" elevation="6">
      <v-card-title class="search-title">
        <v-icon color="primary" class="mr-2">mdi-currency-usd</v-icon>
        <span class="search-title-text">Informations sur la devise : {{ pair }}</span>
        <v-btn icon v-if="deviseActive" @click="onGeneratePdf" class="search-title-btn">
          <v-icon>mdi-file-pdf-box</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div ref="deviseCard">
          <div class="mb-2 text-caption">
            Recherchez une devise par nom ou sélectionnez-en une pour afficher ses informations et son historique.
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="deviseSelectionneeLocal"
                :items="devises"
                item-title="nom"
                item-value="nom"
                label="Sélectionner ou rechercher une devise"
                clearable
                solo
                @update:modelValue="onDeviseSelectionChange"
                @update:search-input="onSearchDevise"
                @keydown.enter="onHandleDeviseInput"
                @input="onSearchDevise"
              />
              <v-alert v-if="erreur" type="error" class="mt-2">{{ erreur }}</v-alert>
              <v-card v-if="deviseActive">
                <v-card-title>{{ deviseActive.nom }}</v-card-title>
                <v-card-text>
                  <div>Taux : {{ deviseActive.taux }}</div>
                  <div>Date : {{ deviseActive.date_maj }}</div>
                  <div>Base : {{ deviseActive.base_code }}</div>
                  <div>
                    <strong>Conversion rates:</strong>
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>Devise</th>
                          <th>Taux</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(taux, code) in limitedConversionRates" :key="code">
                          <td>{{ code }}</td>
                          <td>{{ taux }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                    <div v-if="showAllRates">
                      <v-btn small @click="showAllRates = false">Show less</v-btn>
                    </div>
                    <div v-else>
                      <v-btn small @click="showAllRates = true">Show all</v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <GraphiqueLignes
                v-if="!loadingHistoriqueDevice && labels.length && valeurs.length"
                :labels="labels"
                :valeurs="valeurs"
                :titre="`Historique de ${pair} contre USD`"
                couleur="#1976D2"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-alert v-if="erreur" type="error" class="mt-2">{{ erreur }}</v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, nextTick, watch } from "vue";
import GraphiqueLignes from "./GraphiqueLignes.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Props
const props = defineProps({
  pair: String,
  deviseSelectionnee: String,
  devises: Array,
  deviseActive: Object,
  labels: Array,
  valeurs: Array,
  erreur: String,
  loadingHistoriqueDevice: Boolean,
  conversionRates: Object,
});

// Emits
const emit = defineEmits([
  "update:deviseSelectionnee",
  "searchDevise",
  "handleDeviseInput"
]);

// Local state for showAllRates
const showAllRates = ref(false);

// v-model support for deviseSelectionnee
const deviseSelectionneeLocal = computed({
  get: () => props.deviseSelectionnee,
  set: (val) => emit("update:deviseSelectionnee", val),
});

// Computed for limited conversion rates
const limitedConversionRates = computed(() => {
  if (!props.conversionRates) return {};
  const entries = Object.entries(props.conversionRates);
  if (showAllRates.value) return Object.fromEntries(entries);
  return Object.fromEntries(entries.slice(0, 10));
});

// PDF export
const deviseCard = ref(null);
async function onGeneratePdf() {
  await nextTick();
  const el = deviseCard.value;
  if (!el) return;
  const originalBg = el.style.backgroundColor;
  const whiteBg = "#fff";
  el.style.backgroundColor = whiteBg;
  el.querySelectorAll("*").forEach(child => {
    child.style.backgroundColor = whiteBg;
  });

  html2canvas(el, { backgroundColor: whiteBg, useCORS: true, scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 20;
    let remainingHeight = imgHeight;
    let imgY = 0;

    while (remainingHeight > 0) {
      pdf.addImage(
        imgData,
        "PNG",
        20,
        position,
        imgWidth,
        Math.min(remainingHeight, pageHeight - 40),
        undefined,
        "FAST",
        0,
        imgY / canvas.height,
        1,
        Math.min(1, (pageHeight - 40) / imgHeight)
      );
      remainingHeight -= (pageHeight - 40);
      imgY += (pageHeight - 40) * (canvas.height / imgHeight);
      if (remainingHeight > 0) {
        pdf.addPage();
      }
    }

    pdf.save("rapport.pdf");

    el.style.backgroundColor = originalBg;
    el.querySelectorAll("*").forEach(child => {
      child.style.backgroundColor = "";
    });
  });
}

// Event handlers
function onDeviseSelectionChange(val) {
  emit("update:deviseSelectionnee", val);
}
function onSearchDevise(val) {
  emit("searchDevise", val);
}
function onHandleDeviseInput(event) {
  emit("handleDeviseInput", event);
}
</script>

<style scoped>
.search-title-text {
  flex: 1 1 65px;
  min-width: 0;
  white-space: normal;
  word-break: break-word;
}
.search-title-btn {
  flex-shrink: 0;
  margin-left: 16px;
}
@media (max-width: 600px) {
  .search-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .search-title-btn {
    margin-left: 16px;
    align-self: flex-end;
  }
}
</style>