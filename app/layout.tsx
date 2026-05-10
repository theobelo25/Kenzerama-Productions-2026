import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Questrial } from "next/font/google";
import "@/assets/styles/globals.css";
import {
  APP_NAME,
  APP_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SERVER_URL,
  SITE_LOCALE,
  TWITTER_HANDLE,
} from "@/lib/constants";
import { ViewTransitions } from "next-view-transitions";
import TransitionLoadingIndicator from "@/components/transition-loading-indicator";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    template: `%s | Kenzerama Productions`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: "/",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kenzerama Productions Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    creator: TWITTER_HANDLE || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  applicationName: APP_NAME,
  creator: APP_NAME,
  publisher: APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`
          ${cinzel.variable} 
          ${playfairDisplay.variable} 
          ${questrial.variable} 
          antialiased
        `}
      >
        <ViewTransitions>
          {children}
          <TransitionLoadingIndicator />
        </ViewTransitions>
      </body>
    </html>
  );
}
