# SimpleLMT

## 项目简介

SimpleLMT 是一个使用多个大语言模型的翻译工具，支持多种翻译服务，包括谷歌翻译、OpenAI、通义千问、DeepL和深度求索。

## 功能特性

- 支持多种翻译服务
- 支持多种语言的翻译
- 使用 Chakra UI 进行界面设计
- 使用 Tailwind CSS 进行样式管理
- 使用 Next.js 进行服务端渲染

## To Do List

- [x] 渠道信息持续化存储
- [x] 翻译历史记录
- [x] 翻译历史记录持续化存储
- [x] 配置文件导入导出
- [x] 翻译历史记录导出
- [ ] UI 美化

## 目录结构

```plaintext
.
├── .gitignore
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
TONGYI_API_KEY=your_tongyi_api_key
DEEPL_API_KEY=your_deepl_api_key
SILICONFLOW_API_KEY=your_siliconflow_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

## 说明
1. 仅测试了OpenAI渠道，可以正常使用
2. DeepL使用免费版API端点

## 使用的模型
1. OpenAI：gpt-4o-mini
2. 通义千问：qwen-turbo
3. 硅基流动：Qwen/Qwen2.5-32B-Instruct