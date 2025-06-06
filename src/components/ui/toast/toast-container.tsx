"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import { useToast } from "./toast-context";
import Toast from "./toast";

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <Box
      position="fixed"
      top="4"
      right="4"
      zIndex="toast"
      display="flex"
      flexDirection="column"
      gap="2"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </Box>
  );
};

export default ToastContainer; 