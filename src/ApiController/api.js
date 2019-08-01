import * as baseApi from './baseApi';

const USERREGISTERAPI = "api/user/register";
const LOGUSER = "api/user/login";
const USEREDITAPI = "api/user/edit";
const USERPROFILE = "api/user/myprofile";
const TOTALCALORIES = "api/health/totalcalories";
const CREATEMEAL = "api/meal/create";
const DELETEMEAL = "api/meal/delete/";

export const registerUser = body => baseApi.post(USERREGISTERAPI, body);
export const logUser = body => baseApi.post(LOGUSER, body);
export const editUser = (body, token) => baseApi.put(USEREDITAPI, body, token);
export const getUserProfile = token => baseApi.get(USERPROFILE, token);
export const getTotalCalories = token => baseApi.get(TOTALCALORIES, token);
export const createMeal = (body, token) => baseApi.post(CREATEMEAL, body, token);
export const deleteMeal = (mealId, token) => baseApi.del(`${DELETEMEAL}${mealId}`, token);
   


   



