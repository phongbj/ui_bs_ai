"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import {
    Box,
    Flex,
    Heading,
    IconButton,
    Spinner,
    Text,
    Textarea,
    VStack,
    Portal,
    Stack,
} from "@chakra-ui/react";
import Image from 'next/image';
import { FiSend } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';
import FeatureCards from "./FeatureCards";
import VideoPlaylist from "./VideoPlaylist";

type ContentProps = {
    mode: string;
};

export type Message = {
    text: string;
    sender: 'You' | 'Bot' | 'user';
    imageUrl?: string;
};

const API_BASE = 'http://localhost:8000';

export default function Content({ mode }: ContentProps) {
    const videoSources = ["/bongda.mp4", "/traicay.mp4", "/xe.mp4"];
    const bottomRef = useRef<HTMLDivElement>(null);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>(() => {
        const local = localStorage.getItem('chat_session_id');
        const generated = local || uuidv4();
        localStorage.setItem('chat_session_id', generated);
        return generated;
    });

    const handleSend = async () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

        setMessages((prev) => [...prev, { text: trimmed, sender: 'user' as const }]);
        setInputText("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    messages: [{ role: 'user', content: trimmed }],
                    prompt_type: 'default',
                    system_prompt: undefined,
                }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { text: data.response, sender: 'Bot' }]);
        } catch (error) {
            console.error('❌ Error sending message:', error);
            setMessages((prev) => [...prev, { text: '⚠️ Lỗi khi gửi tin nhắn.', sender: 'Bot' }]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        const localId = localStorage.getItem('chat_session_id');
        if (localId) {
            setSessionId(localId);
        } else {
            const generated = uuidv4();
            localStorage.setItem('chat_session_id', generated);
            setSessionId(generated);
        }
    }, [messages]);

    return (
        <>
            {/* 1. Background image + overlay */}
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

            {/* 2. Nội dung chính (stacking context zIndex=3) */}
            <Box position="relative" zIndex={3} pl={10} className="w-[75%]" bg="rgba(0, 0, 0, 0.5)">
            <Stack direction="row">
                <VStack className="text-white" align="start" gap={4}>
                    {mode === "about" && (
                        <>
                            <Heading size={"3xl"}>Introduction to YOLOv8</Heading>
                            <Text>
                                🚀 Welcome to the introduction page of our project! In this project,
                                we will be exploring the YOLO (You Only Look Once) algorithm. YOLO is
                                known for its ability to detect objects in an image in a single pass,
                                making it a highly efficient and accurate object detection algorithm. 🎯
                            </Text>

                            <Text>
                                The latest version of YOLO, YOLOv8, released in January 2023 by
                                Ultralytics, has introduced several modifications that have further
                                improved its performance. 🌟
                            </Text>

                            <Text>
                                🔍 Some of these modifications are:
                                <br />• Introducing a new backbone network, Darknet-53,
                                <br />• Introducing a new anchor-free detection head...
                                <br />• and a new loss function.
                            </Text>

                            <Text>
                                🦄 One of the key advantages of YOLOv8 is its versatility. It not only
                                supports object detection but also offers classification and
                                segmentation. This makes it a powerful tool for various computer vision
                                applications.
                            </Text>

                            <Text>
                                ✨ We will focus on three tasks: <b>classification</b>,{" "}
                                <b>detection</b>, and <b>segmentation</b>. We’ll explore medical
                                imaging to detect and classify anomalies 💉🍷.
                            </Text>

                            <Text>
                                We hope you find this inspiring. 💡 Let’s dive into the world of
                                YOLOv8! 😈🟪
                            </Text>
                        </>
                    )}

                    {mode === "class" && (
                        <>
                            <Heading size={"3xl"}>Classification with YOLOv8</Heading>
                            <Text fontSize={"2xl"}>Output Image</Text>
                            <Box mt={2}>
                                <Image
                                    src="/classification.jpg"
                                    alt="Classification"
                                    width={600}
                                    height={600}
                                />
                            </Box>
                        </>
                    )}

                    {mode === "detect" && (
                        <>
                            <Heading size={"3xl"}>Object Detection with YOLOv8</Heading>
                            <Text fontSize={"2xl"}>Output Image</Text>
                            <Box mt={2}>
                                <Image
                                    src="/detection.jpg"
                                    alt="Detection"
                                    width={600}
                                    height={600}
                                />
                            </Box>
                        </>
                    )}

                    {mode === "segment" && (
                        <>
                            <Heading size={"3xl"}>Segmentation with YOLOv8</Heading>
                            <Text fontSize={"2xl"}>Output Image</Text>
                            <Box mt={2}>
                                <Image
                                    src="/segementation.jpg"
                                    alt="Segmentation"
                                    width={600}
                                    height={600}
                                />
                            </Box>
                        </>
                    )}

                    {mode === "about" && (
                        <VStack gap={4} w="full" mb={24}>
                            {messages.map((msg, i) => (
                                <Box
                                    key={i}
                                    p={3}
                                    borderRadius="xl"
                                    w="fit-content"
                                    maxW="80%"
                                    whiteSpace="pre-wrap"
                                    bg={msg.sender === "Bot" ? "green.100" : "blue.100"}
                                    alignSelf={msg.sender === "Bot" ? "flex-start" : "flex-end"}
                                >
                                    <Text fontSize="xs" color="gray.600" mb={1}>
                                        {msg.sender}
                                    </Text>
                                    {msg.text && <Text color={"black"}>{msg.text}</Text>}

                                    {msg.imageUrl?.startsWith("http") && (
                                        <Box mt={2}>
                                            <Image
                                                src={msg.imageUrl}
                                                alt="image from bot"
                                                className="rounded-2x! max-w-[500px]! h-auto!"
                                            />
                                        </Box>
                                    )}
                                </Box>
                            ))}
                            <Box ref={bottomRef} />
                        </VStack>
                    )}
                </VStack>
                <Box p={10} height={200}>
                <VideoPlaylist
                sources={videoSources}
                width="100%"
                />
                </Box>
            </Stack>


                {/* 3. Chat bar chỉ hiện khi mode === "about" */}
                {mode === "class" && (
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
                            >
                                <FiSend />
                            </IconButton>
                        </Flex>
                    </Portal>
                )}

                {/* 4. Spinner loading (nếu đang load) */}
                {loading && (
                    <VStack colorPalette="teal" mb={32}>
                        <Spinner color="colorPalette.600" />
                        <Text color="colorPalette.600">Loading...</Text>
                    </VStack>
                )}
            </Box>

            {/* 5. FeatureCards render ở dưới cùng (không ảnh hưởng tới chat bar) */}
            <FeatureCards />
        </>
    );
}
