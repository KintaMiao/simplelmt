import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import Translate from "@google-cloud/translate";

// 定义响应数据类型
type Data = {
  translatedText?: string;
  error?: string;
};

// 主处理函数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "方法不允许" });
    return;
  }

  const { text, sourceLang, targetLang, service, customAPIs } = req.body;

  if (!text || !targetLang || !service) {
    res.status(400).json({ error: "缺少参数" });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  });

  try {
    if (service.startsWith("custom_")) {
      const customAPI = customAPIs.find((api: CustomAPI) => api.id === service);
      if (customAPI) {
        await translateWithCustomAPI(text, sourceLang, targetLang, customAPI, res);
      } else {
        throw new Error("未找到自定义API配置");
      }
    } else {
      switch (service) {
        case "openai":
          await translateWithOpenAI(text, sourceLang, targetLang, res);
          break;
        case "deepseek":
          await translateWithDeepSeek(text, sourceLang, targetLang, res);
          break;
        // 其他服务保持不变
        default:
          throw new Error("未知的翻译服务");
      }
    }
  } catch (error: any) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message || "内部服务器错误" })}\n\n`);
    res.end();
  }
}

// 渠道: 谷歌翻译
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

// 渠道: OpenAI
const translateWithOpenAI = async (text: string, source: string, target: string, res: NextApiResponse): Promise<void> => {
  // 从环境变量中获取 API 密钥
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API 密钥未配置");
  }

  // 构建请求数据
  const data = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `请将以下文本从${source}翻译成${target}语言：${text}`,
      },
    ],
    stream: true,
  };

  // 配置请求参数
  const config = {
    method: 'post',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: { 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${apiKey}`, 
      'Content-Type': 'application/json'
    },
    data: data,
    responseType: 'stream' as 'stream'
  };

  try {
    // 发送请求
    const response = await axios(config);
    
    response.data.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          res.write('event: done\ndata: [DONE]\n\n');
          return;
        }
        try {
          const parsed = JSON.parse(message);
          const content = parsed.choices[0].delta.content;
          if (content) {
            res.write(`data: ${content}\n\n`);
          }
        } catch (error) {
          console.error('解析SSE消息时出错:', error);
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });
  } catch (error: any) {
    console.error('OpenAI翻译请求失败:', error.response?.data || error.message);
    throw new Error(`翻译失败: ${error.response?.data?.error?.message || error.message}`);
  }
};

// 渠道: 通义千问
const translateWithTongyi = async (text: string, source: string, target: string): Promise<string> => {
  // 从环境变量中获取 API 密钥
  const apiKey = process.env.TONGYI_API_KEY;

  if (!apiKey) {
    throw new Error("通义千问 API 密钥未配置");
  }

  // 构建请求数据
  const data = {
    model: "qwen-turbo",
    input: {
      messages: [
        {
          role: "user",
          content: `请将以下文本从${source}翻译成${target}语言：${text}`,
        },
      ],
    },
  };

  // 配置请求参数
  const config = {
    method: 'post',
    url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    headers: { 
      'Authorization': `Bearer ${apiKey}`, 
      'Content-Type': 'application/json'
    },
    data: data,
  };

  try {
    // 发送请求
    const response = await axios(config);
    
    // 检查响应结构
    if (
      response.data &&
      response.data.output &&
      response.data.output.text
    ) {
      // 提取并返回翻译结果
      const translatedText = response.data.output.text.trim();
      return translatedText;
    } else {
      throw new Error("无效的响应结构");
    }
  } catch (error: any) {
    console.error('通义千问翻译请求失败:', error.response?.data || error.message);
    throw new Error(`翻译失败: ${error.response?.data?.error?.message || error.message}`);
  }
};

// 渠道: DeepL
const translateWithDeepL = async (text: string, source: string, target: string): Promise<string> => {
  // 从环境变量中获取 API 密钥
  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey) {
    throw new Error("DeepL API 密钥未配置");
  }

  // 构建请求数据
  const data = new URLSearchParams({
    text: text,
    source_lang: source.toUpperCase(),
    target_lang: target.toUpperCase(),
  });

  // 配置请求参数
  const config = {
    method: 'post',
    url: 'https://api-free.deepl.com/v2/translate',
    headers: { 
      'Authorization': `DeepL-Auth-Key ${apiKey}`, 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data,
  };

  try {
    // 发送请求
    const response = await axios(config);
    
    // 检查响应结构
    if (
      response.data &&
      response.data.translations &&
      response.data.translations.length > 0 &&
      response.data.translations[0].text
    ) {
      // 提取并返回翻译结果
      const translatedText = response.data.translations[0].text.trim();
      return translatedText;
    } else {
      throw new Error("无效的响应结构");
    }
  } catch (error: any) {
    console.error('DeepL翻译请求失败:', error.response?.data || error.message);
    throw new Error(`翻译失败: ${error.response?.data?.message || error.message}`);
  }
};

// 渠道: 硅基流动
const translateWithSiliconFlow = async (text: string, source: string, target: string): Promise<string> => {
  // 从环境变量中获取 API 密钥
  const apiKey = process.env.SILICONFLOW_API_KEY;

  if (!apiKey) {
    throw new Error("硅基流动 API 密钥未配置");
  }

  // 构建请求数据
  const data = {
    model: "Qwen/Qwen2.5-32B-Instruct",
    messages: [
      {
        role: "user",
        content: `请将以下文本从${source}翻译成${target}��言：${text}`,
      },
    ],
  };

  // 配置请求参数
  const config = {
    method: 'post',
    url: 'https://api.siliconflow.cn/v1/chat/completions',
    headers: { 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${apiKey}`, 
      'Content-Type': 'application/json'
    },
    data: data,
  };

  try {
    // 发送请求
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
      const translatedText = response.data.choices[0].message.content.trim();
      return translatedText;
    } else {
      throw new Error("无效的响应结构");
    }
  } catch (error: any) {
    console.error('硅基流动翻译请求失败:', error.response?.data || error.message);
    throw new Error(`翻译失败: ${error.response?.data?.error?.message || error.message}`);
  }
};

// 渠道: 深度求索
const translateWithDeepSeek = async (text: string, source: string, target: string, res: NextApiResponse): Promise<void> => {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DeepSeek API 密钥未配置");
  }

  const data = {
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: `请将以下文本从${source}翻译成${target}语言：${text}`,
      },
    ],
    stream: true,
  };

  const config = {
    method: 'post',
    url: 'https://api.deepseek.com/v1/chat/completions',
    headers: { 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${apiKey}`, 
      'Content-Type': 'application/json'
    },
    data: data,
    responseType: 'stream' as 'stream'
  };

  try {
    const response = await axios(config);
    
    response.data.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          res.write('event: done\ndata: [DONE]\n\n');
          return;
        }
        try {
          const parsed = JSON.parse(message);
          const content = parsed.choices[0].delta.content;
          if (content) {
            res.write(`data: ${content}\n\n`);
          }
        } catch (error) {
          console.error('解析SSE消息时出错:', error);
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });
  } catch (error: any) {
    console.error('DeepSeek翻译请求失败:', error.response?.data || error.message);
    throw new Error(`翻译失败: ${error.response?.data?.error?.message || error.message}`);
  }
};

// 渠道: 自定义API
const translateWithCustomAPI = async (text: string, source: string, target: string, customAPI: any, res: NextApiResponse): Promise<void> => {
  const data = {
    model: customAPI.model,
    messages: [
      {
        role: "user",
        content: `请将以下文本从${source}翻译成${target}语言：${text}`,
      },
    ],
    stream: true,
  };

  const config = {
    method: 'post',
    url: customAPI.endpoint,
    headers: { 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${customAPI.apiKey}`, 
      'Content-Type': 'application/json'
    },
    data: data,
    responseType: 'stream' as 'stream'
  };

  try {
    const response = await axios(config);
    
    response.data.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          res.write('event: translationComplete\ndata: \n\n');
          return;
        }
        try {
          const parsed = JSON.parse(message);
          const content = parsed.choices[0].delta.content;
          if (content) {
            res.write(`data: ${content}\n\n`);
          }
        } catch (error) {
          console.error('解析SSE消息时出错:', error);
        }
      }
    });

    response.data.on('end', () => {
      // 在流结束时发送一个明确的结束事件
      res.write('event: translationComplete\ndata: \n\n');
      res.end();
    });
  } catch (error: any) {
    console.error('自定义API翻译请求失败:', error.response?.data || error.message);
    throw new Error(`翻译失败: ${error.response?.data?.error?.message || error.message}`);
  }
};

interface CustomAPI {
  id: string;
  // 添加其他必要的属性
}