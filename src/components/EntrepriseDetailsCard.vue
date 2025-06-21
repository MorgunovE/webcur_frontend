<template>
  <v-container data-cy="entreprise-details-container">
    <v-card class="pa-6 mt-8" elevation="6" data-cy="entreprise-details-card">
      <v-card-title class="search-title" data-cy="entreprise-details-title">
        <v-icon color="primary" class="mr-2">mdi-domain</v-icon>
        <span class="search-title-text" data-cy="entreprise-details-title-text">Informations sur l'entreprise : {{ entrepriseSelectionnee }}</span>
        <v-btn icon v-if="entreprise" @click="onGeneratePdf" class="search-title-btn" data-cy="entreprise-details-pdf-btn">
          <v-icon>mdi-file-pdf-box</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-show="entreprise">
        <div ref="entrepriseCard" data-cy="entreprise-details-content">
          <div class="mb-2 text-caption" data-cy="entreprise-details-caption">
            Recherchez une entreprise par nom ou sélectionnez-en une pour afficher ses informations et son historique.
          </div>
          <v-autocomplete
              v-model="entrepriseSelectionnee"
              :items="allActions"
              item-title="display"
              item-value="symbole"
              label="Sélectionner ou rechercher une entreprise"
              class="mt-2"
              clearable
              solo
              data-cy="entreprise-details-autocomplete"
          />
          <v-card v-if="entreprise" data-cy="entreprise-details-info-card">
            <v-card-title data-cy="entreprise-details-info-title">
              <img
                  :src="entreprise.image"
                  alt="Logo"
                  height="40"
                  v-if="entreprise.image"
                  data-cy="entreprise-details-logo"
              />
              {{ entreprise.companyName }} ({{ entreprise.symbole }})
            </v-card-title>
            <v-card-text data-cy="entreprise-details-info-text">
              <div><strong>Prix:</strong> {{ entreprise.price }} {{ entreprise.currency }}</div>
              <div><strong>Variation:</strong> {{ entreprise.change }} ({{ entreprise.changePercentage }})</div>
              <div><strong>Capitalisation:</strong> {{ entreprise.marketCap }}</div>
              <div><strong>Volume:</strong> {{ entreprise.volume }}</div>
              <div><strong>Beta:</strong> {{ entreprise.beta }}</div>
              <div><strong>Dernier dividende:</strong> {{ entreprise.lastDividend }}</div>
              <div><strong>Industrie:</strong> {{ entreprise.industry }}</div>
              <div><strong>CEO:</strong> {{ entreprise.ceo }}</div>
              <div><strong>Pays:</strong> {{ entreprise.country }}</div>
              <div>
                <strong>Site web:</strong>
                <a :href="entreprise.website" target="_blank" data-cy="entreprise-details-website">{{ entreprise.website }}</a>
              </div>
              <div><strong>Description:</strong> {{ entreprise.description }}</div>
            </v-card-text>
          </v-card>
          <GraphiqueLignes
              v-if="!loadingHistoriqueEntreprise && labelsEntreprise.length"
              :labels="labelsEntreprise"
              :valeurs="valeursEntreprise"
              titre="Historique du prix"
              couleur="#1976D2"
              data-cy="entreprise-details-chart"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useStore } from "vuex";
import GraphiqueLignes from "./GraphiqueLignes.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Props
const props = defineProps({
  entrepriseSelectionnee: String,
  allActions: Array,
  labelsEntreprise: Array,
  valeursEntreprise: Array,
  loadingHistoriqueEntreprise: Boolean,
  entreprise: Object,
});

// Emits
const emit = defineEmits(["update:entrepriseSelectionnee"]);

const entrepriseCard = ref(null);

const entrepriseSelectionnee = computed({
  get: () => props.entrepriseSelectionnee,
  set: (val) => emit("update:entrepriseSelectionnee", val),
});

// PDF export
async function onGeneratePdf() {
  await nextTick();
  const el = entrepriseCard.value;
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