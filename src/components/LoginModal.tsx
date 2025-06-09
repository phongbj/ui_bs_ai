"use client";

import React, { ReactNode, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { TypeOf } from "zod";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  Portal,
  CloseButton,
  Box,
} from "@chakra-ui/react";
import { loginSchema, loginFields } from "@/schema/loginForm";
import { FormBase } from "./common/FormBase";
import { useUserMe } from "@/services/hooks/hookAuth";
import { setAuthCookies } from "@/lib/helper/token";
import { setItemLocalStorage } from "@/lib/helper";
import { USER_NAME } from "@/config/const";
import { toaster } from "./ui/toaster";
import { useColorModeValue } from "./ui/color-mode";

export type LoginFormType = TypeOf<typeof loginSchema>;

interface LoginModalProps {
  onLoginSuccess?: () => void;
  children: ReactNode;  // Trigger element (button) passed in
}

export default function LoginModal({ onLoginSuccess, children }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formMethodsRef = useRef<UseFormReturn<LoginFormType> | null>(null);
  const { getuserMe } = useUserMe();
  const router = useRouter();

  const handleLogin = async (data: LoginFormType) => {
    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.user_ident);
      formData.append("password", data.password);

      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!res.ok) {
        formMethodsRef.current?.setError("password", {
          type: "manual",
          message: "Tài khoản hoặc mật khẩu không khớp",
        });
        toaster.create({ type: "error", description: "Invalid credentials." });
        return;
      }

      const { access_token } = await res.json();
      if (!access_token) throw new Error("No token returned");

      setAuthCookies(access_token, "null");
      const userInfo = await getuserMe({});
      if (userInfo) {
        setItemLocalStorage(USER_NAME, userInfo);
        toaster.create({ type: "success", description: "Login successful!" });
        onLoginSuccess?.();
        router.push("/");
      } else {
        toaster.create({
          type: "error",
          description: "Không thể lấy thông tin người dùng.",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toaster.create({
        type: "error",
        description: "Có lỗi xảy ra khi đăng nhập.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Semi-transparent backdrop color
  
  const backdropStyle = { backgroundColor: "rgba(0, 0, 0, 0.5)" };
  // Modal content background
  const contentBg = useColorModeValue("rgba(255, 255, 255, 0.4)", "rgba(0, 0, 0, 0.8)");

  return (
    <Dialog.Root placement={"center"}>
      {children}

      <Portal>
        <Dialog.Backdrop style={backdropStyle} />
        <Dialog.Positioner>
          <Dialog.Content
            style={{
              background: contentBg,
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              paddingBottom: "24px",
              paddingLeft: "24px",
              paddingRight: "24px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <Box position="relative">
              <Dialog.Header>
                <Dialog.Title>Đăng nhập</Dialog.Title>
              </Dialog.Header>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="sm"
                  position="absolute"
                  top="0px"
                  right="-24px"
                  className="hover:bg-[#FFFFFFC4]! rounded-xl!"
                />
              </Dialog.CloseTrigger>
            </Box>

            <Dialog.Body>
              <FormBase
                schema={loginSchema}
                fields={loginFields}
                onSubmit={handleLogin}
                columns={1}
                isSubmitting={isLoading}
                submitButtonText="Đăng Nhập"
                formMethodsRef={formMethodsRef}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}