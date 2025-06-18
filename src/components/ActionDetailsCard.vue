<template>
  <v-container>
    <v-card class="pa-6 mt-8" elevation="6">
      <v-card-title class="search-title">
        <v-icon color="primary" class="mr-2">mdi-finance</v-icon>
        <span class="search-title-text">Informations sur l'action : {{ actionSelectionnee }}</span>
        <v-btn icon v-if="action" @click="onGeneratePdf" class="search-title-btn">
          <v-icon>mdi-file-pdf-box</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-show="action">
        <div ref="actionCard">
          <div class="mb-2 text-caption">
            Recherchez une action par symbole ou sélectionnez-en une pour afficher ses informations et son historique.
          </div>
          <v-autocomplete
            v-model="actionSelectionnee"
            :items="allActions"
            item-title="display"
            item-value="symbole"
            label="Sélectionner ou rechercher une action"
            clearable
            solo
          />
          <v-card v-if="action">
            <v-card-title>{{ action.symbole }}</v-card-title>
            <v-card-text>
              Date: {{ action.date }}<br />
              Open: {{ action.open }}<br />
              Close: {{ action.close }}<br />
              Volume: {{ action.volume }}
            </v-card-text>
          </v-card>
          <GraphiqueLignes
            v-if="!loadingHistoriqueAction && historiqueAction.length"
            :labels="historiqueAction.map(e => e.date)"
            :valeurs="historiqueAction.map(e => e.close)"
            titre="Historique de clôture"
            couleur="#1976D2"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import GraphiqueLignes from "./GraphiqueLignes.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Props
const props = defineProps({
  actionSelectionnee: String,
  allActions: Array,
  action: Object,
  historiqueAction: Array,
  loadingHistoriqueAction: Boolean,
});

// Emits
const emit = defineEmits(["update:actionSelectionnee"]);

// v-model support
const actionSelectionnee = computed({
  get: () => props.actionSelectionnee,
  set: (val) => emit("update:actionSelectionnee", val),
});

// PDF export
const actionCard = ref(null);
async function onGeneratePdf() {
  await nextTick();
  const el = actionCard.value;
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