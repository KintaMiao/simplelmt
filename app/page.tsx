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
            <Box flex="3" mr={{ md: 4 }} mb={{ base: 4, md: 0 }}>
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