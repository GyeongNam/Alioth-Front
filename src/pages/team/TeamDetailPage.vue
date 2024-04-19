<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <v-card flat>
        <v-row>
          <v-col cols="4" offset="3"> <!-- 팀 명 -->
            <v-card text="팀명" variant="outlined"> {{ state.teamName }}</v-card>
          </v-col>
          <v-col cols="4" offset="1"> <!-- 팀장 -->
            <v-card text="팀장" variant="outlined"> {{ state.teamManagerName }}</v-card>
          </v-col>
        </v-row>
        <v-card-actions>

        </v-card-actions>
      </v-card>

      <div style="margin-bottom: 16px;"></div>

      <v-card>
        <v-card-title class="d-flex align-center pe-2">
          <!--          <v-icon icon="fa:fas fa-edit"></v-icon> &nbsp;-->
          팀원 목록
          <v-spacer></v-spacer>
          <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                        variant="solo-filled" flat hide-details single-line></v-text-field>
          <v-row>
            <v-col class="text-right">
              <v-btn variant="outlined" @click="navigateToAdd">팀원 추가</v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-spacer></v-spacer>
        <ListComponent :columns="state.tableColumns" :rows="state.tableRows" @click:row="navigateToDetail"/>
      </v-card>
    </v-container>
  </v-main>
  <v-dialog v-model="state.modalOpen" width="auto">
    <v-card>
      <v-card-title>
      </v-card-title>
      <v-card-text>
        <v-container>
          <div>
            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                          variant="solo-filled" flat hide-details single-line></v-text-field>
            <ListComponent :columns="state.tableColumns" :rows="state.rows" :showCheckbox="true" :isTeamMember="isTeamMember" @selected-items="handleSelectedItems" @click:row="toggleSelection"></ListComponent>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="" @click="save">확인</v-btn>
        <v-btn color="" @click="closeModal">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import ListComponent from "@/layouts/ListComponent.vue";
import router from "@/router";
import { ref, onMounted, reactive} from 'vue';
import axiosInstance from "@/plugins/loginaxios";

export default {
  components: {ListComponent, AppHeader, AppSidebar},
  props: {
    teamCode: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const state = reactive({
      teamName: '', // 초기값을 빈 문자열로 설정
      teamManagerName: '',
      salesMemberCode: 'salesMemberCode',
      modalOpen: false,
      tableColumns: [
        {title: "No", key: "id"},
        {title: "프로필사진", key: "profileImage"},
        {title: "이름", key: "name"},
        {title: "사원코드", key: "salesMemberCode"},
        {title: "직급", key: "rank"},
        {title: "팀", key: "teamName"},
        {title: "팀 코드", key: "teamCode"},
        {title: "이메일", key: "email"},
        {title: "모바일", key: "phone"},
        {title: "사무실", key: "officeAddress"},
      ],
      tableRows: [], // ref를 사용하여 반응형 데이터 생성
      rows: [],
      selectedItems: ref()
    });
    const fetchData = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

      axiosInstance.get(`${baseUrl}/api/team/detail/${props.teamCode}`)
        .then(response => {
          if (response.data && response.data.result) {
            const {
              teamName: fetchedTeamName,
              teamManagerName: fetchedTeamManagerName,
              teamMemberList
            } = response.data.result;
            // 데이터를 Vue 데이터에 할당
            state.teamName = fetchedTeamName; // API 응답에서 받은 값으로 할당
            state.teamManagerName = fetchedTeamManagerName;
            // 데이터를 가져온 후에 각 항목에 대한 ID를 추가
            teamMemberList.forEach((item, index) => {
              item.id = index + 1;
            });
            state.tableRows = teamMemberList;
          } else {
            console.error('Empty response or missing result data');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

      axiosInstance.get(`${baseUrl}/api/members/list/FP`)
        .then(response => {
          const data = response.data.result;
          console.log(data)
          data.forEach((item, index) => {
            item.id = index + 1;
          });
          // tableRows에 데이터를 할당합니다.
          state.rows = data;
        })
        .catch(error => {
          console.log('Error fetching data:', error);
        });
    };
    let teamMemberList;

    function handleSelectedItems(selectedItems) {
      if(selectedItems.length>0){
        this.selectedItems.teamCode = props.teamCode
      }
    }

    function isTeamMember(selectedItems){
      console.log("selectedItems :", selectedItems)
      // return selectedItems.some(item => item.teamCode === props.teamCode);
    }

    function toggleSelection(event, {item}) {
      console.log(item)
      console.log(item.selected)

      // if (!isTeamMember(item)) { // 팀원이 아닌 경우에만 선택 토글을 수행합니다.
      //   item.selected = !item.selected;
      // }
    }

    function navigateToDetail(event, {item}) {
      router.push({path: `/SalesMembersList/Detail/${item.salesMemberCode}`});
    }

    function navigateToAdd() {
      state.modalOpen = true ;
    }

    function closeModal() {
      state.modalOpen = false;
    }

    function save(){
      console.log(this.selectedItems)
      // try {
      //
      //   // localStorage.setItem('myData', JSON.stringify(this.selectedItems));
      //   console.log('등록 완료됐습니다.');
      // } catch (error) {
      //   console.error('저장에 실패했습니다:', error);
      // }
    }

    onMounted(() => {
      fetchData();
    });

    return {
      state,
      teamMemberList,
      handleSelectedItems,
      navigateToAdd,
      navigateToDetail,
      closeModal,
      isTeamMember,
      toggleSelection,
      save

    }
  },

}
</script>

<style scoped>

</style>
