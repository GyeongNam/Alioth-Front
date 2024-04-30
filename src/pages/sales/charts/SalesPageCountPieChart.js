import { defineComponent, h, ref, watchEffect } from 'vue';
import { GChart } from 'vue-google-charts';
import axios from 'axios';

const type = 'PieChart';

let data = [['보험 분류', '보험별 건수']];

async function getProductCountData() {
  try {
    const response = await axios.get("http://localhost:8081/api/batch/contract-rank/count");
    const valuesOnly = response.data.result.map(obj => {
      obj.count = parseInt(obj.count);
      return Object.values(obj);
    });
    data.splice(1);
    data.push(...valuesOnly);
  } catch (error) {
    console.log("요청할 수 없습니다. : ", error);
  }
}

const options = {
  title: '보험 계약 건수 비율',
  pieHole: 0.4,
  width: 600,
  height: 500,
};

export default defineComponent({
  name: 'SalesPageCountChart',
  components: {
    GChart,
  },
  setup() {
    const chartData = ref(data);
    const loaded_CountPie = ref(false);

    // 데이터를 비동기적으로 가져오기 위해 watchEffect 사용
    watchEffect(() => {
      // 데이터가 로드되지 않았을 때만 데이터를 가져옴
      if (!loaded_CountPie.value) {
        getProductCountData().then(() => {
          loaded_CountPie.value = true; // 데이터를 성공적으로 가져온 후 loaded를 true로 변경
        });
      }
    });

    return () =>
      // loaded가 true일 때만 차트를 렌더링
      loaded_CountPie.value
        ? h(GChart, {
            data: chartData.value,
            options,
            type,
          })
        : null;
  },
});
