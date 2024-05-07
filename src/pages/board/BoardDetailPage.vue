<template>
  <AppSidebar></AppSidebar>
  <v-container fluid>
    <v-main>
      <AppHeader></AppHeader>
      <v-card class="mt-5" outlined>
        <v-row>
          <v-card-title class="headline" style="margin-top: 0.5vw; font-family: 'Spoqa Han Sans Neo'">{{
              board.title
            }}
          </v-card-title>
          <v-col class="text-right">
            <v-btn variant="tonal" color="#2979FF" style="margin-right: 0.5vw; margin-top: 0.5vw" @click="editBoard">수정</v-btn>
            <v-btn variant="tonal" color="primary" style="margin-right: 1vw; margin-top: 0.5vw" @click="deleteBoard">삭제</v-btn>
          </v-col>
        </v-row>
        <v-card-subtitle class="text-right" style="margin-top: 0.5vw;">
          <span> 작성자 {{ board.salesMemberName}}</span>
          <span class="grey--text"> | 작성일 {{ board.created_at }}</span>
        </v-card-subtitle>
        <v-card-text v-html="board.content"></v-card-text>
      </v-card>

      <v-card style="margin-top: 1vw" v-if="board.boardType === 'SUGGESTION'">
        <div v-for="answer in answers" :key="answer.answerId">
          <v-card-subtitle class="text-right" style="margin-bottom: 1vw">
            <span> 작성자 {{ answer.answerMemberName }} |  작성시간 {{ answer.created_at }}</span>
          </v-card-subtitle>
          <div v-html="answer.content"></div>
        </div>
          <v-row>
            <v-col>
              <v-card-title style="font-family: 'Spoqa Han Sans Neo'">{{ answer.title }}</v-card-title>
            </v-col>
            <v-col>
              <v-col class="text-right">
                <v-btn small class="small-btn" variant="tonal" color="#2979FF" @click="openEditModal(answers)"
                       style="margin-top: 0.5vw; margin-right: 0.5vw"
                       v-if="loginStore.memberCode.toString()===answer.memberCode.toString()"> 답변 수정
                </v-btn>
                <v-btn small class="small-btn" variant="tonal" color="primary" style="margin-top: 0.5vw;"
                       v-if="loginStore.memberCode.toString()===answer.memberCode.toString()" @click="deleteAnswer">답변 삭제
                </v-btn>
              </v-col>
            </v-col>
          </v-row>
          <v-divider></v-divider>


          <v-dialog v-model="showModal" persistent max-width="600px">
            <v-card>
              <v-row>
                <v-col>
                  <v-card-title class="text-left" style="font-family: 'Spoqa Han Sans Neo'"> 답글 작성</v-card-title>
                </v-col>
                <v-col class="text-right">
                  <v-btn variant="flat" @click="showModal = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-card-text>
                <Editor @update:content="updateContent" :initialContent="newAnswer"/>
              </v-card-text>
              <v-card-actions>
                <v-col class="text-right">
                  <v-btn variant="tonal" color="#2979FF" @click="submitAnswer">답글 등록</v-btn>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <div v-if="showSuccess">
            <v-alert class="success-alert" dense>
              <template #prepend>
                <v-icon large>mdi-check-circle</v-icon>
              </template>
              답변이 완료된 게시글입니다.
            </v-alert>
          </div>
      </v-card>
      <v-dialog v-model="editModalVisible" persistent max-width="600px">
        <v-card>
          <v-row>
            <v-col>
              <v-card-title style="font-family: 'Spoqa Han Sans Neo'">
                답글 수정
              </v-card-title>
            </v-col>

            <v-col class="text-right">
              <v-btn variant="flat" @click="closeEditModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-card-text>
            <Editor @update:content="updateEditContent" :initialContent="editContent"/>
          </v-card-text>
          <v-card-actions>
            <v-col class="text-right">
              <v-btn variant="tonal" color="#2979FF" @click="confirmEdit">수정</v-btn>
              <!--                <v-btn variant="tonal" color="#2C3E50" style="margin-right:1vw" @click="showModal = false"> 닫기 </v-btn>-->
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn color="#424242" variant="tonal" style="margin-top:1vw" @click="goBack">목록으로</v-btn>
      <v-col class="text-right">
        <v-btn variant="tonal" color="#1A237E" v-if="answers.length === 0 && !showModal" @click="showModal = true">답글
          작성
        </v-btn>
      </v-col>
    </v-main>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'; // Vue 3의 ref와 onMounted를 불러옵니다.
import { useRoute, useRouter } from 'vue-router'; // Vue 3의 useRoute와 useRouter를 불러옵니다.
import axiosInstance from '@/plugins/loginaxios';
import Editor from "@/layouts/Editor.vue";
import { useLoginInfoStore } from "@/stores/loginInfo";

export default {
  components: { Editor },
  props: ["boardId"],
  setup(props) {
    const board = ref({});
    const answers = ref([]);
    const newAnswer = ref('');
    const currentUser = localStorage.getItem('userId');
    const baseUrl = import.meta.env.VITE_API_SERVER_BASE_URL || 'http://localhost:8080';
    const showSuccess = ref(false);
    const showModal = ref(false);
    const editModalVisible = ref(false);
    const editContent = ref('');
    const currentEditingId = ref(null);
    const editTitle = ref('');
    const submitting = ref(false);
    const loginStore = useLoginInfoStore(); // Vue 3에서는 이렇게 직접 호출해야 합니다.

    const fetchBoardDetail = () => {
      axiosInstance.get(`${baseUrl}/api/board/detail/${props.boardId}`)
        .then(response => {
          board.value = response.data.result;
          fetchAnswers(board.value.id);
          showSuccess.value = false;
        }).catch(error => {
        console.error('Error fetching board details:', error);
      });
    };

    const fetchAnswers = (boardId) => {
      axiosInstance.get(`${baseUrl}/api/answer/list/${boardId}`)
        .then(response => {
          answers.value = response.data.result || [];
        }).catch(error => {
        if (error.response && error.response.status === 404) {
          answers.value = [];
        } else {
          console.error('Error fetching answers:', error);
        }
      });
    };

    const editBoard = () => {
      router.push(`/BoardList/Modify/${board.value.boardId}`);
    };

    const deleteBoard = () => {
      const boardId = board.value.boardId;
      if (confirm("게시글을 정말 삭제하시겠습니까?")) {
        axiosInstance.delete(`${baseUrl}/api/board/delete/${boardId}`)
          .then(() => {
            alert('게시글이 삭제되었습니다.');
            router.push('/BoardList');
          }).catch(error => {
          alert('게시글 삭제 실패: ' + error.message);
        });
      }
    };

    const submitAnswer = () => {
      if (submitting.value) {
        alert("처리 중입니다. 잠시만 기다려주세요.");
        return;
      }
      if (!newAnswer.value.trim()) {
        alert("답글을 입력해주세요.");
        return;
      }

      submitting.value = true;
      const boardId = route.params.boardId;

      axiosInstance.post(`${baseUrl}/api/answer/${boardId}/create`, {
        title: 'Response',
        content: newAnswer.value
      })
        .then(() => {
          newAnswer.value = '';
          showSuccess.value = true;
          fetchAnswers(boardId);
          showModal.value = false;
        }).catch(error => {
        console.error('Error submitting answer:', error);
        alert('답글 등록 실패: ' + (error.message && error.response.data.message ? error.response.data.message : '서버 에러'));
      }).finally(() => {
        submitting.value = false;
      });
    };

    const confirmEdit = () => {
      const requestData = {
        content: editContent.value,
        title: editTitle.value
      };

      axiosInstance.patch(`${baseUrl}/api/answer/update/${currentEditingId.value}`, {
        content: editContent.value
      })
        .then(() => {
          alert('답글이 수정되었습니다.');
          fetchAnswers(board.value.boardId);
          editModalVisible.value = false;
        })
        .catch(error => {
          console.error('답글 수정 실패:', error);
          alert('답글 수정 실패: ' + error.message);
        });
    };

    const deleteAnswer = (answer) => {
      const answerId = answer.answer_id;
      if (confirm("이 답글을 정말 삭제하시겠습니까?")) {
        axiosInstance.delete(`${baseUrl}/api/answer/delete/${answerId}`)
          .then(() => {
            alert('답글이 삭제되었습니다.');
            answers.value = answers.value.filter(a => a.answer_id !== answerId);
            showInput.value = true;
            showSuccess.value = false;
            newAnswer.value = '';
          }).catch(error => {
          console.error('답글 삭제 실패:', error);
          alert('답글 삭제 실패: ' + error.message);
        });
      }
    };

    const goBack = () => {
      // 건의사항 게시판에서 '뒤로가기'를 클릭했을 때
      if (board.value.boardType === 'SUGGESTION') {
        router.push({ path: '/BoardList', query: { type: 'Suggestion' } });
      } else {
        router.push({ path: '/BoardList', query: { type: 'Announcement' } });
      }
    };

    onMounted(() => {
      fetchBoardDetail();
    });

    return {
      board,
      answers,
      newAnswer,
      currentUser,
      baseUrl,
      showSuccess,
      showModal,
      editModalVisible,
      editContent,
      currentEditingId,
      editTitle,
      submitting,
      loginStore,
      editBoard,
      deleteBoard,
      submitAnswer,
      confirmEdit,
      deleteAnswer,
      goBack
    };
  }
}
</script>

<style scoped>
.headline {
  font-size: 24px;
  font-weight: bold;
}

.answer {
  margin-bottom: 10px;
}

.small-btn {
  padding: 4px 8px;
  font-size: 0.75rem;
  min-width: auto;
}

.success-alert {
  border-left: 5px solid green;
  color: green;
}
</style>

