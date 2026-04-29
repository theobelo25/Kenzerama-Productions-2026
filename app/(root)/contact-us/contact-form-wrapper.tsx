"use client";
// import { useEffect, useState } from "react";
// import { ReCaptcha } from "next-recaptcha-v3";
import { cn } from "@/lib/utils";
import { SN_SRC_URL } from "@/lib/constants";

const ContactFormWrapper = () => {
  // const [token, setToken] = useState<string | null>(null);

  // useEffect(() => {
  //   console.log(token);
  //   console.log(SN_SRC_URL);
  // }, []);

  const contactFormUrl = SN_SRC_URL;

  return (
    <>
      {/* <ReCaptcha onValidate={setToken} action="page_view" /> */}
      {SN_SRC_URL && (
        <div>
          <p id="contact-form-description" className="sr-only">
            Complete the embedded contact form below. If it does not load, use the direct
            form link.
          </p>
          <iframe
            aria-label="Contact Form"
            aria-describedby="contact-form-description"
            title="Kenzerama Productions contact form"
            src={contactFormUrl}
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="clipboard-write"
            className={cn("w-full h-[980px] md:h-[800px]")}
          >
            Your browser does not support embedded forms. Use the{" "}
            <a href={contactFormUrl} target="_blank" rel="noreferrer">
              direct contact form link
            </a>
            .
          </iframe>
          <p className="mt-0 md:mt-3 text-center text-sm text-muted-foreground">
            Trouble viewing the form? Open the{" "}
            <a
              href={contactFormUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              contact form in a new tab
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
};

export default ContactFormWrapper;
