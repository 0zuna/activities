//import axios from 'axios'
//window.axios = require('axios');
//import axios from "axios";
//window.axios=axios

window.axios =require('axios');


//const AUTH_TOKEN = localStorage.getItem('access_token');
//axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
//window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//window.axios.defaults.headers.common['content-type'] = "multipart/form-data; charset=utf-8; boundary=" + Math.random().toString().substr(2);
//window.axios.defaults.baseURL = 'http://10.0.0.88/usupso/activities/activity/public/';
window.axios.defaults.baseURL = 'http://dimitri/usupso/activities/activity/public/';
window.axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
export const axios = window.axios;

/*export const axi= axios.create({
baseURL: 'http://dimitri/usupso/activities/activity/public/',
  headers: {
      'Content-Type': 'application/json',
      'X-Requested-With':'XMLHttpRequest',
      'Authorization':localStorage.getItem('access_token'),
    },
});*/
