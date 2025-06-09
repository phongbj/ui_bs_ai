"use client";

import {
  Box,
  Button,
  Dialog,
  Flex,
  HStack,
  Link
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { USER_NAME } from "@/config/const";
import { isLogin, removeItemLocalStorage } from "@/lib/helper";
import { removeAuthCookies } from "@/lib/helper/token";
import LoginModal from "./LoginModal";
import { NavLink } from "./NavLink";

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
      zIndex={5}
    >
      <Flex align="center" justify="space-between">
        <Link href="/chat" h="80px" overflow="hidden">
          <Image src="/logo2.png" alt="Logo" width={120} height={50} />
        </Link>
        <HStack gap={8}>
          <NavLink href="/chat">Trang chủ</NavLink>
          <NavLink href="/about">Về chúng tôi</NavLink>
          <NavLink href="/faq">Hỏi đáp</NavLink>

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
            <LoginModal onLoginSuccess={() => { }}>
              <Dialog.Trigger asChild>
                <Button size="sm" color="white" bg="blue.600" _hover={{ bg: "blue.400" }}>
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
