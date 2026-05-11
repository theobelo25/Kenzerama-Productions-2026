import ContactLinks from "@/components/layout/header/contact-links";

export default function AlternateContactSection() {
  return (
    <section aria-labelledby="alternate-contact-heading">
      <h2 id="alternate-contact-heading" className="h2-subheading mb-10">
        More ways to reach us
      </h2>
      <ContactLinks
        className="justify-center mb-10"
        buttonClassName="text-foreground hover:text-kenzerama-pink-dark focus-visible:text-kenzerama-pink-dark"
        iconSize={30}
      />
    </section>
  );
}
