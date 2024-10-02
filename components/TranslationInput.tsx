"use client";

import { Box, VStack, Textarea, Select, Button, Spinner, HStack } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useTranslationContext } from "../contexts/TranslationContext";

const TranslationInput = () => {
  const [text, setText] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("en");
  const { services } = useTranslationContext();
  const [translations, setTranslations] = useState<{ service: string; text: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTranslate = async () => {
    if (services.length === 0) {
      alert("请至少选择一个翻译服务");
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
        })
      );

      const results = await Promise.all(promises);
      const newTranslations = results.map((res, index) => ({
        service: services[index],
        text: res.data.translatedText,
      }));
      setTranslations(newTranslations);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "翻译失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      {/* 语言选择 */}
      <HStack spacing={2}>
        <Select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} width="200px">
          <option value="auto">检测源语言</option>
          <option value="zh">中文</option>
          <option value="en">英语</option>
          <option value="zh">日语</option>
          <option value="zh">法语</option>
          <option value="zh">韩语</option>
          <option value="zh">俄语</option>
          {/* 添加更多语言 */}
        </Select>
        <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} width="200px">
          <option value="en">英语</option>
          <option value="zh">中文</option>
          <option value="zh">日语</option>
          <option value="zh">法语</option>
          <option value="zh">韩语</option>
          <option value="zh">俄语</option>
          {/* 添加更多语言 */}
        </Select>
      </HStack>

      {/* 文本输入框 */}
      <Textarea
        placeholder="请输入您需要翻译的文本"
        value={text}
        onChange={(e) => setText(e.target.value)}
        height="300px"
        resize="vertical"
      />

      {/* 翻译按钮 */}
      <Button colorScheme="teal" onClick={handleTranslate} isDisabled={!text || loading}>
        {loading ? <Spinner size="sm" /> : "翻译"}
      </Button>

      {/* 翻译结果展示 */}
      <Box mt={4}>
        {translations.map((t, index) => (
          <Box key={index} mb={2} p={2} bg="gray.700" borderRadius="md">
            <strong>{t.service}:</strong> {t.text}
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

export default TranslationInput;
