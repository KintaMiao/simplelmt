"use client";

import { Box, Flex, Container, Heading, VStack, Button, Spacer } from "@chakra-ui/react";
import TranslationInput from "../components/TranslationInput";
import TranslationServices from "../components/TranslationServices";
import Link from "next/link";

const Home = () => {
  return (
    <Box minHeight="100vh" bg="gray.900" color="white">
      <Box bg="gray.800" px={4} py={3} mb={4}>
        <Flex alignItems="center" maxW="container.xl" mx="auto">
          <Heading size="md">SimpleLMT</Heading>
          <Spacer />
          <Button as={Link} href="/" variant="ghost" mr={2}>
            首页
          </Button>
          <Button as={Link} href="/about" variant="ghost">
            关于
          </Button>
        </Flex>
      </Box>

      <Container maxW="container.xl" py={12}>
        <VStack spacing={12}>
          <Heading as="h1" size="2xl" textAlign="center" mb={8}>
            SimpleLMT
          </Heading>
          <Flex
            direction={{ base: "column", lg: "row" }}
            width="100%"
            gap={12}
          >
            <Box flex={{ base: "1", lg: "7" }} width="100%">
              <TranslationInput />
            </Box>
            <Box flex={{ base: "1", lg: "3" }} width="100%">
              <TranslationServices />
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;