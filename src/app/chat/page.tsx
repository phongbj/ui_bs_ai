// src/components/Chat.tsx
"use client";

import React, {
    useState,
    useEffect,
    useRef,
    KeyboardEvent,
    ReactElement,
} from "react";
import {
    Box,
    VStack,
    Text,
    Textarea,
    IconButton,
    Spinner,
    Flex,
    Portal,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
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
            text: `Xin chào! Tôi có thể giúp bạn những việc sau đây dựa trên tài liệu đã cung cấp:
- **Tìm kiếm thông tin về một bệnh cụ thể:** Bạn có thể hỏi tôi về một bệnh cụ thể, và tôi sẽ cung cấp triệu chứng cùng lời khuyên liên quan.
- **Liệt kê các bệnh theo nhóm:** Ví dụ, bạn có thể hỏi tôi về các bệnh về tim mạch, tôi sẽ liệt kê những bệnh tim mạch có trong tài liệu.
- **Đưa ra lời khuyên chung:** Nếu bạn mô tả một số triệu chứng, tôi có thể giúp bạn xác định bệnh có thể mắc phải và đưa ra lời khuyên sơ bộ (lưu ý: không thay thế tư vấn y tế chuyên nghiệp).

Ngoài ra, tôi cũng hỗ trợ:
- Giới thiệu về YOLOv8: Đây là phiên bản mới nhất của YOLO, được tối ưu cho cả phát hiện (detection), phân loại (classification) và phân đoạn (segmentation) đối tượng trong ảnh/video. chức năng này cần người dùng đăng nhập mới có thể sử dụng`,
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
            setMessages((prev) => [
                ...prev,
                { text: data.response, sender: "Bot" },
            ]);
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

    return (
        <>
            {/* 6. Background toàn màn hình */}
            <Box
                position="fixed"
                top="0"
                left="0"
                w="100vw"
                h="100vh"
                zIndex={1}
                overflow="hidden"
            >
                <Image
                    src="/BR2.jpg"
                    alt="Background"
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                />
            </Box>
            <Box
                position="fixed"
                top="0"
                left="0"
                w="100vw"
                h="100vh"
                bg="rgba(0, 0, 0, 0.5)"
                zIndex={2}
            />
            {/* 7. Layer giao diện chat lên trên */}
            <Box position="fixed" top="0" left="0" w="100vw" h="100vh" zIndex={3}>
                <VStack className="w-full">
                    <Header />

                    {/* 7.1. Danh sách tin nhắn */}
                    <VStack
                        gap={3}
                        align="stretch"
                        p={4}
                        maxH="80vh"
                        overflowY="auto"
                        bg="rgba(0, 0, 0, 0.3)"
                        borderRadius="lg"
                        mb={10}
                    >
                        {messages.map((msg, idx) => (
                            <Box
                                key={idx}
                                p={3}
                                borderRadius="md"
                                maxW="80%"
                                bg={msg.sender === "Bot" ? "gray.100" : "blue.100"}
                                alignSelf={
                                    msg.sender === "Bot" ? "flex-start" : "flex-end"
                                }
                            >
                                <Text fontSize="xs" color="gray.600" mb={1}>
                                    {msg.sender === "Bot" ? "Bot" : "You"}
                                </Text>
                                <Text whiteSpace="pre-wrap">{msg.text}</Text>
                            </Box>
                        ))}
                        {/* Invisible box để scrollIntoView */}
                        <Box ref={bottomRef} />
                    </VStack>

                    {/* 7.2. Chat input bar (luôn nằm ở góc dưới) */}
                    <Portal>
                        <Flex
                            position="fixed"
                            bottom="20px"
                            left="50%"
                            transform="translateX(-50%)"
                            width="50%"
                            bg="white"
                            px={4}
                            py={3}
                            boxShadow="md"
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
                                disabled={loading}
                            >
                                <FiSend />
                            </IconButton>
                        </Flex>
                    </Portal>

                    {/* 7.3. Spinner hiển thị khi loading */}
                    {loading && (
                        <Flex
                            position="fixed"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            align="center"
                            direction="column"
                            bg="rgba(255, 255, 255, 0.8)"
                            p={3}
                            borderRadius="md"
                            zIndex={9999}
                        >
                            <Spinner />
                            <Text mt={2} fontSize="sm">
                                Đang gửi...
                            </Text>
                        </Flex>
                    )}
                </VStack>
            </Box>
        </>
    );
}
