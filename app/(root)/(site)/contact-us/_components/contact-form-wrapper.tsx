"use client";
import { cn } from "@/lib/utils";
import { ContactFormProps } from "@/lib/directus/blocks/block_contact_form";

const ContactFormWrapper = ({ data }: { data: ContactFormProps }) => {
  const { iframe_url } = data;

  return (
    <>
      {iframe_url ? (
        <div>
          <p id="contact-form-description" className="sr-only">
            Complete the embedded contact form below. If it does not load, use
            the direct form link.
          </p>
          <iframe
            aria-label="Contact Form"
            aria-describedby="contact-form-description"
            title="Kenzerama Productions contact form"
            src={iframe_url}
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="clipboard-write"
            className={cn("w-full h-245 md:h-200")}
          />
          <p className="mt-0 md:mt-3 mb-6 text-center text-sm text-muted-foreground md:mb-3">
            Trouble viewing the form? Open the{" "}
            <a
              href={iframe_url}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              contact form in a new tab
            </a>
            .
          </p>
        </div>
      ) : null}
    </>
  );
};

export default ContactFormWrapper;
