import { APP_NAME } from "@/lib/constants";
import { headers } from "next/headers";

const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const isContactPage = pathname === "/contact-us";

  return (
    <footer className="bg-background">
      <div className="flex-center px-5 py-2 text-center text-xs text-background-grey sm:text-sm">
        &copy; {currentYear} {APP_NAME}. All Rights Reserverd.
      </div>

      {isContactPage && (
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
      )}
    </footer>
  );
};

export default Footer;
