"use client";

import { Box, Flex, Container, Heading, VStack } from "@chakra-ui/react";
import TranslationInput from "../components/TranslationInput";
import TranslationServices from "../components/TranslationServices";

const Home = () => {
  return (
    <Box minHeight="100vh" bg="gray.900" color="white">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Heading as="h1" size="2xl" textAlign="center" mb={4}>
            SimpleLMT
          </Heading>
          <Flex
            direction={{ base: "column", md: "row" }}
            width="100%"
            gap={8}
          >
            <Box flex="3">
              <TranslationInput />
            </Box>
            <Box flex="1">
              <TranslationServices />
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;