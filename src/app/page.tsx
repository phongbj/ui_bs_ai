"use client";

import {
  Flex,
  VStack,
} from "@chakra-ui/react";
import Content from "../components/Content";
import Header from "../components/Header";

export default function HomePage() {

  return (
    <Flex minH="100vh">
      <VStack className="w-full">
      <Header />
      <Content />
      </VStack>
    </Flex>
  );
}
