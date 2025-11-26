import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Questrial } from "next/font/google";
import "@/assets/styles/globals.css";
import {
  APP_NAME,
  APP_DESCRIPTION,
  SERVER_URL,
  CAPTCHA_SITE_KEY,
} from "@/lib/constants";
import { ViewTransitions } from "next-view-transitions";
import { ReCaptchaProvider } from "next-recaptcha-v3";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
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
          <ReCaptchaProvider reCaptchaKey={CAPTCHA_SITE_KEY}>
            {children}
          </ReCaptchaProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
