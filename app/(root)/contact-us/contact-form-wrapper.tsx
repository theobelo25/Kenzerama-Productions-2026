"use client";
import { useState } from "react";
import { ReCaptcha } from "next-recaptcha-v3";
import { cn } from "@/lib/utils";
import { SN_SRC_URL } from "@/lib/constants";

const ContactFormWrapper = () => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <>
      <ReCaptcha onValidate={setToken} action="page_view" />
      {SN_SRC_URL && (
        <iframe
          aria-label={"Contact Form"}
          src={SN_SRC_URL}
          className={cn(
            "w-full h-[873px]",
            token ? "pointer-events-auto" : "pointer-events-none"
          )}
        />
      )}
    </>
  );
};

export default ContactFormWrapper;
