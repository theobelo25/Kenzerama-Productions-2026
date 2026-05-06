"use client";

import { ReCaptchaProvider } from "next-recaptcha-v3";

type ContactRecaptchaProviderProps = {
  reCaptchaKey: string;
  children: React.ReactNode;
};

const ContactRecaptchaProvider = ({
  reCaptchaKey,
  children,
}: ContactRecaptchaProviderProps) => {
  if (!reCaptchaKey) {
    return <>{children}</>;
  }

  return (
    <ReCaptchaProvider reCaptchaKey={reCaptchaKey}>{children}</ReCaptchaProvider>
  );
};

export default ContactRecaptchaProvider;
