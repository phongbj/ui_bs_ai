"use client";

import Header from "@/components/Header";
import {
  Box,
  Container,
  Heading,
  Text,
  Link,
  SimpleGrid,
  List,
  ListItem,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";

export default function Faq() {
  const cols = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  const faqs = [
    {
      title: "1. Tôi có thể hỏi AI Bác Sĩ những gì?",
      content: (
        <>
          <List.Root pl={4} gap={2}>
            <ListItem>Triệu chứng bệnh lý (ví dụ: ho, sốt, đau ngực,…)</ListItem>
            <ListItem>Thông tin thuốc (cách dùng, tác dụng phụ,…)</ListItem>
            <ListItem>Tư vấn chăm sóc sức khỏe tại nhà</ListItem>
            <ListItem>Gợi ý khi nào nên đi khám bác sĩ</ListItem>
          </List.Root>
          <Text fontSize="sm" mt={2} color="gray.300">
            Lưu ý: AI không thay thế bác sĩ, chỉ hỗ trợ tư vấn sơ bộ.
          </Text>
        </>
      ),
    },
    {
      title: "2. AI Bác Sĩ có thể chẩn đoán bệnh không?",
      content: (
        <Text>
          AI Bác Sĩ cung cấp gợi ý dựa trên dữ liệu huấn luyện. Với các trường hợp nghiêm trọng
          hoặc kéo dài, bạn nên đặt lịch khám trực tiếp với bác sĩ chuyên môn.
        </Text>
      ),
    },
    {
      title: "3. Tôi có thể đặt lịch khám như thế nào?",
      content: (
        <List.Root pl={4} gap={2}>
          <ListItem>Trò chuyện với chatbot và cung cấp triệu chứng.</ListItem>
          <ListItem>Hệ thống sẽ gửi xác nhận qua email hoặc điện thoại.</ListItem>
        </List.Root>
      ),
    },
    {
      title: "4. Dữ liệu cá nhân của tôi có được bảo mật không?",
      content: (
        <Text>
          Chắc chắn có. Mọi thông tin cá nhân và y tế đều được mã hóa và lưu trữ tuân thủ
          tiêu chuẩn bảo mật cao nhất.
        </Text>
      ),
    },
    {
      title: "5. Tôi là bác sĩ, làm sao để đăng nhập vào hệ thống chẩn đoán ảnh?",
      content: (
        <>
          <List.Root pl={4} gap={2} mb={2}>
            <ListItem>Truy cập công cụ chẩn đoán ảnh y tế bằng AI</ListItem>
            <ListItem>Quản lý lịch sử phân tích hình ảnh</ListItem>
            <ListItem>Xem báo cáo nhanh từ mô hình AI</ListItem>
          </List.Root>
          <Text>
            Nếu bạn là bác sĩ và muốn tham gia, vui lòng liên hệ<Link color="blue.300" href="mailto:support@aibacsi.vn">support@aibacsi.vn</Link>  để được cấp tài khoản.
          </Text>
        </>
      ),
    },
  ];

  return (
    <>
      <Header />

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
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

      {/* Main content with white text */}
      <Box position="relative" zIndex={3} pt={20} pb={10} px={4} color="white">
        <Container maxW="container.xl">
          <VStack gap={8} align="stretch">
            <Heading as="h1" size="2xl" textAlign="center" color="white">
              ❓ Hỏi Đáp Cùng AI Bác Sĩ
            </Heading>

            <SimpleGrid columns={cols} gap={6}>
              {faqs.map((faq, idx) => (
                <Box
                  key={idx}
                  bg="whiteAlpha.200"
                  p={6}
                  borderRadius="xl"
                  boxShadow="md"
                  color="white"
                >
                  <Heading as="h2" size="lg" mb={3} color="white">
                    🔹 {faq.title}
                  </Heading>
                  {faq.content}
                </Box>
              ))}
            </SimpleGrid>

            <Box textAlign="center" mt={8}>
              <Text fontWeight="bold" mb={2} color="white">
                📩 Bạn vẫn còn câu hỏi?
              </Text>
              <Text color="white">
                Hãy sử dụng hộp chat bên dưới hoặc gửi email đến{' '}
                <Link color="blue.300" href="mailto:support@aibacsi.vn">
                  support@aibacsi.vn
                </Link>{' '}
                - chúng tôi sẽ phản hồi sớm nhất.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}