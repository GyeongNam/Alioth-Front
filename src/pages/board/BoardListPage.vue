<template>
  <AppHeader></AppHeader>
  <AppSidebar></AppSidebar>
  <div>
    <v-divider></v-divider>
    <p v-if="model === '공지사항'">공지사항 게시판</p>
    <p v-else>건의사항 게시판</p>
    <v-divider></v-divider>
    <v-btn @click="toggleBoard" color="primary">{{ model }}</v-btn>
    <p>
      <v-btn color="success" @click="navigateToWritePage">
        {{ model === '공지사항' ? '공지사항 글쓰기' : '건의사항 글쓰기' }}
      </v-btn>
      <!-- 예시 글 버튼 추가 -->
    </p>
    <p>
      <v-btn color="info" @click="navigateToDetailPage">
        {{ model === '공지사항' ? '공지사항 예시 글' : '건의사항 예시 글' }}
      </v-btn>
    </p>
  </div>
  <v-switch
    v-model="model"
    :label="`게시판을 선택하세요: ${model}`"
    false-value="공지사항"
    true-value="건의사항"
    hide-details
  ></v-switch>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import { useRouter } from 'vue-router';
import { axiosInstance } from '@/boot/axios'

export default {
  components: { AppHeader, AppSidebar },
  setup() {
    const router = useRouter();
    const model = ref('공지사항'); // 기본값을 '공지사항'으로 설정

    const navigateToWritePage = () => {
      // model 값에 따라 적절한 경로로 이동
      if (model.value === '공지사항') {
        router.push('/BoardList/Add');
      } else {
        router.push('/BoardList/SuggestionBoardAdd');
      }
    };

    const navigateToDetailPage = () => {
      // model 값에 따라 적절한 상세 페이지로 이동
      if (model.value === '공지사항') {
        router.push('/BoardList/Detail');
      } else {
        router.push('/BoardList/SuggestionBoardDetail');
      }
    };

    const toggleBoard = () => {
      model.value = model.value === '공지사항' ? '건의사항' : '공지사항';
    };

    return { model, navigateToWritePage, navigateToDetailPage, toggleBoard };
  },
  async created() {
    console.log("클릭하자마자 나오는 게시판리스트 테스트용 로그")

    await axiosInstance.get("localhost:8080/api/board/list")
    .then(res => {
      console.log("게시판 리스트 요청")
      console.log(res)
    })
    .catch(error => {
      console.log(error)
    })

  }


};
</script>

<style scoped>
</style>
