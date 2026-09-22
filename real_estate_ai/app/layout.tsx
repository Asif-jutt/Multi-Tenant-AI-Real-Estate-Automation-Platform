import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../src/context/AppContext';

export const metadata: Metadata = {
  title: 'EstateFlow AI — Multi-Tenant AI Real-Estate Operations Platform',
  description: 'Respond faster, recommend verified properties, and convert more inquiries into viewings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
