import { APP_NAME } from "@/lib/constants";
import FooterContactDisclaimer from "./footer-contact-disclaimer";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background">
      <div className="flex-center px-5 py-2 text-center text-xs text-background-grey sm:text-sm">
        &copy; {currentYear} {APP_NAME}. All Rights Reserverd.
      </div>

      <FooterContactDisclaimer />
    </footer>
  );
};

export default Footer;
