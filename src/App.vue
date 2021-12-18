<template>
  <v-app>
    <v-main>
      <Gmeter/>
    </v-main>
  </v-app>
</template>

<script>
import Gmeter from './components/Gmeter.vue';

export default {
  name: 'App',

  components: {
    Gmeter,
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
/* Vuetifyは applicationというclassにfont-familyが設定されているので直接上書きする */
* :not(.v-icon) {
  font-family: "游ゴシック Medium",YuGothic,YuGothicM,"Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro",メイリオ,Meiryo,sans-serif;
}
</style>
