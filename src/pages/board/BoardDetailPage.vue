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
            <v-divider></v-divider>
          </v-card-subtitle>
        <v-card-text v-html="board.content"></v-card-text>
        <v-divider></v-divider>
        <div class="answers">
          <h4>답글</h4>
          <div v-for="answer in answers" :key="answer.answer_id" class="answer">
            <div>{{ answer.content }}</div>
              <v-btn small class="small-btn" @click="editAnswer(answer)">수정</v-btn>
              <!-- 데이터베이스에서 delyn으로 되고있어서 완전히 삭제가 안됨쓰  -->
            </div>
          <v-btn v-if="answers.length === 0 && !showInput" @click="showInputField">답글 작성</v-btn>
          <div v-if="showInput">
            <v-textarea v-model="newAnswer" placeholder="답글을 작성하세요"></v-textarea>
            <v-btn @click="submitAnswer">답글 등록</v-btn>
          </div>
          <div v-if="showSuccess">
            <v-alert type="success" dense>
              답변이 성공적으로 등록되었습니다! <v-icon>mdi-check-circle</v-icon>
            </v-alert>
          </div>
        </div>
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
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import axiosInstance from '@/plugins/loginaxios';

export default {
  components: {AppHeader, AppSidebar},
  data() {
    return {
      board: {},
      answers: [],
      newAnswer: '',
      currentUser: localStorage.getItem('userId'),
      baseUrl: import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:8080',
      showSuccess: false,
      showInput: false
    };
  },
  computed: {
    isAuthor() {
      return this.board.memberId === this.currentUser;
    }
  },
  methods: {
    fetchBoardDetail() {
      const boardId = this.$route.params.boardId;
      axiosInstance.get(`${this.baseUrl}/api/board/detail/${boardId}`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      }).then(response => {
        this.board = response.data.result;
        this.fetchAnswers(boardId);
      }).catch(error => {
        console.error('Error fetching board details:', error);
      });
    },
    showInputField() {
  this.showInput = true;
  console.log('Input field should be showing now');
}
,
    fetchAnswers(boardId) {
      axiosInstance.get(`${this.baseUrl}/api/answer/list/${boardId}`, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        }).then(response => {
          this.answers = response.data.result || [];
        }).catch(error => {
          if (error.response && error.response.status === 404) {
          this.answers = [];
        } else {
          console.error('Error fetching answers:', error);
        }
      });
    },
    editBoard() {
      this.$router.push(`/BoardList/Modify/${this.board.boardId}`);
    },
    deleteBoard() {
      const boardId = this.board.boardId;
      if (confirm("게시글을 정말 삭제하시겠습니까?")) {
        axiosInstance.delete(`${this.baseUrl}/api/board/delete/${boardId}`, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        }).then(response => {
          alert('게시글이 삭제되었습니다.');
          this.$router.push('/BoardList');
        }).catch(error => {
          alert('게시글 삭제 실패: ' + error.message);
        });
      }
    },
    submitAnswer() {
      if (!this.newAnswer) {
        alert("답글을 입력해주세요.");
        return;
      }
      const boardId = this.$route.params.boardId;
      axiosInstance.post(`${this.baseUrl}/api/answer/${boardId}/create`, {
        title: 'Response',
        content: this.newAnswer
      })
      .then(() => {
        this.newAnswer = '';
        this.showSuccess = true;
        this.showInput = false;
        this.fetchAnswers(boardId);
        localStorage.setItem('showSuccess', 'true');
      }).catch(error => {
        console.error('Error submitting answer:', error);
        this.showSuccess = false;
        localStorage.removeItem('showSuccess');
        alert('답글 등록 실패: ' + error.message);
      });
    },

    editAnswer(answer) {
      const answerId = answer.answer_id;
      const updateContent = prompt("답글을 수정하세요", answer.content);
      if (updateContent !== null && updateContent !== answer.content) {
        axiosInstance.patch(`${this.baseUrl}/api/answer/update/${answerId}`, {
          title: answer.title,
          content: updateContent
        }, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        }).then(() => {
          alert('답글이 수정되었습니다.');
          this.fetchAnswers(this.$route.params.boardId); 
        }).catch(error => {
          console.error('답글 수정 실패:', error);
          alert('답글 수정 실패: ' + error.message);
        });
      }
    },
    deleteAnswer(answer) {
      const answerId = answer.answer_id;
      if (confirm("이 답글을 정말 삭제하시겠습니까?")) {
        axiosInstance.delete(`${this.baseUrl}/api/answer/delete/${answerId}`,{
          headers: {Authorization: `Bearer ${this.accessToken}`}
        })
          .then(() => {
            alert('답글이 삭제되었습니다.');
            
            this.answers = this.answers.filter(a => a.answer_id !== answerId);  // 삭제된 답글을 배열에서 제거
            this.showInput = true;
            this.showSuccess = false;
            this.newAnswer = '';  // 입력창 초기화
          }).catch(error => {
            console.error('답글 삭제 실패:', error);
            alert('답글 삭제 실패: ' + error.message);
          });
      }
    },

    goBack() {
      localStorage.removeItem('showSuccess');
      this.$router.go(-1);
    }
  },
  mounted() {
    this.showSuccess = false;
  localStorage.removeItem('showSuccess');
  this.fetchBoardDetail();
  }
}
</script>

<style scoped>
.headline {
  font-size: 24px;
  font-weight: bold;
}
.answers {
  margin-top: 20px;
}
.answer {
  margin-bottom: 10px;
}
.small-btn {
  padding: 4px 8px;
  font-size: 0.75rem;
  min-width: auto;
}
</style>
