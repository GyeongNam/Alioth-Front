<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container>
      <v-card class="mt-5" variant="outlined">
        <v-card-title class="headline">{{ board.title }}</v-card-title>
        <v-card-subtitle>
          <span>작성자 {{ board.memberId }}</span>
          <span class="grey--text"> | 작성일 {{ board.created_at }}</span>
        </v-card-subtitle>
        <v-card-text v-html="board.content"></v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text color="primary" @click="goBack">목록으로</v-btn>
          <v-btn text color="secondary" @click="editBoard">수정</v-btn>
          <v-btn text color="red" @click="deleteBoard">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import axiosInstance from '@/plugins/loginaxios';

export default {
  components: {AppHeader, AppSidebar},
  setup() {
    const board = ref({});
    const route = useRoute();
    const router = useRouter();
    const currentUser = ref(localStorage.getItem('userId')); // Assuming user ID is stored in localStorage
    const baseUrl = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
    

    const fetchBoardDetail = () => {
      const boardId = route.params.boardId;
      axiosInstance.get(`${baseUrl}/api/board/detail/${boardId}`)
        .then(response => {
        board.value = response.data.result;
      }).catch(error => {
        console.error('Error fetching board details:', error);
      });
    };

    const editBoard = () => {
      router.push(`/BoardList/Modify/${board.value.boardId}`);
    };

    const deleteBoard = () => {
      const boardId = board.value.boardId;
      if (confirm("게시글을 정말 삭제하시겠습니까?")) {
        axios.delete(`${baseUrl}/api/board/delete/${boardId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
          console.log(response);
          alert('게시글이 삭제되었습니다.');
          router.push('/BoardList');
        }).catch(error => {
          console.error('게시글 삭제 실패:', error);
          alert('게시글 삭제 실패: ' + error.message);
        });
      }
    };

    const isAuthor = computed(() => board.value.memberId === currentUser.value);

    onMounted(fetchBoardDetail);

    return { board, editBoard, deleteBoard, isAuthor, goBack: () => router.go(-1) };
  }
}
</script>

<style scoped>
.headline {
  font-size: 24px;
  font-weight: bold;
}
</style>
