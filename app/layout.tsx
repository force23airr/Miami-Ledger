import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miami Ledger — Independent journalism from the 305",
  description:
    "Local news, fintech, engineering, and academic dispatches from Miami. Read the Ledger or switch to the Terminal for the live feed.",
  metadataBase: new URL("https://miamiledger.org"),
  openGraph: {
    title: "Miami Ledger",
    description: "Independent journalism from the 305 — and a live news terminal.",
    url: "https://miamiledger.org",
    siteName: "Miami Ledger",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Masthead />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
