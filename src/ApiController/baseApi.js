import axios from 'axios';


const API = "http://localhost:55494/";

export const post = (url, body) => axios.post(`${API}${url}`, body);
export const put = (url, body, token) => axios.put(`${API}${url}`, body, {headers:{"Authorization": `Bearer ${token}`}});
export const get = url => axios.get(`${API}${url}`);
export const del = url => axios.get(`${API}${url}`);
  




