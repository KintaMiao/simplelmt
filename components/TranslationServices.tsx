"use client";

import { Box, Heading, VStack, HStack, Button, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Select, useDisclosure, Text, Input, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useTranslationContext } from "../contexts/TranslationContext";

interface Service {
  id: string;
  name: string;
}

const allAvailableServices: Service[] = [
  { id: "google", name: "谷歌翻译" },
  { id: "openai", name: "OpenAI" },
  { id: "tongyi", name: "通义千问" },
  { id: "deepl", name: "DeepL" },
];

const TranslationServices = () => {
  const { services, setServices, customAPIs, addCustomAPI, removeCustomAPI } = useTranslationContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedService, setSelectedService] = useState<string>("");
  const [customAPIName, setCustomAPIName] = useState("");
  const [customAPIEndpoint, setCustomAPIEndpoint] = useState("");
  const [customAPIKey, setCustomAPIKey] = useState("");

  const removeService = (id: string) => {
    setServices(services.filter(service => service !== id));
  };

  const addService = () => {
    if (selectedService && !services.includes(selectedService)) {
      setServices([...services, selectedService]);
    }
    onClose();
    setSelectedService("");
  };

  const handleAddCustomAPI = () => {
    const id = `custom_${Date.now()}`;
    addCustomAPI({
      id,
      name: customAPIName,
      endpoint: customAPIEndpoint,
      apiKey: customAPIKey
    });
    setCustomAPIName("");
    setCustomAPIEndpoint("");
    setCustomAPIKey("");
    onClose();
  };

  return (
    <VStack align="stretch" spacing={4} bg="gray.800" p={6} borderRadius="lg" boxShadow="xl">
      <Heading size="md" mb={2}>翻译服务</Heading>
      {services.map(serviceId => {
        const service = allAvailableServices.find(s => s.id === serviceId);
        return (
          service && (
            <HStack key={service.id} justifyContent="space-between" bg="gray.700" p={3} borderRadius="md">
              <Text>{service.name}</Text>
              <IconButton
                aria-label="Remove service"
                icon={<CloseIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => removeService(service.id)}
              />
            </HStack>
          )
        );
      })}
      {customAPIs.map(api => (
        <HStack key={api.id} justifyContent="space-between" bg="gray.700" p={3} borderRadius="md">
          <Text>{api.name}</Text>
          <IconButton
            aria-label="Remove custom API"
            icon={<CloseIcon />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={() => removeCustomAPI(api.id)}
          />
        </HStack>
      ))}
      <Button
        onClick={onOpen}
        colorScheme="brand"
        size="md"
        leftIcon={<AddIcon />}
      >
        添加翻译服务
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>添加翻译服务</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>预设服务</Tab>
                <Tab>自定义API</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Select
                    placeholder="选择翻译服务"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    bg="gray.700"
                    borderColor="gray.600"
                  >
                    {allAvailableServices.map(service => (
                      <option key={service.id} value={service.id} disabled={services.includes(service.id)}>
                        {service.name}
                      </option>
                    ))}
                  </Select>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={4}>
                    <Input
                      placeholder="API名称"
                      value={customAPIName}
                      onChange={(e) => setCustomAPIName(e.target.value)}
                      bg="gray.700"
                      borderColor="gray.600"
                    />
                    <Input
                      placeholder="API端点"
                      value={customAPIEndpoint}
                      onChange={(e) => setCustomAPIEndpoint(e.target.value)}
                      bg="gray.700"
                      borderColor="gray.600"
                    />
                    <Input
                      placeholder="API密钥"
                      type="password"
                      value={customAPIKey}
                      onChange={(e) => setCustomAPIKey(e.target.value)}
                      bg="gray.700"
                      borderColor="gray.600"
                    />
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button 
              colorScheme="brand" 
              onClick={() => {
                if (selectedService) {
                  addService();
                } else {
                  handleAddCustomAPI();
                }
              }}
              isDisabled={!selectedService && (!customAPIName || !customAPIEndpoint || !customAPIKey)}
            >
              添加
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default TranslationServices;