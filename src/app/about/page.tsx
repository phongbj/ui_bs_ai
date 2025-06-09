"use client";

import Header from "@/components/Header";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import Image from "next/image";

export default function About() {
  // you can swap this for whatever image you like
  const imageSrc = "/img-about-us.webp";

  return (
    <>
      <Header />

      {/* Video background + dark overlay */}
      <Box
        position="fixed"
        top={0}
        left={0}
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
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        bg="rgba(0, 0, 0, 0.6)"
        zIndex={2}
      />

      {/* Main content */}
      <Box position="relative" zIndex={3} pt={10} pb={10} px={4} color="white">
        <Container maxW="container.xl">
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={10}
            alignItems="stretch"
          >
            {/* Left: Text */}
            <VStack flex={1} align="start" gap={6}>
              <Heading as="h1" size="2xl">
                🩺 Về Chúng Tôi
              </Heading>

              <Text>
                AI Bác Sĩ là một nền tảng công nghệ y tế thông minh, ứng dụng trí
                tuệ nhân tạo (AI) để hỗ trợ chăm sóc sức khỏe cộng đồng một
                cách nhanh chóng, chính xác và tiện lợi.
              </Text>

              <Text>
                Chúng tôi tin rằng mỗi người đều xứng đáng được tiếp cận với
                thông tin y tế chất lượng, dù ở bất kỳ đâu hay bất kỳ thời điểm
                nào. Với AI Bác Sĩ, bệnh nhân có thể:
              </Text>

              <VStack pl={4} gap={2} align="start">
                <Text>
                  • Trò chuyện với chatbot y tế để được tư vấn ban đầu về triệu
                  chứng và sức khỏe.
                </Text>
                <Text>
                  • Đặt lịch khám tại các cơ sở y tế một cách dễ dàng.
                </Text>
                <Text>
                  • Được hỗ trợ nhanh chóng, kịp thời từ hệ thống và đội ngũ
                  bác sĩ chuyên môn.
                </Text>
              </VStack>

              <Text fontWeight="bold">Đối với đội ngũ bác sĩ, chúng tôi cung cấp:</Text>
              <VStack pl={4} gap={2} align="start">
                <Text>
                  • Công cụ chẩn đoán hình ảnh y tế ứng dụng AI (X-quang, CT,
                  MRI, OCT,…).
                </Text>
                <Text>
                  • Giao diện trực quan giúp tăng tốc quá trình chẩn đoán và ra
                  quyết định.
                </Text>
                <Text>
                  • Một hệ sinh thái số đồng hành cùng bác sĩ trong chuyển đổi
                  số y tế.
                </Text>
              </VStack>

              <Heading as="h2" size="xl" pt={4}>
                🎯 Sứ mệnh
              </Heading>
              <Text>
                Mang công nghệ AI vào từng bước chăm sóc sức khỏe, giúp người
                bệnh được hỗ trợ sớm hơn, bác sĩ làm việc hiệu quả hơn và ngành
                y tế phát triển bền vững.
              </Text>

              <Heading as="h2" size="xl" pt={4}>
                🌐 Tầm nhìn
              </Heading>
              <Text>
                Trở thành nền tảng y tế AI đáng tin cậy hàng đầu tại Việt Nam và
                khu vực, kết nối bệnh nhân và bác sĩ một cách thông minh và
                nhân văn.
              </Text>
            </VStack>

            {/* Right: Image */}
            <Box
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="lg"
            >
              <Image
                src={imageSrc}
                alt="Đội ngũ AI Bác Sĩ"
                fill
                objectFit="cover"
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}
