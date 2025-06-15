<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>

    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";

const store = useStore();

onMounted(async () => {
});
</script>
