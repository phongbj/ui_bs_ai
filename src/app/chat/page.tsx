// src/components/Chat.tsx
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ReactElement,
} from "react";
import Image from "next/image";
import {
  Box,
  VStack,
  Text,
  Textarea,
  IconButton,
  Spinner,
  Flex,
  Portal,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import Header from "@/components/Header";

export type Message = {
  text: string;
  sender: "user" | "Bot";
  imageUrl?: string;
};

const API_BASE = "http://localhost:8000";

export default function Chat(): ReactElement {
  // 1. Khởi tạo ngay một tin nhắn giới thiệu từ Bot
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "Bot",
      text: `Xin chào! Tôi có thể giúp gì cho bạn!`,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // 2. Khởi tạo session_id hoặc load từ localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("chat_session_id");
      if (local) {
        setSessionId(local);
      } else {
        const generated = uuidv4();
        localStorage.setItem("chat_session_id", generated);
        setSessionId(generated);
      }
    }
  }, []);

  // 3. Tự động scroll xuống khi có tin nhắn mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // Đảm bảo sessionId vẫn còn trong localStorage
    const localId = localStorage.getItem("chat_session_id");
    if (localId) {
      setSessionId(localId);
    } else {
      const generated = uuidv4();
      localStorage.setItem("chat_session_id", generated);
      setSessionId(generated);
    }
  }, [messages]);

  // 4. Gửi tin nhắn
  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // Thêm tin nhắn người dùng vào danh sách
    setMessages((prev) => [...prev, { text: trimmed, sender: "user" }]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          messages: [{ role: "user", content: trimmed }],
          prompt_type: "default",
          system_prompt: undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // Thêm phản hồi từ Bot
      setMessages((prev) => [...prev, { text: data.response, sender: "Bot" }]);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Lỗi khi gửi tin nhắn.", sender: "Bot" },
      ]);
    }

    setLoading(false);
  };

  // 5. Bắt phím Enter để gửi
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Nếu autoplay bị chặn, có thể hiển thị nút Play hoặc xử lý khác
      });
    }
  }, []);

  return (
    <>
      {/* Background video */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        zIndex={1}
        overflow="hidden"
      >
        <video
          ref={videoRef}
          src="/hero_1.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </Box>

      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bg="rgba(0,0,0,0.3)"
        zIndex={2}
      />

      <Flex
        direction="column"
        h="100vh"
        w="100%"
        zIndex={3}
        position="relative"
        overflow="hidden"
      >
        <Header />

        {/* 8.0. Giới thiệu sản phẩm */}
        <Box
          as="section"
          w={["90%", "80%", "60%"]}
          bg="whiteAlpha.800"
          borderRadius="lg"
          boxShadow="md"
          my={4}
          p={6}
          mx="auto"
          flexShrink={0}
        >
          <Flex
            direction={["column", "row"]}
            align="center"
            justify="space-between"
            gap={6}
          >
            {/* Ảnh minh hoạ */}
            <Box flexShrink={0}>
              <Image
                src="/Ai-trong-y-te.webp"
                alt="Healthcare AI"
                width={300}
                height={200}
                style={{ borderRadius: "8px" }}
              />
            </Box>

            {/* Nội dung */}
            <Stack gap={4} flex="1">
              <Heading size="md">
                Chatbox Hỏi Đáp & Chẩn Đoán Hình Ảnh Y Tế Bằng AI
              </Heading>
              <Text fontSize="sm">
                Trang web Chatbox Hỏi Đáp Về Bệnh và Chẩn Đoán Hình Ảnh Y Tế
                Bằng AI là giải pháp toàn diện giúp người dùng tiếp cận thông
                tin y tế nhanh chóng và chính xác, trước khi đến gặp bác sĩ.
              </Text>

              <Heading size="sm">Hỗ Trợ Hỏi Đáp Về Bệnh</Heading>
              <Text fontSize="sm">
                Chatbox AI giải đáp thắc mắc sức khỏe tức thì, không phải chờ
                đợi.
              </Text>

              <Heading size="sm">Tư Vấn Sức Khỏe Cơ Bản</Heading>
              <Text fontSize="sm">
                Cung cấp dấu hiệu bệnh, cách phòng tránh và điều trị cơ bản (cảm
                cúm, đau đầu, dị ứng…).
              </Text>

              <Heading size="sm">Đánh Giá Triệu Chứng</Heading>
              <Text fontSize="sm">
                Hỏi chi tiết triệu chứng, tiền sử, giúp người dùng có cái nhìn
                tổng quan.
              </Text>

              <Heading size="sm">Chẩn Đoán Hình Ảnh Y Tế</Heading>
              <Text fontSize="sm">
                Phân loại X-quang, MRI, CT scan; phát hiện khối u, tổn thương;
                khoanh vùng chi tiết bằng AI.
              </Text>
            </Stack>
          </Flex>
        </Box>

        <Flex
          direction="column"
          w={["90%", "80%", "60%"]}
          mx="auto"
          flex="1"
          overflow="hidden"
          position="relative"
          pb="100px"
        >
          <VStack
            gap={3}
            align="stretch"
            p={3}
            overflowY="auto"
            borderRadius="lg"
            bg="whiteAlpha.400"
            boxShadow="md"
            className="custom-scroll"
            maxH={messages.length <= 1 ? "120px" : undefined}
            flex={messages.length > 1 ? "1" : undefined}
            transition="all 0.3s ease"
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                p={3}
                borderRadius="md"
                maxW="80%"
                bg={msg.sender === "Bot" ? "gray.100" : "blue.100"}
                alignSelf={msg.sender === "Bot" ? "flex-start" : "flex-end"}
              >
                <Text fontSize="xs" color="#000000" mb={1}>
                  {msg.sender === "Bot" ? "Bot" : "You"}
                </Text>
                <Text whiteSpace="pre-wrap">{msg.text}</Text>
              </Box>
            ))}
            <Box ref={bottomRef} />
          </VStack>

          {/* 8.2. Input & Send */}
          <Portal>
            <Flex
              position="fixed"
              bottom="20px"
              left="50%"
              transform="translateX(-50%)"
              w={["95%", "80%", "60%"]}
              bg="white"
              px={4}
              py={3}
              boxShadow="lg"
              align="center"
              borderRadius="full"
              zIndex={9999}
            >
              <Textarea
                placeholder="Hỏi bất kỳ điều gì"
                borderRadius="full"
                mr={4}
                resize="none"
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <IconButton
                aria-label="Send message"
                borderRadius="full"
                onClick={handleSend}
                loading={loading}
              >
                <FiSend />
              </IconButton>
            </Flex>
          </Portal>
        </Flex>

        {/* 8.3. Spinner khi loading */}
        {loading && (
          <Flex
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            align="center"
            direction="column"
            bg="whiteAlpha.900"
            p={4}
            borderRadius="md"
            zIndex={9999}
          >
            <Spinner />
            <Text mt={2} fontSize="sm">
              Đang gửi...
            </Text>
          </Flex>
        )}
      </Flex>
    </>
  );
}
