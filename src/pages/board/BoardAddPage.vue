<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <div class="text-center">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="announcement.title"
            :rules="titleRules"
            label="제목"
            required
          ></v-text-field>
          <v-textarea
            v-model="announcement.content"
            :rules="contentRules"
            label="내용"
            required
          ></v-textarea>
          <v-btn :disabled="!valid" @click="submitAnnouncement">
            공지사항 추가
          </v-btn>
        </v-form>
      </div>
    </v-container>
  </v-main>
</template>

<script>
import axios from 'axios';
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import axiosInstance from '@/plugins/loginaxios';

export default {
  components: {AppHeader, AppSidebar},
  data() {
    return {
      valid: true,
      announcement: {
        title: '',
        content: ''
      },
      titleRules: [
        v => !!v || '제목은 필수 입력 사항입니다.',
        v => (v && v.length <= 100) || '제목은 100자 이내여야 합니다.'
      ],
      contentRules: [
        v => !!v || '내용은 필수 입력 사항입니다.'
      ]
    };
  },
  methods: {
    submitAnnouncement() {
      if (this.$refs.form.validate()) {
        const baseUrl = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
        const apiUrl = `${baseUrl}/api/board/create`;
        
        
        const payload = {
          title: this.announcement.title,
          content: this.announcement.content,
          boardType: 'ANNOUNCEMENT'
        };

        axiosInstance.post(apiUrl, payload)
        .then(response => {
          alert('공지사항이 추가되었습니다.'); 
          this.resetForm();
        })
        .catch(error => {
          console.error('공지사항 추가 중 오류가 발생했습니다', error);
          alert('오류가 발생했습니다.');
        });
      }
    },
    resetForm() {
      this.announcement.title = '';
      this.announcement.content = '';
      this.$refs.form.resetValidation();
      this.$router.push('/BoardList');
    }
  }
}
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
