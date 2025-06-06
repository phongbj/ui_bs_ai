"use client";

import { ROLE_VALUE, USER_NAME } from "@/config/const";
import { setItemLocalStorage } from "@/lib/helper";
import { setAuthCookies } from "@/lib/helper/token";
import { loginFields, loginSchema } from "@/schema/loginForm";

import { Box, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { FormBase } from "../common/FormBase";
import { UseFormReturn } from "react-hook-form";
import { TypeOf } from "zod";
import { useUserLogin, useUserMe } from "@/services/hooks/hookAuth";

type LoginFormType = TypeOf<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { postUserLogin } = useUserLogin();
  const { getuserMe } = useUserMe();

  const [isLoading, setIsLoading] = useState(false);
  const formMethodsRef = useRef<UseFormReturn<LoginFormType> | null>(null);

  const handleLogin = async (data: LoginFormType) => {
    setIsLoading(true);

    try {
      const res = await postUserLogin({
        user_ident: data.user_ident,
        password: data.password,
      });

      if (res?.data?.accessToken) {
        setAuthCookies(res.data.accessToken, res.data.refreshToken);

        const userInfo = await getuserMe({});
        const roleValue = userInfo?.user_role ?? userInfo?.user_role_id;
        const userName = userInfo?.user_name;

        if (roleValue && userName) {
          setItemLocalStorage(ROLE_VALUE, roleValue.toString());
          setItemLocalStorage(USER_NAME, userName);


          setTimeout(() => router.push("/"), 100);
        } else {

          console.warn("Missing user info:", userInfo);
        }
      } else {
        formMethodsRef.current?.setError("user_ident", {
          type: "manual",
          message: "",
        });

        formMethodsRef.current?.setError("password", {
          type: "manual",
          message: "이메일 또는 비밀번호가 일치하지 않습니다.",
        });

      }
    } catch (error) {
      console.error("API error:", error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center mx-6">
      <VStack>
        <Heading fontWeight={700} className="text-center text-3xl mb-4">
          Matrix-AI-Solutions
        </Heading>

        <Box className="max-w-[25rem] min-w-[22.3rem] border border-gray-200 rounded-lg shadow-lg">
          <Box className="md:px-18 py-4 space-y-2">
            <Heading fontWeight={400} className="text-center text-base">
              Login to Your Account
            </Heading>
            <Heading
              fontWeight={400}
              className="text-center text-neutral-700 text-sm md:whitespace-nowrap"
            >
              이메일 & 비밀번호를 입력해 로그인하세요.
            </Heading>
          </Box>

          <Box className="border-b w-full" />

          <Box className="p-6">
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

            <Text className="flex text-neutral-700 text-sm justify-center mt-4">
              계정이 없으신가요?
              <Link
                className="mx-2 text-primary-400 underline decoration-1 underline-offset-2"
                href="/createAccount"
              >
                계정 만들기
              </Link>
            </Text>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
