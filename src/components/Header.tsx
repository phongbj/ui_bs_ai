"use client";

import Image from "next/image";
import { Box, Button, Flex } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box
      as="header"
      px={6}
      position="sticky"
      top="0"
      zIndex="10"
      className="w-full"
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" justify="center" width="150px" height="100px" overflow="hidden">
          <Image
            src="/Logo3.png"
            alt="Logo Bác sĩ AI"
            width={150}
            height={150}
            style={{
              filter: "brightness(0) invert(1)",
            }}
          />
        </Flex>
        <Button fontSize="lg" className="bg-blue-500 hover:bg-blue-700">
          Login
        </Button>
      </Flex>
    </Box>
  );
}
