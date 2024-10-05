import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CustomAPI {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  model: string;
}

interface TranslationContextProps {
  services: string[];
  setServices: (services: string[]) => void;
  customAPIs: CustomAPI[];
  addCustomAPI: (api: CustomAPI) => void;
  removeCustomAPI: (id: string) => void;
  editCustomAPI: (id: string, updatedAPI: Partial<CustomAPI>) => void;
  clearData: () => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [services, setServices] = useState<string[]>([]);
  const [customAPIs, setCustomAPIs] = useState<CustomAPI[]>([]);

  useEffect(() => {
    // 从 localStorage 加载数据
    const savedServices = localStorage.getItem('services');
    const savedCustomAPIs = localStorage.getItem('customAPIs');

    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      setServices(["openai"]); // 默认值
    }

    if (savedCustomAPIs) {
      setCustomAPIs(JSON.parse(savedCustomAPIs));
    }
  }, []);

  useEffect(() => {
    // 保存数据到 localStorage
    localStorage.setItem('services', JSON.stringify(services));
    localStorage.setItem('customAPIs', JSON.stringify(customAPIs));
  }, [services, customAPIs]);

  const addCustomAPI = (api: CustomAPI) => {
    setCustomAPIs(prevAPIs => [...prevAPIs, api]);
    setServices(prevServices => [...prevServices, api.id]);
  };

  const removeCustomAPI = (id: string) => {
    setCustomAPIs(prevAPIs => prevAPIs.filter(api => api.id !== id));
    setServices(prevServices => prevServices.filter(service => service !== id));
  };

  const editCustomAPI = (id: string, updatedAPI: Partial<CustomAPI>) => {
    setCustomAPIs(prevAPIs => prevAPIs.map(api => 
      api.id === id ? { ...api, ...updatedAPI } : api
    ));
  };

  const clearData = () => {
    localStorage.removeItem('services');
    localStorage.removeItem('customAPIs');
    setServices(["openai"]);
    setCustomAPIs([]);
  };

  return (
    <TranslationContext.Provider value={{ services, setServices, customAPIs, addCustomAPI, removeCustomAPI, editCustomAPI, clearData }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslationContext must be used within a TranslationProvider");
  }
  return context;
};
