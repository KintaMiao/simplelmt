import { createContext, useContext, useState, ReactNode } from "react";

interface CustomAPI {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
}

interface TranslationContextProps {
  services: string[];
  setServices: (services: string[]) => void;
  customAPIs: CustomAPI[];
  addCustomAPI: (api: CustomAPI) => void;
  removeCustomAPI: (id: string) => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [services, setServices] = useState<string[]>(["openai"]);
  const [customAPIs, setCustomAPIs] = useState<CustomAPI[]>([]);

  const addCustomAPI = (api: CustomAPI) => {
    setCustomAPIs([...customAPIs, api]);
    setServices([...services, api.id]);
  };

  const removeCustomAPI = (id: string) => {
    setCustomAPIs(customAPIs.filter(api => api.id !== id));
    setServices(services.filter(service => service !== id));
  };

  return (
    <TranslationContext.Provider value={{ services, setServices, customAPIs, addCustomAPI, removeCustomAPI }}>
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
