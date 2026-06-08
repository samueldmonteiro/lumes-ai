import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono, Geist } from 'next/font/google';
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import { Toaster } from '@/components/ui/sonner';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lumes AI - Assistente de Estudos',
  description: 'Seu assistente virtual inteligente de estudos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakartaSans.variable} ${outfit.variable} ${jetbrainsMono.variable} ${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-init"
          async
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem("lumes_theme");
                if (t !== "light") document.documentElement.classList.add("dark");
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
