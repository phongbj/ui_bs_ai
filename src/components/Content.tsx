"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Flex,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import FeatureCards from "./FeatureCards";
import VideoPlaylist from "./VideoPlaylist";

export default function Content() {
  const videoSources = ["/bongda.mp4", "/traicay.mp4", "/xe.mp4"];
  const colCount = useBreakpointValue({ base: 1, md: 1, lg: 2 });

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
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

      <Box position="relative" zIndex={3} p={8} maxW="1200px" mx="auto" color="white">

          <VStack gap={8} align="stretch">
            <Heading size="2xl" mb={4} textAlign="center">
              Các Chức Năng Chính của Trang Phân Tích Ảnh Y Tế
            </Heading>

            <SimpleGrid columns={colCount} gap={6}>
              <Box bg="rgba(255,255,255,0.1)" p={6} borderRadius="md">
                <Heading size="lg" mb={2}>1. Phân Loại Hình Ảnh</Heading>
                <Text fontSize="md">
                  Sử dụng thuật toán học máy để tự động phân loại hình ảnh y tế (X-quang, MRI, PET/CT),
                  tiết kiệm thời gian và giảm thiểu sai sót trong phân loại thủ công.
                </Text>
              </Box>

              <Box bg="rgba(255,255,255,0.1)" p={6} borderRadius="md">
                <Heading size="lg" mb={2}>2. Xác Định Đối Tượng</Heading>
                <Text fontSize="md">
                  Tự động phát hiện và làm nổi bật tổn thương, khối u hay bất thường,
                  giúp bác sĩ tập trung vào vùng cần chú ý nhất.
                </Text>
              </Box>

              <Box bg="rgba(255,255,255,0.1)" p={6} borderRadius="md">
                <Heading size="lg" mb={2}>3. Phân Vùng Ảnh Chi Tiết</Heading>
                <Text fontSize="md">
                  Phân vùng hình ảnh thành các khu vực riêng biệt,
                  cho phép phân tích chi tiết cấu trúc và chức năng của cơ quan.
                </Text>
              </Box>
            </SimpleGrid>

            <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
              <VStack align="start" gap={3} flex="1">
                <Heading size="lg">Ưu Điểm Và Ứng Dụng</Heading>
                <Stack gap={2} pl={4} as="ul">
                  <Text as="li">Tiết kiệm thời gian, tập trung vào chẩn đoán</Text>
                  <Text as="li">Cải thiện độ chính xác và phát hiện sớm</Text>
                  <Text as="li">Hỗ trợ quyết định điều trị cá nhân hóa</Text>
                </Stack>
              </VStack>

              <Box flex="1">
                <VideoPlaylist sources={videoSources} width="100%" />
              </Box>
            </Flex>
          </VStack>
        

        <FeatureCards />
      </Box>
    </>
  );
}
