"use client";
import { cn } from "@/lib/utils";
import { SN_SRC_URL } from "@/lib/constants";

const ContactFormWrapper = () => {
  const contactFormUrl = SN_SRC_URL;

  return (
    <>
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
          />
          <p className="mt-0 md:mt-3 mb-6 text-center text-sm text-muted-foreground md:mb-3">
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
