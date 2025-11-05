import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "./ClientProviders";

export const metadata: Metadata = {
  title: "Admin App",
  description: "Permissions Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

