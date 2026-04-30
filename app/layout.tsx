import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations"; // 👈 1. import frFR
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotificationBellWrapper from "./components/NotificationBellWrapper";
import { Suspense } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Moubadala.ma - Échangez vos Biens et Services entre Professionnels",
  description:
    "La plateforme d'échange inter-entreprises pour une nouvelle forme de croissance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={frFR}> {/* 👈 2. add localization prop */}
      <html lang="fr" className={poppins.variable}>
        <body className="antialiased">
          <Header
            notificationBell={
              <Suspense fallback={null}>
                <NotificationBellWrapper />
              </Suspense>
            }
          />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}