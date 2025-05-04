import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "What is this blog app about?",
    answer:
      "This blog app is designed for the general public to discover, read, and share engaging blog posts on a variety of topics. Whether you're interested in tech, lifestyle, or creative writing, there's something for everyone.",
  },
  {
    question: "How do I get personalized recommendations?",
    answer:
      "Our app uses a smart recommendation system that suggests blogs based on your reading history and interests. Simply browse our collection and let the app tailor suggestions just for you.",
  },
  {
    question: "How can I like and comment on posts?",
    answer:
      "Engage with your favorite posts by clicking the like button and leaving comments. Your interactions help build a vibrant community and influence future recommendations.",
  },
  {
    question: "What is AI summarization?",
    answer:
      "For quick insights, our blog app leverages the Gemini API to provide AI-powered summaries of posts. Just click the summary option to see a concise overview of any blog article.",
  },
  {
    question: "What else can I do with this blog app?",
    answer:
      "Beyond reading, liking, and commenting, you can explore a range of features including personalized recommendations, AI summaries, and much more as we continuously add new functionalities to enhance your experience.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-background relative overflow-hidden">
   
      <div className="container max-w-4xl px-6 z-10">
        <header className="text-center mb-14">
          {/* <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full font-semibold text-base mb-4">
            FAQ
          </span> */}
          <h1 className="text-5xl md:text-6xl font-black text-center bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent drop-shadow-sm pb-2">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Answers to common questions about FutureBlog and its features.
          </p>
        </header>

        <Accordion
          type="single"
          collapsible
          value={openIndex !== null ? `faq-${openIndex}` : undefined}
          onValueChange={(val) => {
            if (val === undefined) setOpenIndex(null);
            else setOpenIndex(Number(val.split("-")[1]));
          }}
        >
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="rounded-3xl shadow-xl bg-card/80 border border-border transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl"
              >
                <AccordionTrigger className="flex justify-between items-center w-full px-8 py-6 text-left text-xl font-semibold text-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-8 py-6 bg-muted/30 text-muted-foreground rounded-xl">
                  <p className="text-lg tracking-wider leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </div>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQPage;