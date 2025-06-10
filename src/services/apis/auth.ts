/* eslint-disable @typescript-eslint/no-explicit-any */
import { restTransport } from "@/lib/api";

const { get, post } = restTransport();

// User authentication
export const userLogin = async (body: any) => {
  return await post("/login", body);
};

export const userLogout = async (body?: any) => {
  return await post("/logout", body);
};

export const userMe = async () => {
  return await get("/user/me");
};

// Documents
export const addDocument = async (body: any) => {
  return await post("/documents/add", body);
};

// Chat
export const sendChat = async (body: any) => {
  return await post("/chat", body);
};

// Medical endpoints
export const medicalDetect = async (body: any) => {
  return await post("/medical/detect", body);
};

export const medicalClassify = async (body: any) => {
  return await post("/medical/classify", body);
};

export const medicalSegment = async (body: any) => {
  return await post("/medical/segment", body);
};