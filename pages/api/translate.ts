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
const translateWithOpenAI = async (text: string, source: string, target: string): Promise<string> => {
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
  };

  // 配置请求参数
  const config = {
    method: 'post',
    url: 'https://api.openai.com/',
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
    console.error('翻译请求失败:', error.response?.data || error.message);
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
