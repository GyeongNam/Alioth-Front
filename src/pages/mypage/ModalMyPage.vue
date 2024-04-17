<!-- ModalComponent.vue -->
<template>
  <div class="modal-container">
    <div class="modal-content">
      <div class="back-button">
        <button class="back-button-content" @click="closeMyPageModal">
          ⬅︎ BACK
        </button>
      </div>
        <div class="login-window">
        <div class="title">정보 수정</div>
        <div class="form-field">
          <label for="email">이메일</label>
          <input @keypress.enter="doLogin" type="email" v-model="email" placeholder="이메일을 입력해주세요." />
        </div>
        <div class="form-field">
          <label for="password">연락처</label>
          <input @keypress.enter="doLogin" type="tel" v-model="phoneNumber" placeholder="연락처 입력해주세요." />
        </div>
        
        <div class="non-author">
        <button class="signup-text" @click="updateMypage">수정하기</button>

        <!-- <ModalComponent ref="modalContainer"></ModalComponent> -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/plugins/loginaxios";

export default {
  props:[],
  data() {
    return {
      email: "",
      phoneNumber: "",
    };
  },
  methods: {
    openSignupModal() {
      
    },
    closeMyPageModal() {
      this.$emit('closeMyPageModal');
    },
    updateMypage() {
      console.log("회원정보 업데이트 요청");
      console.log(this.email);
      console.log(this.phoneNumber);
    },
    handleModalClick(event) {
      // 모달 배경 클릭 시 모달 닫기
      if (event.target === this.$el) {
        this.$emit('closeModal');
      }
    },
  },
};
</script>

<style scoped>

.modal-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 30%;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.back-button {
  margin-bottom: 10px;
}

.back-button-content {
  color: #8692A6;
  font-size: 16px;
  font-family: Inter;
  font-weight: 600;
  word-wrap: break-word;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}
</style>
