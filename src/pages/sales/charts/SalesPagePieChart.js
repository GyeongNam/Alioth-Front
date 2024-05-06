import { defineComponent, h, ref, watchEffect } from 'vue';
import { GChart } from 'vue-google-charts';
import axios from 'axios';

const type = 'PieChart';

let data = [['보험 분류', '보험별 금액']];

async function getProductCountData() {
  try {
    const baseUrl = import.meta.env.VITE_API_STATISTICS_BASE_URL
    const response = await axios.get(`${baseUrl}/api/batch/contract-rank/price`);
    const valuesOnly = response.data.result.map(obj => {
      obj.price = parseInt(obj.price);
      return Object.values(obj);
    });
    data.splice(1); // 첫 번째 행 제거
    console.log(data);
    data.push(...valuesOnly); // 새로운 데이터 추가
  } catch (error) {
    console.log("요청할 수 없습니다. : ", error);
  }
}

const options = {
  title: '보험 계약 금액 비율',
  pieHole: 0.4,
  width: 600,
  height: 500,
};

export default defineComponent({
  name: 'SalesPagePriceChart',
  components: {
    GChart,
  },
  setup() {
    const chartData = ref(data);
    const loaded_PricePie = ref(false);

    // 데이터를 비동기적으로 가져오기 위해 watchEffect 사용
    watchEffect(() => {
      // 데이터가 로드되지 않았을 때만 데이터를 가져옴
      if (!loaded_PricePie.value) {
        getProductCountData().then(() => {
          loaded_PricePie.value = true; // 데이터를 성공적으로 가져온 후 loaded를 true로 변경
        });
      }
    });

    return () =>
      // loaded가 true일 때만 차트를 렌더링
      loaded_PricePie.value
        ? h(GChart, {
            data: chartData.value,
            options,
            type,
          })
        : null;
  },
});
