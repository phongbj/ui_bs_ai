"use client";

import {
    Box,
    Heading,
    Stack,
    Text,
    VStack
} from "@chakra-ui/react";
import Image from 'next/image';
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

export default function Content({ mode }: ContentProps) {
    const videoSources = ["/bongda.mp4", "/traicay.mp4", "/xe.mp4"];


    return (
        <>
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
                bg="rgba(0, 0, 0, 0.0)"
                zIndex={2}
            />

            <Box position="relative" zIndex={3} pl={10} className="w-[75%]" bg="rgba(0, 0, 0, 0.5)">
            <Stack direction="row">
                <VStack className="text-white" align="start" gap={4}>
                    {mode === "about" && (
                        <>
                            <Heading mt={5} size={"3xl"}>Các Chức Năng Chính của Trang Web Phân Tích Ảnh Y Tế</Heading>
                            <Text>
                               Trang web phân tích ảnh y tế cung cấp các chức năng chính như phân loại hình ảnh, xác định đối tượng và phân vùng ảnh chi tiết, giúp bác sĩ chẩn đoán bệnh một cách nhanh chóng và chính xác.
                            </Text>

                            <Text>
                                1. Phân Loại Hình Ảnh
Chức năng phân loại hình ảnh của trang web này sử dụng các thuật toán học máy để tự động phân loại hình ảnh y tế vào các danh mục khác nhau. Ví dụ, nó có thể phân biệt giữa hình ảnh X-quang phổi, MRI vú, hoặc PET/CT phổi, giúp bác sĩ lâm sàng nhanh chóng xác định loại hình ảnh và tiến hành chẩn đoán phù hợp.
Việc phân loại hình ảnh tự động giúp tiết kiệm thời gian cho các chuyên gia y tế và giảm thiểu sai sót trong quá trình phân loại thủ công. Điều này đặc biệt quan trọng trong các tình huống khẩn cấp, nơi thời gian là yếu tố then chốt để cứu sống bệnh nhân.

                            </Text>

                            <Text>
                                2. Xác Định Đối Tượng
Chức năng xác định đối tượng cho phép hệ thống tự động xác định và làm nổi bật các đối tượng quan trọng trong hình ảnh y tế, như các tổn thương, khối u, hoặc các bất thường khác. Điều này giúp bác sĩ tập trung vào những khu vực cần chú ý nhất và cải thiện độ chính xác của chẩn đoán.
Sử dụng các thuật toán tiên tiến, hệ thống có thể phát hiện các chi tiết nhỏ mà mắt thường khó nhận ra, từ đó giúp chẩn đoán bệnh ở giai đoạn sớm. Điều này đặc biệt hữu ích trong việc phát hiện ung thư và các bệnh lý nghiêm trọng khác.

                            </Text>

                            <Text>
                               3. Phân Vùng Ảnh Chi Tiết
Hệ thống có khả năng phân vùng hình ảnh y tế thành các vùng cụ thể, giúp tách biệt và phân tích từng phần của hình ảnh. Ví dụ, trong hình ảnh MRI não, hệ thống có thể phân vùng các vùng não khác nhau và xác định bất kỳ tổn thương nào một cách chi tiết.
Việc phân vùng ảnh chi tiết cho phép các bác sĩ có cái nhìn sâu sắc hơn về cấu trúc và chức năng của các cơ quan trong cơ thể. Điều này giúp họ đưa ra các quyết định điều trị chính xác hơn và theo dõi tiến triển của bệnh một cách hiệu quả.

                            </Text>

                            <Text>
                                Ứng Dụng Thực Tế và Lợi Ích
Trang web phân tích ảnh y tế có nhiều ứng dụng thực tế, bao gồm cải thiện chẩn đoán và cá nhân hóa chăm sóc sức khỏe, nâng cao trải nghiệm và kết quả điều trị cho bệnh nhân.

                            </Text>

                            <Text>
                               Tiết kiệm thời gian
Quá trình phân tích tự động giúp bác sĩ tiết kiệm thời gian, tập trung vào việc đưa ra quyết định điều trị.

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
                </VStack>
                <Box p={10} height={200}>
                <VideoPlaylist
                sources={videoSources}
                width="100%"
                />
                </Box>
            </Stack>
            </Box>
            <FeatureCards />
        </>
    );
}
