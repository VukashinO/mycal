import axios from 'axios';


const API = "http://localhost:55494/";

export const post = (url, body, token) => {
        
    try  {
        return axios.post(`${API}${url}`, body, {headers:{"Authorization": `Bearer ${token}`}});
    }
    catch (error) {
         return error;
    }
} 

export const put = (url, body, token) => {
    try {
        return axios.put(`${API}${url}`, body, {headers:{"Authorization": `Bearer ${token}`}});
    } 
    catch (error) {
        return error;
    }
} 

export const get = (url, token) => {
    try {
        return axios.get(`${API}${url}`, {headers:{"Authorization": `Bearer ${token}`}});
    } 
    catch (error) {
        return error;
    }
}

export const del = (url, token) => {
    try {
      return axios.delete(`${API}${url}`, {headers:{"Authorization": `Bearer ${token}`}});
    } 
    catch (error) {
      return error;  
    }
} 
  





