"use client";

import { USER_NAME } from "@/config/const";
import { isLogin, removeItemLocalStorage, setItemLocalStorage } from "@/lib/helper";
import { removeAuthCookies, setAuthCookies } from "@/lib/helper/token";
import { loginFields, loginSchema } from "@/schema/loginForm";
import { useUserMe } from "@/services/hooks/hookAuth";
import { Box, Button, CloseButton, Dialog, Flex, Portal } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TypeOf } from "zod";
import { FormBase } from "./common/FormBase";
import { toaster } from "./ui/toaster";

type LoginFormType = TypeOf<typeof loginSchema>;

export default function Header() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const formMethodsRef = useRef<UseFormReturn<LoginFormType> | null>(null);
  const { getuserMe } = useUserMe();

  // 2. Hàm login (giữ nguyên)
  const handleLogin = async (data: LoginFormType) => {
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", data.user_ident);
      formData.append("password", data.password);

      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!res.ok) {
        formMethodsRef.current?.setError("user_ident", {
          type: "manual",
          message: "",
        });
        formMethodsRef.current?.setError("password", {
          type: "manual",
          message: "Tài khoản hoặc mật khẩu không khớp",
        });
        toaster.create({ type: "error", description: "Invalid credentials." });
        return;
      }

      const json = await res.json();
      const accessToken = json.access_token;

      if (accessToken) {
        // Lưu cookie (helper này sẽ set cookie tên access_token)
        setAuthCookies(accessToken, "null");
        try {
          const userInfo = await getuserMe({});

          if (userInfo) {
            setItemLocalStorage(USER_NAME, userInfo);

            toaster.create({ type: "success", description: "Login successful!" });
            setIsAuthenticated(true);

            setTimeout(() => router.push("/"), 100);
          } else {
            toaster.create({
              type: "error",
              description: "Failed to retrieve user information.",
            });
            console.warn("Missing user info:", userInfo);
          }
        } catch (infoErr) {
          console.error("Error fetching user info:", infoErr);
          toaster.create({
            type: "error",
            description: "Không thể lấy thông tin người dùng.",
          });
        }
      } else {
        formMethodsRef.current?.setError("user_ident", {
          type: "manual",
          message: "",
        });
        formMethodsRef.current?.setError("password", {
          type: "manual",
          message: "Tài khoản hoặc mật khẩu không khớp",
        });
        toaster.create({ type: "error", description: "Invalid credentials." });
      }
    } catch (error) {
      console.error("API error:", error);
      toaster.create({
        type: "error",
        description: "An error occurred during login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Hàm logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const rawCookies = document.cookie.split("; ").map((c) => c.split("="));
      const tokenEntry = rawCookies.find(([key]) => key === "access_token");
      const token = tokenEntry?.[1] ?? "";

      if (token) {
        await fetch("http://localhost:8000/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      removeAuthCookies();
      removeItemLocalStorage(null, { removeAll: true });
      router.push("/chat");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsAuthenticated(isLogin())
  }, [])
  

  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom">
      <Box
        as="header"
        px={6}
        position="sticky"
        top="0"
        zIndex="10"
        className="w-full bg-transparent"
      >
        <Flex align="center" justify="space-between">
          <Flex
            align="center"
            justify="center"
            width="150px"
            height="100px"
            overflow="hidden"
          >
            <Image
              src="/Logo3.png"
              alt="Logo Bác sĩ AI"
              width={150}
              height={150}
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Flex>

          {isAuthenticated ? (
            <Button fontSize="lg" onClick={handleLogout} loading={isLoading}>
              Logout
            </Button>
          ) : (
            <Dialog.Trigger asChild>
              <Button fontSize="lg">Login</Button>
            </Dialog.Trigger>
          )}
        </Flex>
      </Box>

      {/* Nếu user chưa login, dialog Login mới được render */}
      {!isAuthenticated && (
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
                  submitButtonClassName="w-full mt-8"
                  formMethodsRef={formMethodsRef}
                />
              </Dialog.Body>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top="8px" right="8px" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      )}
    </Dialog.Root>
  );
}
