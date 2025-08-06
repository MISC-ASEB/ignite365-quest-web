import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ignite 365 Quest | Microsoft Ignite Students Club",
  description:
    "Solve riddles, unlock Microsoft 365 tools, and showcase your creativity in the Ignite 365 Quest hosted by the Microsoft Ignite Students Club.",
  keywords: [
    "Ignite 365 Quest",
    "Riddle Challenge",
    "Microsoft Ignite Students Club",
    "Amrita Vishwa Vidyapeetham, Bangalore"
  ],
  metadataBase: new URL("https://ignite365quest.ignitestudents.club"),
  openGraph: {
    title: "Ignite 365 Quest | Microsoft Ignite Students Club",
    description:
      "Solve riddles, unlock Microsoft 365 tools, and showcase your creativity in the Ignite 365 Quest.",
    url: "https://ignite365quest.ignitestudents.club",
    siteName: "Ignite 365 Quest",
    locale: "en_US",
    type: "website",
  },
  themeColor: "#0078D4",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
