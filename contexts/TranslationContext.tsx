import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// 定义翻译记录类型
interface TranslationRecord {
  id: string;
  inputText: string;
  sourceLang: string;
  targetLang: string;
  service: string;
  name?: string;
  translatedText: string;
  timestamp: string;
}

export interface CustomAPI {
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
  exportHistory: () => void;
  exportConfig: () => void;
  importConfig: (config: string) => void;
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

  const exportHistory = () => {
    const csvContent = [
      "ID,输入文本,源语言,目标语言,服务,翻译结果,时间戳",
      ...history.map(record => 
        `${record.id},"${record.inputText}",${record.sourceLang},${record.targetLang},${record.service},"${record.translatedText}",${record.timestamp}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "translation_history.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportConfig = () => {
    const config = {
      services,
      customAPIs,
      history
    };
    const configString = JSON.stringify(config);
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simplelmt_config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (configString: string) => {
    try {
      const config = JSON.parse(configString);
      if (config.services) setServices(config.services);
      if (config.customAPIs) setCustomAPIs(config.customAPIs);
      if (config.history) setHistory(config.history);
    } catch (error) {
      console.error('配置导入失败:', error);
    }
  };

  return (
    <TranslationContext.Provider value={{ services, setServices, customAPIs, addCustomAPI, removeCustomAPI, editCustomAPI, clearData, history, addHistory, clearHistory, exportHistory, exportConfig, importConfig }}>
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