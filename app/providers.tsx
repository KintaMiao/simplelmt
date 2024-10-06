"use client";

import { ReactNode } from "react";
import { ChakraProvider, extendTheme, useToast } from "@chakra-ui/react";
import { TranslationProvider } from "../contexts/TranslationContext";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "white",
      },
    },
  },
  colors: {
    brand: {
      50: "#E3F2FD",
      100: "#BBDEFB",
      200: "#90CAF9",
      300: "#64B5F6",
      400: "#42A5F5",
      500: "#2196F3",
      600: "#1E88E5",
      700: "#1976D2",
      800: "#1565C0",
      900: "#0D47A1",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
        transition: "all 0.3s ease",
      },
      variants: {
        solid: (props: any) => ({
          bg: `${props.colorScheme}.500`,
          color: "white",
          _hover: {
            bg: `${props.colorScheme}.600`,
            transform: "translateY(-2px)",
            boxShadow: "lg",
          },
          _active: {
            bg: `${props.colorScheme}.700`,
            transform: "translateY(1px)",
          },
          _focus: {
            boxShadow: `0 0 0 3px ${props.colorScheme}.300`,
          },
        }),
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "md",
          transition: "all 0.3s ease",
          _focus: {
            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
            borderColor: "brand.500",
          },
        },
      },
    },
  },
  toast: {
    defaultOptions: {
      position: "top",
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ChakraProvider theme={theme}>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </ChakraProvider>
  );
};

export default Providers;
