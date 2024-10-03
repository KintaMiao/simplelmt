# SimpleLMT

## 项目简介

SimpleLMT 是一个使用多个大语言模型的翻译工具，支持多种翻译服务，包括谷歌翻译、OpenAI、通义千问和 DeepL。

## 功能特性

- 支持多种翻译服务
- 支持多种语言的翻译
- 使用 Chakra UI 进行界面设计
- 使用 Tailwind CSS 进行样式管理
- 使用 Next.js 进行服务端渲染

## 目录结构

```plaintext
.
├── .gitignore
├── .vscode
│   └── settings.json
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── TranslationInput.tsx
│   └── TranslationServices.tsx
├── contexts
│   └── TranslationContext.tsx
├── next.config.mjs
├── package.json
├── pages
│   └── api
│       └── translate.ts
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 安装与运行

### 环境要求

- Node.js
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或者
yarn install
```

### 运行开发服务器

```bash
npm run dev
# 或者
yarn dev
```

### 构建项目

```bash
npm run build
# 或者
yarn build
```

### 启动生产服务器

```bash
npm start
# 或者
yarn start
```

## 配置

### 环境变量

请在项目根目录下创建 `.env.local` 文件，并添加以下内容：

```plaintext
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_KEYFILE=path_to_your_google_cloud_keyfile.json
```

### Tailwind CSS 配置

Tailwind CSS 的配置文件位于 `tailwind.config.ts`。

```typescript:tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
```

### PostCSS 配置

PostCSS 的配置文件位于 `postcss.config.mjs`。

```typescript:postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

### TypeScript 配置

TypeScript 的配置文件位于 `tsconfig.json`。

```json:tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 主要文件说明

### `app/layout.tsx`

定义了应用的根布局，包括全局样式和元数据。

```typescript:app/layout.tsx
import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "SimpleLMT",
  description: "使用多个大语言模型的翻译工具",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### `app/page.tsx`

定义了主页的布局和内容。

```typescript:app/page.tsx
"use client";

import { Box, Flex } from "@chakra-ui/react";
import TranslationInput from "../components/TranslationInput";
import TranslationServices from "../components/TranslationServices";

const Home = () => {
  return (
    <Flex
      height="100vh"
      bg="gray.800"
      color="white"
      p={4}
      direction={{ base: "column", md: "row" }}
    >
      {/* 左侧输入区域 */}
      <Box flex="3" mr={{ md: 4 }} mb={{ base: 4, md: 0 }}>
        <TranslationInput />
      </Box>

      {/* 右侧服务选择区域 */}
      <Box flex="1">
        <TranslationServices />
      </Box>
    </Flex>
  );
};

export default Home;
```

### `components/TranslationInput.tsx`

定义了翻译输入组件，用户可以在此输入需要翻译的文本并选择源语言和目标语言。

```typescript:components/TranslationInput.tsx
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
  const { services } = useTranslationContext();
  const [translations, setTranslations] = useState<{ service: string; text: string }[]>([]);
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
        })
      );

      const results = await Promise.all(promises);
      const newTranslations = results.map((res, index) => ({
        service: services[index],
        text: res.data.translatedText,
      }));
      setTranslations(newTranslations);

      toast({
        title: "翻译成功",
        description: "您的文本已成功翻译。",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "翻译失败",
        description: error.response?.data?.error || "翻译失败，请稍后重试。",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "复制成功",
        description: "翻译文本已复制到剪贴板。",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }).catch(() => {
      toast({
        title: "复制失败",
        description: "无法复制文本，请手动复制。",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const getServiceName = (serviceId: string) => {
    const serviceMap: { [key: string]: string } = {
      google: "谷歌翻译",
      openai: "OpenAI",
      tongyi: "通义千问",
      deepl: "DeepL",
      // 添加更多服务名称映射
    };
    return serviceMap[serviceId] || serviceId;
  };

  return (
    <VStack align="stretch" spacing={4}>
      {/* 语言选择 */}
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <Select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} width="100%">
            <option value="auto">检测源语言</option>
            <option value="zh">中文</option>
            <option value="en">英语</option>
            <option value="ja">日语</option>
            <option value="fr">法语</option>
            <option value="ko">韩语</option>
            <option value="ru">俄语</option>
            {/* 添加更多语言 */}
          </Select>
        </GridItem>
        <GridItem>
          <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} width="100%">
            <option value="en">英语</option>
            <option value="zh">中文</option>
            <option value="ja">日语</option>
            <option value="fr">法语</option>
            <option value="ko">韩语</option>
            <option value="ru">俄语</option>
            {/* 添加更多语言 */}
          </Select>
        </GridItem>
      </Grid>

      {/* 文本输入框 */}
      <Textarea
        placeholder="请输入您需要翻译的文本"
        value={text}
        onChange={(e) => setText(e.target.value)}
        height="300px"
        resize="vertical"
      />

      {/* 翻译按钮 */}
      <Button
        colorScheme="teal"
        onClick={handleTranslate}
        isDisabled={!text || loading}
        width="100%"
        leftIcon={loading ? <Spinner size="sm" /> : undefined}
      >
        {loading ? "翻译中..." : "翻译"}
      </Button>

      {/* 翻译结果展示 */}
      <Box mt={4}>
        {translations.map((t, index) => (
          <Box
            key={index}
            mb={2}
            p={4}
            bg="gray.700"
            borderRadius="md"
            boxShadow="md"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="bold">{getServiceName(t.service)}</Text>
              <IconButton
                aria-label={`复制来自${getServiceName(t.service)}的翻译文本`}
                icon={<CopyIcon />}
                size="sm"
                onClick={() => handleCopy(t.text)}
              />
            </Flex>
            <Text>{t.text}</Text>
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

export default TranslationInput;
```

### `components/TranslationServices.tsx`

定义了翻译服务选择组件，用户可以在此选择和管理翻译服务。

```typescript:components/TranslationServices.tsx
"use client";

import { Box, Heading, VStack, HStack, Button, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Select, useDisclosure, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
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
    <VStack align="stretch" spacing={4}>
      <Heading size="md">翻译服务</Heading>
      {services.map(serviceId => {
        const service = allAvailableServices.find(s => s.id === serviceId);
        return (
          service && (
            <HStack key={service.id} justifyContent="space-between" bg="gray.700" p={2} borderRadius="md">
              <Text>{service.name}</Text>
              <IconButton
                aria-label="移除服务"
                icon={<CloseIcon />}
                size="sm"
                onClick={() => removeService(service.id)}
              />
            </HStack>
          )
        );
      })}
      <Button
        onClick={onOpen}
        colorScheme="teal"
        size="sm"
        _hover={{ bg: "teal.500" }}
        _active={{ bg: "teal.600" }}
      >
        添加更多翻译服务
      </Button>

      {/* 添加服务的模态框 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>添加翻译服务</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select placeholder="选择翻译服务" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
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
            <Button colorScheme="teal" onClick={addService} isDisabled={!selectedService}>
              添加
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default TranslationServices;
```

### `contexts/TranslationContext.tsx`

定义了翻译服务的上下文，用于在组件间共享翻译服务的状态。

```typescript:contexts/TranslationContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface TranslationContextProps {
  services: string[];
  setServices: (services: string[]) => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [services, setServices] = useState<string[]>(["openai"]);

  return (
    <TranslationContext.Provider value={{ services, setServices }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslationContext 必须在 TranslationProvider 内部使用");
  }
  return context;
};
```

### `pages/api/translate.ts`

定义了翻译 API 的处理函数，处理翻译请求并调用相应的翻译服务。

```typescript:pages/api/translate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import Translate from "@google-cloud/translate";

// 定义响应数据类型
type Data = {
  translatedText?: string;
  error?: string;
};

// 主处理函数
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { text, sourceLang, targetLang, service } = req.body;

  if (!text || !targetLang || !service) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  try {
    let translatedText = "";

    switch (service) {
      case "google":
        translatedText = await translateWithGoogle(text, sourceLang, targetLang);
        break;
      case "openai":
        translatedText = await translateWithOpenAI(text, sourceLang, targetLang);
        break;
      case "tongyi":
        translatedText = await translateWithTongyi(text, sourceLang, targetLang);
        break;
      case "deepl":
        translatedText = await translateWithDeepL(text, sourceLang, targetLang);
        break;
      default:
        throw new Error("未知的翻译服务");
    }

    res.status(200).json({ translatedText });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "内部服务器错误" });
  }
}

// 修改后的谷歌翻译函数
const translateWithGoogle = async (text: string, source: string, target: string): Promise<string> => {
  const { Translate } = require('@google-cloud/translate').v2;

  // 从环境变量中获取 Google Cloud 项目 ID 和凭据文件路径
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const keyFilename = process.env.GOOGLE_CLOUD_KEYFILE;

  if (!projectId || !keyFilename) {
    throw new Error("Google Cloud 项目ID或密钥文件路径未配置");
  }

  const translate = new Translate({ projectId, keyFilename });

  try {
    const [translation] = await translate.translate(text, {
      from: source,
      to: target,
    });
    return translation;
  } catch (error: any) {
    console.error('谷歌翻译请求失败:', error);
    throw new Error(`翻译失败: ${error.message}`);
  }
};

// 修改后的 OpenAI 翻译函数
const translateWithOpenAI = async (text: string, source: string, target: string): Promise<string> => {
  // 从环境变量中获取 API 密钥
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API 密钥未配置");
  }

  // 构建请求数据
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `请将以下文本从${source}翻译成${target}语言：${text}`,
      },
    ],
  };

  // 配置请求参数
  const config = {
    method: 'post',
    url: 'https://one.ooo.cool/v1/chat/completions',
    headers: { 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${apiKey}`, 
      'Content-Type': 'application/json'
    },
    data: data,
  };

  try {
    const response = await axios(config);

    // 检查响应结构
    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      // 提取并返回翻译结果
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error("OpenAI 响应结构不符合预期");
    }
  } catch (error: any) {
    console.error('OpenAI 翻译请求失败:', error);
    throw new Error(`翻译失败: ${error.message}`);
  }
};

// TODO: 实现 Tongyi 和 DeepL 的翻译函数
const translateWithTongyi = async (text: string, source: string, target: string): Promise<string> => {
  // 实现通义千问的翻译逻辑
  return "通义千问的翻译结果";
};

const translateWithDeepL = async (text: string, source: string, target: string): Promise<string> => {
  // 实现 DeepL 的翻译逻辑
  return "DeepL 的翻译结果";
};
```

## 贡献

欢迎提交 issue 和 pull request 来帮助改进这个项目。

## 许可证

本项目采用 MIT 许可证。

# 其他文件

### `.gitignore`

```gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
out/

/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### `next.config.mjs`

```typescript:next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

### `package.json`

```json:package.json
{
  "name": "translation-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@chakra-ui/icons": "^2.2.1",
    "@chakra-ui/react": "^2.9.1",
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "@google-cloud/translate": "^8.5.0",
    "axios": "^1.7.7",
    "framer-motion": "^11.9.0",
    "next": "14.2.14",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.14",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

### `tsconfig.json`

```json:tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `.eslintrc.json`

```json:.eslintrc.json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

### `.vscode/settings.json`

```json:.vscode/settings.json
{
    "editor.tabSize": 2
}
```

### `tailwind.config.ts`

```typescript:tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
```

### `app/globals.css`

```css:app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### `postcss.config.mjs`

```typescript:postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

### `app/providers.tsx`

```typescript:app/providers.tsx
"use client";

import { ReactNode } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { TranslationProvider } from "../contexts/TranslationContext";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ChakraProvider theme={theme}>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </ChakraProvider>
  );
};

export default Providers;
```