import React from 'react';
import { Box, Container, Heading, Text, VStack, Button, Link } from "@chakra-ui/react";

const AboutPage: React.FC = () => {
  return (
    <Box minHeight="100vh" bg="gray.900" color="white">
      <Box bg="gray.800" px={4} py={3} mb={4}>
        <Container maxW="container.xl">
          <Heading size="md">SimpleLMT</Heading>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="start">
          <Heading as="h1" size="2xl">关于 SimpleLMT</Heading>
          <Text fontSize="lg">
            SimpleLMT 是一个强大的多语言翻译工具，利用多个大型语言模型提供高质量的翻译服务。
          </Text>
          <Text fontSize="lg">
            我们支持多种翻译服务，包括谷歌翻译、OpenAI、通义千问和 DeepL，让用户可以根据自己的需求选择最适合的翻译引擎。
          </Text>
          <Text fontSize="lg">
            SimpleLMT 是一个开源项目，您可以在 GitHub 上查看源代码并参与贡献：
            <Link href="https://github.com/KintaMiao/simplelmt" color="brand.500" isExternal>
              https://github.com/KintaMiao/simplelmt
            </Link>
          </Text>
          <Text fontSize="lg">
            SimpleLMT 的特点：
          </Text>
          <VStack spacing={2} align="start" pl={4}>
            <Text>• 支持多种翻译服务</Text>
            <Text>• 支持多种语言的翻译</Text>
            <Text>• 使用 Chakra UI 进行界面设计</Text>
            <Text>• 使用 Tailwind CSS 进行样式管理</Text>
            <Text>• 使用 Next.js 进行服务端渲染</Text>
          </VStack>
          <Text fontSize="lg">
            无论您是学生、专业翻译人员还是企业用户，SimpleLMT 都能满足您的翻译需求。
          </Text>
          <Box display="flex" justifyContent="center" width="100%">
            <Button as={Link} href="/" colorScheme="brand" size="lg" mt={4}>
              开始使用
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AboutPage;