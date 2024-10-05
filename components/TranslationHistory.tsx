import { Box, VStack, Text, Button, HStack, Flex, IconButton, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Divider } from "@chakra-ui/react";
import { useTranslationContext } from "../contexts/TranslationContext";
import { DeleteIcon } from "@chakra-ui/icons";

const TranslationHistory = () => {
  const { history, clearHistory } = useTranslationContext();

  return (
    <Box mt={6} p={4} bg="gray.700" borderRadius="md" boxShadow="md">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">翻译历史记录</Text>
        {history.length > 0 && (
          <Button size="sm" colorScheme="red" onClick={clearHistory}>
            清除所有历史
          </Button>
        )}
      </Flex>
      {history.length === 0 ? (
        <Text>暂无历史记录。</Text>
      ) : (
        <Accordion allowMultiple>
          {history.map(record => (
            <AccordionItem key={record.id}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {new Date(record.timestamp).toLocaleString()} - {record.name || record.service}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Text fontWeight="bold">输入:</Text>
                    <Text>{record.inputText}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold">源语言:</Text>
                    <Text>{record.sourceLang === "auto" ? "自动检测" : record.sourceLang}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold">目标语言:</Text>
                    <Text>{record.targetLang}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold">服务:</Text>
                    <Text>{record.service}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold">翻译结果:</Text>
                    <Text>{record.translatedText}</Text>
                  </HStack>
                  <Divider />
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Box>
  );
};

export default TranslationHistory;