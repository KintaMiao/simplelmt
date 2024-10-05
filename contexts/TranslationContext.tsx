import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// 定义翻译记录类型
interface TranslationRecord {
  id: string;
  inputText: string;
  sourceLang: string;
  targetLang: string;
  service: string;
  translatedText: string;
  timestamp: string;
}

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
  history: TranslationRecord[];
  addHistory: (record: TranslationRecord) => void;
  clearHistory: () => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [services, setServices] = useState<string[]>([]);
  const [customAPIs, setCustomAPIs] = useState<CustomAPI[]>([]);
  const [history, setHistory] = useState<TranslationRecord[]>([]);

  useEffect(() => {
    // 从 localStorage 加载数据
    const savedServices = localStorage.getItem('services');
    const savedCustomAPIs = localStorage.getItem('customAPIs');
    const savedHistory = localStorage.getItem('history');

    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      setServices(["openai"]); // 默认值
    }

    if (savedCustomAPIs) {
      setCustomAPIs(JSON.parse(savedCustomAPIs));
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    // 保存数据到 localStorage
    localStorage.setItem('services', JSON.stringify(services));
    localStorage.setItem('customAPIs', JSON.stringify(customAPIs));
    localStorage.setItem('history', JSON.stringify(history));
  }, [services, customAPIs, history]);

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
    localStorage.removeItem('history');
    setServices(["openai"]);
    setCustomAPIs([]);
    setHistory([]);
  };

  const addHistory = (record: TranslationRecord) => {
    setHistory(prevHistory => [record, ...prevHistory]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('history');
  };

  return (
    <TranslationContext.Provider value={{ services, setServices, customAPIs, addCustomAPI, removeCustomAPI, editCustomAPI, clearData, history, addHistory, clearHistory }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslationContext 必须在 TranslationProvider 内使用");
  }
  return context;
};