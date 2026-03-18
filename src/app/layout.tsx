import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], weight: ['400', '500', '600', '700', '800'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "AI Triage Agent",
  description: "Sistema protótipo para agentes de IA com contexto via prompt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <nav className="glass navbar">
          <Link href="/" className="nav-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="logo-icon">🤖</span>
            <h1>Triage<span>AI</span></h1>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Nova Pergunta</Link>
            <Link href="/dashboard" className="nav-link">Setores</Link>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
