import Instagram from "../instagram";
import PageTitle from "../page-title";
import ContactLinks from "@/components/shared/header/contact-links";

const ContactUsPage = () => {
  return (
    <>
      <PageTitle title="Contact Us" />
      <p className="wrapper text-center font-questrial">
        We are so excited to hear more about your wedding, and what you have
        planned so far! Want to find out if we are available on your date?
        Please fill out the contact form below, and we will get back to you
        within 24 hours.
      </p>
      <iframe
        aria-label={"Contact Form"}
        src={process.env.SN_SRC_URL}
        className="w-full h-[873px]"
      />
      <div>
        <h2 className="h2-subheading mb-10">Or try another way!</h2>
        <ContactLinks className="justify-center mb-10" iconSize={30} />
      </div>
      <Instagram />
    </>
  );
};

export default ContactUsPage;
