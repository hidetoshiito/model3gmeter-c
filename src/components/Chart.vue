<script>
import { Radar, mixins } from 'vue-chartjs';

export default {
  extends: Radar,
  mixins: [mixins.reactiveProp],
  props: ['chartData'],
  name: 'chart',
  data() {
    return {
      options: {
        elements: {
          line: {
            borderWidth: 2,
          },
        },
        scale: {
          ticks: {
            min: 0,
            max: 6,
            stepSize: 2,
          },
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
