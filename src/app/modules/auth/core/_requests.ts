import axios from "axios";
import { AuthModel, UserModel } from "./_models";
import { GoogleAuthProvider, getAuth, signInWithCredential, signInWithPopup } from "firebase/auth";
import { string } from "yup";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/auth/loginWithToken`;
export const LOGIN_URL = `${API_URL}/auth/login`;
export const REGISTER_URL = `${API_URL}/auth/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post(LOGIN_URL, {
    email,
    password,
  });
}

// Server should return AuthModel
export function register(email: string, username: string, password: string) {
  return axios.post(REGISTER_URL, {
    email,
    username: username,
    password,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  console.log(token);
  return axios.post(GET_USER_BY_ACCESSTOKEN_URL, {
    token: token,
  });
}

export function getUserData(firebaseUserId: string, token: string) {
  return axios.get(`${API_URL}/auth/get-user-data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      firebaseUserId: firebaseUserId,
    },
  });
}

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    const token = result.user.getIdToken();
    console.log((await token).toString())
    const userToken = (await token).toString();
    return userToken;
  } catch (error) {
    console.log(error)
  }
};
