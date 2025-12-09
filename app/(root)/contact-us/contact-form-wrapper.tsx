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

  return (
    <>
      {/* <ReCaptcha onValidate={setToken} action="page_view" /> */}
      {SN_SRC_URL && (
        <iframe
          aria-label={"Contact Form"}
          src={
            "https://app.studioninja.co/contactform/parser/0a800fc8-8f7c-14c2-818f-7f50b7024e52/0a800fc8-8f7c-14c2-818f-7f50b7214e54"
          }
          className={cn("w-full h-[980px] md:h-[800px]")}
        />
      )}
    </>
  );
};

export default ContactFormWrapper;
