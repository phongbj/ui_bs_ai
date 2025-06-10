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
    Heading,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import Header from "@/components/Header";
import { useColorModeValue } from "@/components/ui/color-mode";

export type Message = {
    text: string;
    sender: "user" | "Bot";
    imageUrl?: string;
};

const API_BASE = "http://localhost:8000";

export default function Chat(): ReactElement {
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

    useEffect(() => {
        const generated = uuidv4();
        localStorage.setItem("chat_session_id", generated);
        setSessionId(generated);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

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

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const contentBg = useColorModeValue("rgba(250, 250, 250, 0.1)", "rgba(0, 0, 0, 0.8)");
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
                overflow="auto"  // allow full page scroll
            >
                <Header />

                {/* Introduction */}
                <Box
                    as="section"
                    w={["90%", "80%", "60%"]}
                    bg="whiteAlpha.800"
                    borderRadius="lg"
                    boxShadow="md"
                    my={4}
                    p={6}
                    mx="auto"
                >
                    <Box
                        float="right"
                        ml={4}
                        mb={4}
                        maxW="40%"
                        display="block"
                    >
                        <Image
                            src="/Ai-trong-y-te.webp"
                            alt="Healthcare AI"
                            width={500}
                            height={200}
                            style={{ borderRadius: 8, width: "100%", height: "auto" }}
                        />
                    </Box>

                    <Heading size="xl" mb={2}>
                        AI bác sĩ tư vấn về sức khỏe
                    </Heading>

                    <Text fontSize="sm" mb={2}>
                        AI Bác Sĩ - Tư Vấn Sức Khỏe Toàn Diện 24/7
                        Bạn cần lời khuyên y tế nhanh chóng, chính xác và dễ hiểu ngay tại nhà? AI Bác Sĩ chính là giải pháp:
                    </Text>
                    <ul>
                        <li>Giải Đáp Mọi Thắc Mắc Về Sức Khỏe</li>
                        <li>Đánh Giá Triệu Chứng Cá Nhân</li>
                        <li>Tư Vấn Phòng Ngừa và Chế Độ Sinh Hoạt</li>
                        <li>Nhắc Nhở và Theo Dõi Sức Khỏe</li>
                        <li>Hướng Dẫn Xử Lý Ban Đầu Khẩn Cấp</li>
                    </ul>
                </Box>

                <Flex
                    direction="column"
                    w={["90%", "80%", "60%"]}
                    mx="auto"
                    flex="1"
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
                    >
                        {messages.map((msg, idx) => (
                            <Box
                                key={idx}
                                p={3}
                                borderRadius="md"
                                maxW="80%"
                                bg={msg.sender === "Bot" ? "whiteAlpha.800" : "blue.100"}
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

                    {/* Input & Send */}
                    <Portal>
                        <Flex
                            backgroundColor={contentBg}
                            position="fixed"
                            bottom="20px"
                            left="50%"
                            transform="translateX(-50%)"
                            w={["95%", "80%", "60%"]}
                            px={4}
                            py={3}
                            boxShadow="lg"
                            align="center"
                            borderRadius="full"
                            zIndex={4}
                        >
                            <Textarea
                                placeholder="Hỏi bất kỳ điều gì"
                                borderRadius="full"
                                mr={4}
                                resize="none"
                                rows={1}
                                className="text-white!"
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
