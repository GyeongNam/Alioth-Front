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
  ['salesMemberName', 'salesMemberCode', 'contractPrice', 'contractCount', 'cancelPrice', 'cancelCount']
];


function getSalesMemberData() {
  let url = "";
  this.selectedPeriod = this.salesStore.salesTeam;
  console.log("자식컴포넌트 getSalesMemberData() 실행");
  console.log(this.selectedPeriod);
  if(selectedPeriod == "월") {
    url = "http://localhost:8081/api/batch/sales-team/month";
  }else if(selectedPeriod == "반기") {
    url = "http://localhost:8081/api/batch/sales-team/quarter";
  }else if(selectedPeriod == "년") {
    url = "http://localhost:8081/api/batch/sales-team/year";
  }

  axios.get(url)
        .then(response => {
          console.log("응답결과 : ");
          // console.log(response.data.result);
          
          const valuesOnly = response.data.result.map(obj => Object.values(obj));
          data.push(...valuesOnly);
          //console.log(data);
          console.log(valuesOnly);
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
  name: 'SalesPersonalTableChart',
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
      selectedPeriod: "월",
      salesStore: useSalesStore(),
    }
  },
  methods: {
    callTeamTable() {
      console.log("응답받음");
      getSalesMemberData();
    }
  }
  
});
