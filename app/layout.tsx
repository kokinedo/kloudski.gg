import "../global.css";
import { GeistSans } from "geist/font/sans";
import { Inter } from "@next/font/google";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: {
    default: "kloudski.gg",
    template: "%s | kloudski.gg",
  },
  description: "Founder of Agenthouse",
  openGraph: {
    title: "kloudski.gg",
    description:
      "Founder of Agenthouse",
    url: "https://kloudski.gg",
    siteName: "kloudski.gg",
    images: [
      {
        url: "https://kloudski.gg/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "kloudski",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Add a client component for the Vanta background
const VantaBackground = dynamic(() => import("./components/vanta-bg"), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <Analytics />
        {/* Vanta/Three.js scripts will be loaded in the client component */}
      </head>
      <body
        className={`bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        <VantaBackground />
        {children}
      </body>
    </html>
  );
}
