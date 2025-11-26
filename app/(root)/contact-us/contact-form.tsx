import { SN_SRC_URL } from "@/lib/constants";

const ContactForm = () => {
  return (
    <>
      <iframe
        aria-label={"Contact Form"}
        src={SN_SRC_URL}
        className="w-full h-[873px]"
      />
    </>
  );
};

export default ContactForm;
