import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TZM Multi Service — Mecânica Automotiva | São Gabriel, BA",
  description:
    "Mecânica automotiva de confiança em São Gabriel, BA. Troca de óleo, revisão, suspensão, freios e mais. Agende online!",
  keywords:
    "mecânica, automotiva, São Gabriel, Bahia, troca de óleo, revisão, suspensão, freios, agendamento",
  openGraph: {
    title: "TZM Multi Service — Mecânica Automotiva",
    description:
      "Mecânica de confiança em São Gabriel, BA. Agende seu serviço online!",
    url: "https://tzmmultiservice.com.br",
    siteName: "TZM Multi Service",
    locale: "pt_BR",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/logo-dark.jpeg", type: "image/jpeg" },
      { url: "/images/logo-light.jpeg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.svg",
    apple: "/images/logo-light.jpeg",
  },
};

export const viewport: Viewport = {
  themeColor: "#E65C00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`
          }}
        />
      </body>
    </html>
  );
}
