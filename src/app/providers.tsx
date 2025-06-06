'use client'
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {/* ChakraProvider without a theme simply uses all Chakra defaults */}
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
