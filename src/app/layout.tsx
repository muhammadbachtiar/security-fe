import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/query-client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import ProtectRoutes from "@/providers/protect-routes";

export const metadata: Metadata = {
  title: "Sarana Technology",
  description: "Sarana Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <QueryProvider>
          <AntdRegistry>
            <ProtectRoutes>
              <NextTopLoader />
              <div>{children}</div>
              <Toaster richColors position="top-right" />
            </ProtectRoutes>
          </AntdRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}
