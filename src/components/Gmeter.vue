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
    <v-row>
      <v-col cols="12" sm="12">
        <Chart :chart-data="data_collection" />
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
          v-model="g_data.direction"
          label="方向変化"
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
import axios from 'axios';
import Chart from '@/components/Chart.vue';

export default {
  name: 'Gmeter',
  components: { Chart },
  data: () => ({
    data_collection: null,
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
    console.log('マイナス指定するのでデータは２種類');
    this.fillData(0, 0);
    console.log(`${this.$vnode.componentOptions.tag} : mounted start`);
    console.log('タイムスタンプに現在時刻を設定');
    const date = new Date();
    this.gps_data.timestamp = Math.floor(date.getTime() / 1000);
    /*
    */
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log(`取得パラメタ: ${token}`);
    console.log('id情報取得');
    axios.get(`http://52.194.65.131:3000?token=${token}`, {})
      .then((response) => {
        // 処理成功2xx時のコールバック
        console.dir(response.data);
        // this.nakcat_results = response.data;
        // this.loading_member.nakcat = false;
      })
      .catch((error) => {
        // 処理失敗!not2xx時のコールバック
        console.error(error);
        // this.nakcat_results = { msg: 'エラー' };
        // this.loading_member.nakcat = false;
      });
  },
  methods: {
    fillData(acceleration, yokoG) {
      this.data_collection = {
        labels: ['前', '右', '後', '左'],
        datasets: [
          {
            label: 'Gメーター',
            // 表示を反転
            data: [(acceleration * -1), (yokoG * -1)],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)',
          },
        ],
      };
    },
    // GPSデータを配列に入れる
    pushGpsData() {
      console.log('method pushGpsData start');
      this.gps_data_list.push({ ...this.gps_data });
      console.log('リストが２件以上なら加速度を計算する');
      if (this.gps_data_list.length >= 2) {
        console.log('リストが２件以上');
        const ret = this.getAccelerationData(this.gps_data_list.slice(-1)[0], this.gps_data_list.slice(-2)[0]);
        this.g_data = ret;
        this.fillData(this.g_data.acceleration, this.g_data.yokoG);
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
      console.log('横G算出');
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
      let yokoG = 0;
      if (direction !== 0) {
        const direction_per_sec = (direction / counttime);
        console.log(`1秒あたりの方向変化量: ${direction_per_sec}`);
        const circuit = (360 / direction_per_sec) * nms;
        console.log(`円周の距離(m)を算出: ${circuit}`);
        const radius = (circuit / 2) / 3.14;
        console.log(`円の半径(m)を算出: ${radius}`);
        console.log('横Gは速度の2乗 / カーブの半径');
        yokoG = (nms * nms) / radius;
        console.log(`横G(m/s)を算出: ${yokoG}`);
      }
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
