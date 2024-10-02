import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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

// 示例翻译函数：谷歌翻译
const translateWithGoogle = async (text: string, source: string, target: string): Promise<string> => {
  // 实现谷歌翻译 API 调用
  return `谷歌翻译结果: ${text}`; // 示例返回
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

// 示例翻译函数：通义千问
const translateWithTongyi = async (text: string, source: string, target: string): Promise<string> => {
  // 实现通义千问 API 调用
  return `通义千问翻译结果: ${text}`; // 示例返回
};

// 示例翻译函数：DeepL
const translateWithDeepL = async (text: string, source: string, target: string): Promise<string> => {
  // 实现 DeepL API 调用
  return `DeepL 翻译结果: ${text}`; // 示例返回
};
