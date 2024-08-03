import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/Session";
import { Toaster } from "sonner";
import { WsProvider } from "./WsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
        <WsProvider>
          <GlobalProvider>
            <Toaster richColors expand={true} />
            {children}
          </GlobalProvider>
        </WsProvider>
      </body>
    </html>
  );
}
