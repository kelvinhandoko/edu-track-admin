import "@/styles/globals.css";

import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}