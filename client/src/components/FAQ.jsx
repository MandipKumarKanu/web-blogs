import React from "react";
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
    question: "What is AI summarization with Gemini API?",
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
  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center py-16">
      <div className="container max-w-4xl px-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our blog app, answered with
            clarity and a touch of curiosity.
          </p>
        </header>
        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border border-muted rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="flex justify-between items-center px-6 py-4 bg-primary text-white font-semibold text-left hover:bg-primary/80 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-5 bg-background text-foreground">
                <p className="text-base leading-relaxed">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQPage;
