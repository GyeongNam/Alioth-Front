import { defineComponent, h } from 'vue';

import { GChart } from 'vue-google-charts';
import axios from 'axios';
import { useSalesStore } from '@/stores/SalesStore';

export const type = 'Table';

// export const data = [
//   ['Name', 'Salary', 'Full time employee'],
//   ['Mike', '$10,000', true],
//   ['Jim', { v: 8000, f: '$8,000' }, false],
//   ['Alice', { v: 12500, f: '$12,500' }, true],
//   ['Bob', { v: 7000, f: '$7,000' }, true],
// ];

export let data = [ 
  ['teamName', 'teamCode', 'contractPrice', 'contractCount', 'cancelPrice', 'cancelCount']
];

export let selected = "월"
export let url = "";

export function getSalesMemberData() {
  let temp = "";
  selected = useSalesStore().salesTeam;

  if(selected === '월') {
    temp = "http://localhost:8081/api/batch/sales-team/month";
  }else if(selected === "반기") {
    temp = "http://localhost:8081/api/batch/sales-team/quarter";
  }else if(selected === "년") {
    temp = "http://localhost:8081/api/batch/sales-team/year";
  }
  
  console.log(temp);

  axios.get(temp)
        .then(response => {
          console.log("응답결과 : ");
          const valuesOnly = response.data.result.map(obj => Object.values(obj));
          data.splice(1); // 이전 데이터 삭제
          data.push(...valuesOnly);
          console.log(data);
        })
        .catch(error => {
          console.log("요청할 수 없습니다.1s : ", error);
        });
}


export const options = {
  title: 'Company Performance',
  curveType: 'function',
  legend: { position: 'bottom' },
  pageSize: 5,
  width: 1300,
  height: 500,
};

export default defineComponent({
  name: 'SalesTeamTableChart',
  components: {
    GChart,
  },
  setup() {
    
    getSalesMemberData();
    
    return () =>
      h(GChart, {
        data,
        options,
        type,
      });
  },
  data() {
    return {
      selected: '월',
      url: '',
      // salesStore: useSalesStore(),
    }
  },
  methods: {
    callTeamTable() {
      getSalesMemberData();
    }
  }
});
