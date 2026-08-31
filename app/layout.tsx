import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Araucaria em Acao | Gestao Urbana Inteligente',
  description:
    'Prototipo de plataforma municipal para ocorrencias urbanas, frota com IA e ordens de servico.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
