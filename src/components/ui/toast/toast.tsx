"use client";

import React from "react";
import { Box, Text, CloseButton } from "@chakra-ui/react";
import { Toast as ToastType, ToastType as TType } from "./toast-context";

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const bgColor = "white";
  const borderColor = "gray.200";

  const getTypeColor = (type: TType): string => {
    switch (type) {
      case "success":
        return "green.500";
      case "error":
        return "red.500";
      case "warning":
        return "yellow.500";
      case "info":
        return "blue.500";
      default:
        return "gray.500";
    }
  };

  return (
<Box
  className={`p-3 bg-${bgColor} rounded-md shadow-md border-l-4 ${getTypeColor(toast.type)} border-${borderColor} flex items-center justify-between min-w-[18.75rem] max-w-[25rem]`}
>
  <Text>{toast.description}</Text>
  <CloseButton onClick={onClose} />
</Box>

  );
};

export default Toast; 