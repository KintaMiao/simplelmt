"use client";

import { Box, Flex } from "@chakra-ui/react";
import TranslationInput from "../components/TranslationInput";
import TranslationServices from "../components/TranslationServices";

const Home = () => {
  return (
    <Flex
      height="100vh"
      bg="gray.800"
      color="white"
      p={4}
      direction={{ base: "column", md: "row" }}
    >
      {/* 左侧输入区域 */}
      <Box flex="3" mr={{ md: 4 }} mb={{ base: 4, md: 0 }}>
        <TranslationInput />
      </Box>

      {/* 右侧服务选择区域 */}
      <Box flex="1">
        <TranslationServices />
      </Box>
    </Flex>
  );
};

export default Home;