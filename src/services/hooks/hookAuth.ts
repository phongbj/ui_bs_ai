
import { ChangePassword, checkExistAccount, CreateAccount, userLogin, userMe } from "../apis/auth";
import { usePostAPI, useGetAPI, usePutAPI } from "./hookApi";

const useUserLogin = () => {
  const {
    loading,
    post: postUserLogin,
    error,
    setError,
  } = usePostAPI(userLogin);
  return {
    loading,
    postUserLogin,
    error,
    setError,
  };
};

const useUserMe = () => {
  const {
    loading,
    get: getuserMe,
    error,
    setError,
  } = useGetAPI(userMe);
  return {
    loading,
    getuserMe,
    error,
    setError,
  };
};

const useUserCheckExistAccount = () => {
  const {
    loading,
    post: postUserCheckExistAccount,
    error,
    setError,
  } = usePostAPI(checkExistAccount);
  return {
    loading,
    postUserCheckExistAccount,
    error,
    setError,
  };
};

const useUserCreateAccount = () => {
  const {
    loading,
    post: postUserCreateAccount,
    error,
    setError,
  } = usePostAPI(CreateAccount);
  return {
    loading,
    postUserCreateAccount,
    error,
    setError,
  };
};

const useUserChangePassword = () => {
  const {
    loading,
    put: putUserChangePassword,
    error,
    setError,
  } = usePutAPI(ChangePassword);
  return {
    loading,
    putUserChangePassword,
    error,
    setError,
  };
};

export { useUserLogin, useUserMe, useUserCheckExistAccount, useUserCreateAccount, useUserChangePassword };
