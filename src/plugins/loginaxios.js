import axios from "axios";

export default {
  install: (app) => {
    // Vue 앱의 프로토타입에 axios를 등록하여 전역에서 사용할 수 있도록 함
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:8080',
    });

    axiosInstance.interceptors.request.use(
      config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          if(
            error.response.data.message === "다시 로그인해 주세요."
            && error.response.data.result === "로그인 만료"
          ){
            localStorage.removeItem('accessToken');

          }
          else if(error.response.data.message === "토큰을 재발행 합니다."){
            localStorage.setItem('accessToken' ,error.response.data.result);
            originalRequest.headers.Authorization = `Bearer ${error.response.data.result}`;
            return axiosInstance(originalRequest);
          }else{
            localStorage.removeItem('accessToken');

          }
          originalRequest._retry = true;
          console.log(error);

        }
        return Promise.reject(error);
      }
    );

    app.config.globalProperties.$axiosInstance = axiosInstance;
  }
};





