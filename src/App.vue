<template>
  <v-app>
    <v-layout>
      <AppSidebar></AppSidebar>
      <v-main>
        <AppHeader></AppHeader>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
//
import AppHeader from "@/layouts/AppHeader.vue";
import AppSidebar from "@/layouts/AppSidebar.vue";
</script>
