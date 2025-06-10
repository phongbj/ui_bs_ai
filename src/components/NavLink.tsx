import { Link, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
interface NavLinkProps {
  href: string;
  children: ReactNode;
}
export function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href} _hover={{ textDecoration: "none" }}>
      <Text
        position="relative"
        fontSize="md"
        color="white"
        fontWeight="700"
        _after={{
          content: '""',
          position: "absolute",
          bottom: "-2px",
          left: 0,
          width: "0%",
          height: "2px",
          bg: "blue.600",
          transition: "width 0.3s ease",
        }}
        _hover={{
          _after: {
            width: "100%",
          },
        }}
      >
        {children}
      </Text>
    </Link>
  );
}