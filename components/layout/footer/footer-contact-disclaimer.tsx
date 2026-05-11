"use client";

import { usePathname } from "next/navigation";

const FooterContactDisclaimer = () => {
  const pathname = usePathname();

  if (pathname !== "/contact-us") {
    return null;
  }

  return (
    <p className="wrapper pb-6 pt-1 text-center text-[11px] text-muted-foreground font-questrial">
      This site is protected by reCAPTCHA and the Google{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground"
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
};

export default FooterContactDisclaimer;
