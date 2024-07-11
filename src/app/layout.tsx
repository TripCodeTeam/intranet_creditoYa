"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/Session";
import { Toaster } from "sonner";
import { WebSocketProvider } from "next-ws/client";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Credito Ya | Intranet",
  description: "Developer by TripCode",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebSocketProvider url="/api/ws">
          <GlobalProvider>
            <Toaster richColors expand={true} />
            {children}
          </GlobalProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}
