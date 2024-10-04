"use client";

import { Box, Heading, VStack, HStack, Button, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Select, useDisclosure, Text } from "@chakra-ui/react";
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
  // 添加更多服务
];

const TranslationServices = () => {
  const { services, setServices } = useTranslationContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedService, setSelectedService] = useState<string>("");

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
      <Button
        onClick={onOpen}
        colorScheme="brand"
        size="md"
        leftIcon={<AddIcon />}
      >
        添加更多翻译服务
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>添加翻译服务</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button colorScheme="brand" onClick={addService} isDisabled={!selectedService}>
              添加
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default TranslationServices;