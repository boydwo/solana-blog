"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import localFont from "next/font/local";
import { useMemo } from "react";
import { BlogProvider } from "./context/blog";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
         <ConnectionProvider endpoint="https://api.devnet.solana.com">
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <BlogProvider>
              {children}
              </BlogProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
