"use client";

import { ReactNode } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { TranslationProvider } from "../contexts/TranslationContext";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
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
