import React from "react";
import {
  Dialog,
  Portal,
  Box,
  IconButton,
  CloseButton,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { FiMaximize2 } from "react-icons/fi";

interface ZoomableImageProps {
  src: string;
  alt?: string;
}

export default function ZoomableImage({ src, alt }: ZoomableImageProps) {
  return (
    <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
      {/* Trigger: thumbnail + zoom icon */}
      <Dialog.Trigger asChild>
        <Box position="relative" cursor="pointer">
          <ChakraImage
            src={src}
            alt={alt}
            borderRadius="md"
            w="100%"
            maxH="200px"
            objectFit="contain"
          />
          <IconButton
            aria-label="Zoom image"
            size="sm"
            position="absolute"
            top={2}
            right={2}
            colorScheme="whiteAlpha"
            variant="outline"
            _hover={{ bg: "whiteAlpha.300" }}
          ><FiMaximize2 /></IconButton>
        </Box>
      </Dialog.Trigger>

      {/* Modal full-screen via Dialog */}
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.8)" />
        <Dialog.Positioner
          style={{ inset: 0, position: "fixed", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Dialog.Content style={{ background: "transparent", padding: 0, maxWidth: "none" }}>
            <Dialog.CloseTrigger asChild>
              <CloseButton position="absolute" top={4} right={4} color="white" size="lg" />
            </Dialog.CloseTrigger>
            <ChakraImage
              src={src}
              alt={alt}
              maxW="100%"
              maxH="90vh"
              objectFit="contain"
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}