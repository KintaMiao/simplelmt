"use client";

import { ReactNode } from "react";
import { ChakraProvider, extendTheme, useToast } from "@chakra-ui/react";
import { TranslationProvider } from "../contexts/TranslationContext";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
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
