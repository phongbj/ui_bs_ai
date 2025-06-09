"use client";

import React, { ReactNode, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { TypeOf } from "zod";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { loginSchema, loginFields } from "@/schema/loginForm";
import { FormBase } from "./common/FormBase";
import { useUserMe } from "@/services/hooks/hookAuth";
import { setAuthCookies } from "@/lib/helper/token";
import { setItemLocalStorage } from "@/lib/helper";
import { USER_NAME } from "@/config/const";
import { toaster } from "./ui/toaster";

export type LoginFormType = TypeOf<typeof loginSchema>;

interface LoginModalProps {
  onLoginSuccess?: () => void;
  children: ReactNode;  // đây sẽ là Trigger (button) do Header truyền vào
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

  return (
    <Dialog.Root>
      {children}

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Đăng nhập</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <FormBase
                schema={loginSchema}
                fields={loginFields}
                onSubmit={handleLogin}
                columns={1}
                isSubmitting={isLoading}
                submitButtonText="Login"
                formMethodsRef={formMethodsRef}
              />
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                position="absolute"
                top="8px"
                right="8px"
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
