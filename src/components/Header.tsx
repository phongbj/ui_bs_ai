"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Text,
  Dialog,
} from "@chakra-ui/react";
import Image from "next/image";

import { isLogin, removeItemLocalStorage } from "@/lib/helper";
import { removeAuthCookies } from "@/lib/helper/token";
import { USER_NAME } from "@/config/const";
import LoginModal from "./LoginModal";

export default function Header() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="))
        ?.split("=")[1];
      if (token) {
        await fetch("http://localhost:8000/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      removeAuthCookies();
      removeItemLocalStorage(USER_NAME, { removeAll: true });
      router.push("/chat");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box
      as="header"
      px={6}
      py={2}
      boxShadow="sm"
      position="sticky"
      w={"full"}
      top="0"
      zIndex="10"
    >
      <Flex align="center" justify="space-between">
        <Link href="/chat" h="80px" overflow="hidden">
          <Image src="/logo2.png" alt="Logo" width={120} height={50} />
        </Link>
        <HStack gap={8}>
          <Link href="/chat">
            <Text fontSize="md" color="white" fontWeight="700">
              Trang chủ
            </Text>
          </Link>
          <Link href="/about">
            <Text fontSize="md" color="white" fontWeight="700">
              Về chúng tôi
            </Text>
          </Link>
          <Link href="/faq">
            <Text fontSize="md" color="white" fontWeight="700">
              Hỏi đáp
            </Text>
          </Link>

          {isLogin() ? (
            <Button
              size="sm"
              color="white"
              bg="red.600"
              onClick={handleLogout}
              loading={isLoggingOut}
            >
              Logout
            </Button>
          ) : (
            <LoginModal onLoginSuccess={() => {}}>
              <Dialog.Trigger asChild>
                <Button size="sm" color="white" bg="blue.600">
                  Dành cho Bác sĩ
                </Button>
              </Dialog.Trigger>
            </LoginModal>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
