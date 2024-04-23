import { defineComponent, h, watch } from 'vue';
import { GChart } from 'vue-google-charts';
import axios from 'axios';
import { useSalesStore } from '@/stores/SalesStore';

export default defineComponent({
  name: 'SalesTeamTableChart',
  components: {
    GChart,
  },
  setup() {
    const data = ref([
      ['teamName', 'teamCode', 'contractPrice', 'contractCount', 'cancelPrice', 'cancelCount']
    ]);
    const selectedPeriod = ref("월");
    
    watch(() => useSalesStore().salesTeam, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        selectedPeriod.value = newValue;
        updateChartData();
      }
    });

    const updateChartData = async () => {
      try {
        let temp = "";
        
        if (selectedPeriod.value === '월') {
          temp = "http://localhost:8081/api/batch/sales-team/month";
        } else if (selectedPeriod.value === "반기") {
          temp = "http://localhost:8081/api/batch/sales-team/quarter";
        } else if (selectedPeriod.value === "년") {
          temp = "http://localhost:8081/api/batch/sales-team/year";
        }

        const response = await axios.get(temp);
        const valuesOnly = response.data.result.map(obj => Object.values(obj));
        data.value.splice(1);
        data.value.push(...valuesOnly);
      } catch (error) {
        console.error("데이터를 가져올 수 없습니다:", error);
      }
    };

    onMounted(() => {
      updateChartData();
    });

    return () =>
      h(GChart, {
        data: data.value,
        options: {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'bottom' },
          pageSize: 5,
          width: 1300,
          height: 500,
        },
        type: 'Table',
      });
  },
});