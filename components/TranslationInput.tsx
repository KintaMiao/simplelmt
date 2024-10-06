"use client";

import { Box, VStack, Textarea, Select, Button, Spinner, HStack, Grid, GridItem, Collapse, Flex, useToast, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslationContext } from "../contexts/TranslationContext";
import { CopyIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid'; // 用于生成唯一ID
import TranslationHistory from "./TranslationHistory";

const TranslationInput = () => {
  const [text, setText] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("en");
  const { services, customAPIs, addHistory } = useTranslationContext();
  const [translations, setTranslations] = useState<{ service: string; text: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleTranslate = async () => {
    if (services.length === 0) {
      toast({
        title: "没有选择翻译服务",
        description: "请至少选择一个翻译服务后再进行翻译。",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setLoading(true);
    setTranslations([]);

    const translateWithService = async (service: string) => {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLang: sourceLang === "auto" ? "" : sourceLang,
          targetLang,
          service,
          customAPIs,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! 状态: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder("utf-8");
      let translatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(5);
            if (data === "[DONE]") {
              break;
            }
            translatedText += data;
            setTranslations(prev => {
              const index = prev.findIndex(t => t.service === service);
              if (index !== -1) {
                const newTranslations = [...prev];
                newTranslations[index] = { ...newTranslations[index], text: translatedText.trim() };
                return newTranslations;
              }
              return [...prev, { service, text: translatedText.trim(), name: getServiceName(service) }];
            });
          }
        }
      }

      addHistory({
        id: uuidv4(),
        inputText: text,
        sourceLang,
        targetLang,
        service,
        translatedText,
        timestamp: new Date().toISOString(),
      });
    };

    try {
      await Promise.all(services.map(translateWithService));
      toast({
        title: "翻译成功",
        description: "您的文本已成功翻译。",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "翻译失败",
        description: error.message || "翻译失败，请稍后重试。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "复制成功",
        description: "翻译文本已复制到剪贴板。",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }).catch(() => {
      toast({
        title: "复制失败",
        description: "无法复制文本，请手动复制。",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    });
  };

  const getServiceName = (serviceId: string) => {
    const serviceMap: { [key: string]: string } = {
      google: "谷歌翻译",
      openai: "OpenAI",
      tongyi: "通义千问",
      deepl: "DeepL",
      siliconflow: "硅基流动",
      deepseek: "深度求索",
    };
    if (serviceId.startsWith("custom_")) {
      const customAPI = customAPIs.find(api => api.id === serviceId);
      return customAPI ? customAPI.name : serviceId;
    }
    return serviceMap[serviceId] || serviceId;
  };

  return (
    <VStack align="stretch" spacing={8} bg="gray.800" p={8} borderRadius="lg" boxShadow="xl">
      <Grid templateColumns="repeat(2, 1fr)" gap={6} width="100%">
        <GridItem>
          <Select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            bg="gray.700"
            borderColor="gray.600"
            transition="all 0.3s ease"
            _hover={{ borderColor: "brand.500" }}
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
          >
            <option value="auto">检测源语言</option>
            <option value="zh">中文</option>
            <option value="en">英语</option>
            <option value="ja">日语</option>
            <option value="fr">法语</option>
            <option value="ko">韩语</option>
            <option value="ru">俄语</option>
          </Select>
        </GridItem>
        <GridItem>
          <Select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            bg="gray.700"
            borderColor="gray.600"
            transition="all 0.3s ease"
            _hover={{ borderColor: "brand.500" }}
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
          >
            <option value="en">英语</option>
            <option value="zh">中文</option>
            <option value="ja">日语</option>
            <option value="fr">法语</option>
            <option value="ko">韩语</option>
            <option value="ru">俄语</option>
          </Select>
        </GridItem>
      </Grid>

      <Textarea
        placeholder="请输入您需要翻译的文本"
        value={text}
        onChange={(e) => setText(e.target.value)}
        height="250px"
        resize="vertical"
        bg="gray.700"
        borderColor="gray.600"
        p={4}
      />

      <Button
        colorScheme="brand"
        onClick={handleTranslate}
        isDisabled={!text || loading}
        width="100%"
        leftIcon={loading ? <Spinner size="sm" /> : undefined}
        _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
        _active={{ transform: "translateY(1px)" }}
        transition="all 0.3s ease"
      >
        {loading ? "翻译中..." : "翻译"}
      </Button>

      <VStack align="stretch" spacing={4}>
        {translations.map((t, index) => (
          <Box
            key={index}
            p={4}
            bg="gray.700"
            borderRadius="md"
            boxShadow="md"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="bold" color="brand.200">{t.name}</Text>
              <IconButton
                aria-label={`复制来自${t.name}的翻译文本`}
                icon={<CopyIcon />}
                size="sm"
                colorScheme="brand"
                variant="ghost"
                onClick={() => handleCopy(t.text)}
              />
            </Flex>
            <Text>{t.text}</Text>
          </Box>
        ))}
      </VStack>

      {/* 集成历史记录组件 */}
      <TranslationHistory />
    </VStack>
  );
};

export default TranslationInput;