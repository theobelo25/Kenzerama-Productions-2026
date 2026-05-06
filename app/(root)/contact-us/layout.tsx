import { CAPTCHA_SITE_KEY } from "@/lib/constants";
import ContactRecaptchaProvider from "./recaptcha-provider";

export default function ContactUsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ContactRecaptchaProvider reCaptchaKey={CAPTCHA_SITE_KEY}>
      {children}
    </ContactRecaptchaProvider>
  );
}
