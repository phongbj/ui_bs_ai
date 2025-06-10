import {
  userLogin,
  userLogout,
  userMe,
  addDocument,
  sendChat,
  medicalDetect,
  medicalClassify,
  medicalSegment,
} from "../apis/auth";
import { useGetAPI, usePostAPI } from "./hookApi";

export const useUserLogin = () => {
  const { loading, post, error, setError } = usePostAPI(userLogin);
  return { loading, login: post, error, setError };
};

export const useUserLogout = () => {
  const { loading, post, error, setError } = usePostAPI(userLogout);
  return { loading, logout: post, error, setError };
};

export const useUserMe = () => {
  const { loading, get, error, setError } = useGetAPI(userMe);
  return { loading, getUserMe: get, error, setError };
};

export const useAddDocument = () => {
  const { loading, post, error, setError } = usePostAPI(addDocument);
  return { loading, addDocument: post, error, setError };
};

export const useChat = () => {
  const { loading, post, error, setError } = usePostAPI(sendChat);
  return { loading, sendChat: post, error, setError };
};

export const useMedicalDetect = () => {
  const { loading, post, error, setError } = usePostAPI(medicalDetect);
  return { loading, medicalDetect: post, error, setError };
};

export const useMedicalClassify = () => {
  const { loading, post, error, setError } = usePostAPI(medicalClassify);
  return { loading, medicalClassify: post, error, setError };
};

export const useMedicalSegment = () => {
  const { loading, post, error, setError } = usePostAPI(medicalSegment);
  return { loading, medicalSegment: post, error, setError };
};