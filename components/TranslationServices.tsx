"use client";

import { Box, Heading, VStack, HStack, Button, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Select, useDisclosure, Text, Input, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { CloseIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useTranslationContext } from "../contexts/TranslationContext";

interface Service {
  id: string;
  name: string;
}

interface CustomAPI {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  model: string;
}

const allAvailableServices: Service[] = [
  { id: "google", name: "谷歌翻译" },
  { id: "openai", name: "OpenAI" },
  { id: "tongyi", name: "通义千问" },
  { id: "deepl", name: "DeepL" },
];

const TranslationServices = () => {
  const { services, setServices, customAPIs, addCustomAPI, removeCustomAPI, editCustomAPI } = useTranslationContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedService, setSelectedService] = useState<string>("");
  const [customAPIName, setCustomAPIName] = useState("");
  const [customAPIEndpoint, setCustomAPIEndpoint] = useState("");
  const [customAPIKey, setCustomAPIKey] = useState("");
  const [editingAPI, setEditingAPI] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEndpoint, setEditEndpoint] = useState("");
  const [editAPIKey, setEditAPIKey] = useState("");
  const [customAPIModel, setCustomAPIModel] = useState("");
  const [editModel, setEditModel] = useState("");

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
      apiKey: customAPIKey,
      model: customAPIModel
    });
    setCustomAPIName("");
    setCustomAPIEndpoint("");
    setCustomAPIKey("");
    setCustomAPIModel("");
    onClose();
  };

  const handleEditCustomAPI = (api: CustomAPI) => {
    setEditingAPI(api.id);
    setEditName(api.name);
    setEditEndpoint(api.endpoint);
    setEditAPIKey(api.apiKey);
    setEditModel(api.model);
    onOpen();
  };

  const handleSaveEdit = () => {
    if (editingAPI) {
      editCustomAPI(editingAPI, {
        name: editName,
        endpoint: editEndpoint,
        apiKey: editAPIKey,
        model: editModel
      });
      setEditingAPI(null);
      onClose();
    }
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
          <HStack>
            <IconButton
              aria-label="Edit custom API"
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={() => handleEditCustomAPI(api)}
            />
            <IconButton
              aria-label="Remove custom API"
              icon={<CloseIcon />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={() => removeCustomAPI(api.id)}
            />
          </HStack>
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
          <ModalHeader>{editingAPI ? "编辑自定义API" : "添加翻译服务"}</ModalHeader>
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
                      placeholder="渠道名称"
                      value={editingAPI ? editName : customAPIName}
                      onChange={(e) => editingAPI ? setEditName(e.target.value) : setCustomAPIName(e.target.value)}
                      bg="gray.700"
                      borderColor="gray.600"
                    />
                    <Input
                      placeholder="API端点(完整URL，包含/v1/chat/completions)"
                      value={editingAPI ? editEndpoint : customAPIEndpoint}
                      onChange={(e) => editingAPI ? setEditEndpoint(e.target.value) : setCustomAPIEndpoint(e.target.value)}
                      bg="gray.700"
                      borderColor="gray.600"
                    />
                    <Input
                      placeholder="API密钥"
                      type="password"
                      value={editingAPI ? editAPIKey : customAPIKey}
                      onChange={(e) => editingAPI ? setEditAPIKey(e.target.value) : setCustomAPIKey(e.target.value)}
                      bg="gray.700"
                      borderColor="gray.600"
                    />
                    <Input
                      placeholder="模型标识符(如gpt-4o-mini)"
                      value={editingAPI ? editModel : customAPIModel}
                      onChange={(e) => editingAPI ? setEditModel(e.target.value) : setCustomAPIModel(e.target.value)}
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
                if (editingAPI) {
                  handleSaveEdit();
                } else if (selectedService) {
                  addService();
                } else {
                  handleAddCustomAPI();
                }
              }}
              isDisabled={
                (editingAPI && (!editName || !editEndpoint || !editAPIKey)) ||
                (!editingAPI && !selectedService && (!customAPIName || !customAPIEndpoint || !customAPIKey))
              }
            >
              {editingAPI ? "保存" : "添加"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default TranslationServices;