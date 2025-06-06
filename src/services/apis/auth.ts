/* eslint-disable @typescript-eslint/no-explicit-any */
import { restTransport } from "@/lib/api";

const { post, get, put } = restTransport();

export const userLogin = async (body: any) => {
  return await post("/user/signIn", body);
};

export const userMe = async (body: any) => {
  return await get("/user/me", body);
};

export const checkExistAccount = async (body: any) => {
  return await post("/user/checkExistAccount", body);
};

export const CreateAccount = async (body: any) => {
  return await post("/user/createAccount", body);
};

export const ChangePassword = async (body: any) => {
  return await put("/user/changeMyPassword", body);
};