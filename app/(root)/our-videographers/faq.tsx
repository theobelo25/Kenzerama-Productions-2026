import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/data/faqs";

const FrequentlyAskedQuestions = () => {
  return (
    <section className="wrapper py-10">
      <h2 className="mb-15 h2-subheading">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible defaultValue="item-1">
        {FAQS.map((faq, index) => (
          <AccordionItem key={faq.question} value={`item-${index + 1}`}>
            <AccordionTrigger className="font-playfair-display text-lg hover:text-kenzerama-pink hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="font-questrial text-lg">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FrequentlyAskedQuestions;
