<template>
  <v-container>
    <v-row>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="gps_data.heading"
            label="向き"
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="gps_data.speed"
            label="スピード"
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="gps_data.timestamp"
            label="タイムスタンプ"
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-btn
            x-large
            color="success"
            @click="pushGpsData()"
          >
            セット
          </v-btn>
        </v-col>
    </v-row>
    <v-row class="text-center">
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="g_data.yokoG"
            label="横加速度"
            disabled
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="g_data.acceleration"
            label="前後加速度"
            disabled
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="g_data.counttime"
            label="経過時間"
            disabled
          >
          </v-text-field>
        </v-col>
      <v-col cols="12">
        <p> {{ gps_data_list }} </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Gmeter',

  data: () => ({
    target_site: 'hoge',
    gps_data: { heading: 0, speed: 0, timestamp: 0 },
    gps_data_list: [],
    g_data: {
      counttime: 0,
      direction: 0,
      acceleration: 0,
      yokoG: 0,
    },
  }),
  computed: {
    // GMeter結果表示
    gDataResultList() {
      console.log('gDataResultList start');
      return 0;
    },
  },
  mounted() {
    console.log(`${this.$vnode.componentOptions.tag} : mounted start`);
    console.log('タイムスタンプに現在時刻を設定');
    const date = new Date();
    this.gps_data.timestamp = Math.floor(date.getTime() / 1000);
    /*
    */
  },
  methods: {
    // GPSデータを配列に入れる
    pushGpsData() {
      console.log('method pushGpsData start');
      this.gps_data_list.push({ ...this.gps_data });
      console.log('リストが２件以上なら加速度を計算する');
      if (this.gps_data_list.length >= 2) {
        console.log('リストが２件以上');
        const ret = this.getAccelerationData(this.gps_data_list.slice(-1)[0], this.gps_data_list.slice(-2)[0]);
        this.g_data = ret;
      }
      console.log('タイムスタンプは現在時刻に再計算する');
      const date = new Date();
      this.gps_data.timestamp = Math.floor(date.getTime() / 1000);
    },
    getAccelerationData(now, before) {
      console.log('method getAccelerationData start');
      console.log('速度を秒速毎メートルにする');
      const nms = (now.speed * 1000) / 60 / 60;
      const bms = (before.speed * 1000) / 60 / 60;
      console.log(`now: ${nms}`);
      console.log(`before: ${bms}`);
      const counttime = now.timestamp - before.timestamp;
      console.log(`経過時間: ${counttime}`);
      console.log('現在の速度(m/s) - 以前の速度(m/s) / 経過時間(s) = 加速度(m/s)');
      const acceleration = (nms - bms) / counttime;
      console.log(`加速度: ${acceleration}`);
      /* */
      console.log('方向変化算出');
      const nhd = parseInt(now.heading, 0);
      const bhd = parseInt(before.heading, 0);
      const direction1 = nhd - bhd;
      let direction2 = 0;
      if (nhd > bhd) {
        direction2 = nhd - (bhd + 360);
      } else {
        direction2 = (nhd + 360) - bhd;
      }
      console.log(`${direction1},  ${direction2}`);
      let direction = 0;
      if (Math.abs(direction1) > Math.abs(direction2)) {
        direction = direction2;
      } else {
        direction = direction1;
      }
      console.log(`方向変化量(+が右、-が左): ${direction}`);
      console.log('横G算出(適当,根拠なし)');
      let yokoG = 0;
      if (direction !== 0) {
        const nondirectionvolume = 181 - Math.abs(direction / counttime);
        yokoG = (nms * nms) / (nondirectionvolume / 2);
        if (direction < 0) {
          yokoG *= -1;
        }
      }
      console.log(`横G(+が右、-が左): ${yokoG}`);
      return {
        counttime,
        direction,
        acceleration,
        yokoG,
      };
    },
  },
};
</script>
