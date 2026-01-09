import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { AppProviders } from "@/contexts/AppProviders";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthCare - Healthcare Platform",
  description: "Manage your health with HealthCare, the comprehensive healthcare platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <AppProviders>
          <AppLayout>{children}</AppLayout>
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            expand={false}
            offset="16px"
            duration={3000}
            toastOptions={{
              style: {
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
              },
              className: 'shadow-lg',
            }}
          />
        </AppProviders>
      </body>
    </html>
  );
}
