
# Translation App

## 项目简介

Translation App 是一个使用多个大语言模型的翻译工具，支持多种翻译服务，包括谷歌翻译、OpenAI、通义千问和DeepL。

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
```

### Tailwind CSS 配置

Tailwind CSS 的配置文件位于 `tailwind.config.ts`。

```typescript:tailwind.config.ts
startLine: 1
endLine: 19
```

### PostCSS 配置

PostCSS 的配置文件位于 `postcss.config.mjs`。

```typescript:postcss.config.mjs
startLine: 1
endLine: 9
```

### TypeScript 配置

TypeScript 的配置文件位于 `tsconfig.json`。

```json:tsconfig.json
startLine: 1
endLine: 27
```

## 主要文件说明

### `app/layout.tsx`

定义了应用的根布局，包括全局样式和元数据。

```typescript:app/layout.tsx
startLine: 1
endLine: 19
```

### `app/page.tsx`

定义了主页的布局和内容。

```typescript:app/page.tsx
startLine: 1
endLine: 23
```

### `components/TranslationInput.tsx`

定义了翻译输入组件，用户可以在此输入需要翻译的文本并选择源语言和目标语言。

```typescript:components/TranslationInput.tsx
startLine: 1
endLine: 100
```

### `components/TranslationServices.tsx`

定义了翻译服务选择组件，用户可以在此选择和管理翻译服务。

```typescript:components/TranslationServices.tsx
startLine: 1
endLine: 90
```

### `contexts/TranslationContext.tsx`

定义了翻译服务的上下文，用于在组件间共享翻译服务的状态。

```typescript:contexts/TranslationContext.tsx
startLine: 1
endLine: 30
```

### `pages/api/translate.ts`

定义了翻译 API 的处理函数，处理翻译请求并调用相应的翻译服务。

```typescript:pages/api/translate.ts
startLine: 1
endLine: 122
```

## 贡献

欢迎提交 issue 和 pull request 来帮助改进这个项目。

## 许可证

本项目采用 MIT 许可证。