// import request from '@/utils/request'
// import axios from 'axios'
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://localhost:8000';

export function login(data) {
  // return request({ url: '/login',
  //   method: 'post',
  //   data
  // })
 
  // })
  
}

export function getInfo(token) {
  return request({
    url: '/api/user',
    method: 'get',
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/frontend/user/logout',
    method: 'post'
  })
}
