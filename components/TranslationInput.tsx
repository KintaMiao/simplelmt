"use client";

import { Box, VStack, Textarea, Select, Button, Spinner, HStack, Grid, GridItem, Collapse, Flex, useToast, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslationContext } from "../contexts/TranslationContext";
import { CopyIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

const TranslationInput = () => {
  const [text, setText] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("en");
  const { services, customAPIs } = useTranslationContext();
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

    try {
      const promises = services.map(service =>
        axios.post("/api/translate", {
          text,
          sourceLang: sourceLang === "auto" ? "" : sourceLang,
          targetLang,
          service,
          customAPIs, // 添加这一行
        })
      );

      const results = await Promise.all(promises);
      const newTranslations = results.map((res, index) => ({
        service: services[index],
        text: res.data.translatedText,
        name: getServiceName(services[index]),
      }));
      setTranslations(newTranslations);

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
        description: error.response?.data?.error || "翻译失败，请稍后重试。",
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
        description: "翻译文本已���制到剪贴板。",
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
    };
    if (serviceId.startsWith("custom_")) {
      const customAPI = customAPIs.find(api => api.id === serviceId);
      return customAPI ? customAPI.name : serviceId;
    }
    return serviceMap[serviceId] || serviceId;
  };

  return (
    <VStack align="stretch" spacing={6} bg="gray.800" p={6} borderRadius="lg" boxShadow="xl">
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <Select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            bg="gray.700"
            borderColor="gray.600"
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
        height="200px"
        resize="vertical"
        bg="gray.700"
        borderColor="gray.600"
      />

      <Button
        colorScheme="brand"
        onClick={handleTranslate}
        isDisabled={!text || loading}
        width="100%"
        leftIcon={loading ? <Spinner size="sm" /> : undefined}
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
    </VStack>
  );
};

export default TranslationInput;