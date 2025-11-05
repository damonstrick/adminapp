import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from './ClientProviders';

export const metadata: Metadata = {
  title: 'Admin App',
  description: 'Admin dashboard for permissions management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

