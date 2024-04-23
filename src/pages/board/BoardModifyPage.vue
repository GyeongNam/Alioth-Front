<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <v-card>
        <v-card-title class="headline">공지사항 및 건의사항 수정</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="board.title" label="제목" outlined dense></v-text-field>
            <v-textarea v-model="board.content" label="내용" outlined rows="10" dense></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateBoard">저장</v-btn>
          <v-btn color="error" @click="goBack">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/plugins/loginaxios';

export default {
  components: {AppHeader, AppSidebar},
  
  setup() {
    const board = ref({ title: '', content: '' });
    const route = useRoute();
    const router = useRouter();
    const baseUrl = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

    const fetchBoardDetails = () => {
      const boardId = route.params.boardId;
      axiosInstance.get(`${baseUrl}/api/board/detail/${boardId}`).then(response => {
        board.value = response.data.result;
      }).catch(error => {
        console.error('게시판 상세 정보를 가져오는데 실패했습니다:', error);
        // Handle error or redirect
      });
    };

    const updateBoard = () => {
      const boardId = route.params.boardId;
      axiosInstance.patch(`${baseUrl}/api/board/update/${boardId}`, {
        title: board.value.title,
        content: board.value.content
      })
      .then(response => {
        alert('공지사항이 수정되었습니다.');
        router.push('/BoardList');
      }).catch(error => {
        console.error('게시판 수정 실패:', error);
        alert('수정 실패: ' + (error.response ? error.response.data.message : '서버 응답 없음'));
      });
    };

    const goBack = () => {
      router.go(-1);
    };

    fetchBoardDetails();

    return { board, updateBoard, goBack };
  }
}
</script>

<style scoped>
.headline {
  font-size: 24px;
  font-weight: bold;
}
</style>
