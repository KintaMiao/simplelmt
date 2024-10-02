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
