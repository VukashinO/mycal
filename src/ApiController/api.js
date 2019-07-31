import * as baseApi from './baseApi';


const USERREGISTERAPI = "api/user/register";
const USEREDITAPI = "api/user/edit";

export const registerUser = body => baseApi.post(USERREGISTERAPI, body);
export const editUser = (body, token) => baseApi.put(USEREDITAPI, body, token);
   


   



