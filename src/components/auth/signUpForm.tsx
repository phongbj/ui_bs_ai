/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signUpFields, signUpSchema } from "@/schema/signUpForm";
import { useUserCheckExistAccount, useUserCreateAccount, useUserMe } from "@/services/hooks/hookAuth";
import { Box, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormBase } from "../common/FormBase";
import { setAuthCookies } from "@/lib/helper/token";
import { setItemLocalStorage } from "@/lib/helper";
import { ROLE_VALUE, USER_NAME } from "@/config/const";
import { Toaster, toaster } from "@/components/ui/toaster"; // 👈 Thêm dòng này

export default function CreateAccountForm() {
  const router = useRouter();
  const { postUserCheckExistAccount } = useUserCheckExistAccount();
  const { postUserCreateAccount } = useUserCreateAccount();
  const { getuserMe } = useUserMe();
  const [ isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: any) => {
    setIsLoading(true);

    try {
      const res = await postUserCheckExistAccount({ user_ident: data.user_ident });

      if (res?.data?.isExist) {
        toaster.create({
          type: "error",
          description: "이미 등록된 이메일입니다.",
        });
        return;
      }

      const response = await postUserCreateAccount({
        name: data.name,
        user_ident: data.user_ident,
        password: data.password,
      });

      if (response?.data?.accessToken) {
        setAuthCookies(response.data.accessToken, response.data.refreshToken);

        const userInfo = await getuserMe({});
        if (!userInfo) return;

        const roleValue = userInfo?.user_role || userInfo?.user_role_id;
        const userName = userInfo?.user_name;
        if (roleValue && userName) {
          setItemLocalStorage(ROLE_VALUE, roleValue.toString());
          setItemLocalStorage(USER_NAME, userName);

          toaster.create({
            type: "success",
            description: "SignUp successful!",
          });

          setTimeout(() => {
            router.push("/");
          }, 100);
        }
      } else {
        toaster.create({
          type: "error",
          description: "계정 생성에 실패했습니다.",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toaster.create({
        type: "error",
        description: "계정 생성 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center mx-6">
      <VStack>
        <Box className="max-w-[25rem] min-w-[22.3rem] border border-gray-200 rounded-lg shadow-lg">
          <Box className="md:px-18 py-4 space-y-2">
            <Heading fontWeight={400} className="text-center text-base">Create an Account</Heading>
            <Heading fontWeight={400} className="text-center text-neutral-700 text-sm md:whitespace-nowrap">
              계정생성에 필요한 개인정보를 입력해주세요.
            </Heading>
          </Box>
          <Box className="border-b w-full"></Box>
          <Box className="p-6">
            <Box className="">
              <FormBase
                schema={signUpSchema}
                fields={signUpFields}
                onSubmit={handleLogin}
                columns={1}
                isSubmitting={isLoading}
                submitButtonText="Create Account"
                submitButtonClassName="w-full mt-8"
              />
            </Box>
            <Text className="flex text-neutral-700 text-sm justify-center mt-4">
              이미 계정이 있으신가요?
              <Link
                className="mx-2 text-primary-400 underline decoration-1 underline-offset-2"
                href="/login"
              >
                Log in
              </Link>
            </Text>
          </Box>
        </Box>
      </VStack>
      <Toaster />
    </Box>
  );
}
