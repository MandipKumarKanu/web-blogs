const { JSDOM } = require("jsdom");

const addCustomClassesToHtml = (html) => {
  const dom = new JSDOM(html);
  const tempDiv = dom.window.document.createElement("div");
  tempDiv.innerHTML = html;

  const elementsWithClasses = [
    {
      tag: "p",
      classes: ["text-muted-foreground", "text-lg", "leading-relaxed", "mb-4"],
    },
    {
      tag: "div",
      classes: ["space-y-6", "text-muted-foreground", "leading-relaxed"],
    },
    {
      tag: "h1",
      classes: [
        "text-3xl",
        "md:text-4xl",
        "lg:text-5xl",
        "font-bold",
        "leading-tight",
        "mt-4",
        "mb-2",
      ],
    },
    {
      tag: "h2",
      classes: ["text-2xl", "font-semibold", "text-foreground", "mt-3", "mb-2"],
    },
    {
      tag: "h3",
      classes: ["text-xl", "font-semibold", "text-foreground", "mt-2", "mb-1"],
    },
    {
      tag: "h4",
      classes: ["text-lg", "font-semibold", "text-foreground", "mt-2", "mb-1"],
    },
    {
      tag: "h5",
      classes: ["text-base", "font-semibold", "text-foreground", "mt-2", "mb-1"],
    },
    {
      tag: "h6",
      classes: ["text-sm", "font-semibold", "text-foreground", "mt-2", "mb-1"],
    },
    {
      tag: "ul",
      classes: ["list-disc", "ml-6", "space-y-2", "text-muted-foreground"],
    },
    {
      tag: "ol",
      classes: ["list-decimal", "ml-6", "space-y-2", "text-muted-foreground"],
    },
    { tag: "li", classes: ["text-muted-foreground", "leading-relaxed"] },
    {
      tag: "a",
      classes: [
        "text-blue-600",
        "hover:text-blue-800",
        "underline",
        "transition",
        "duration-300",
      ],
    },
    {
      tag: "img",
      classes: ["rounded-lg", "shadow-md", "max-w-full", "h-auto", "mt-4", "mb-4"],
    },
    {
      tag: "blockquote",
      classes: [
        "border-l-4",
        "border-muted-foreground",
        "pl-4",
        "italic",
        "text-lg",
        "text-muted-foreground",
        "mb-4",
      ],
    },
    {
      tag: "code",
      classes: [
        "bg-gray-100",
        "text-sm",
        "p-1",
        "rounded",
        "font-mono",
        "text-red-600",
      ],
    },
    {
      tag: "pre",
      classes: [
        "bg-gray-900",
        "text-white",
        "p-4",
        "rounded-lg",
        "overflow-auto",
        "mb-4",
        "font-mono",
      ],
    },
    {
      tag: "table",
      classes: [
        "min-w-full",
        "border-collapse",
        "overflow-hidden",
        "rounded-lg",
        "mb-4",
      ],
    },
    { tag: "thead", classes: ["bg-gray-100"] },
    { tag: "tbody", classes: ["bg-white"] },
    { tag: "th", classes: ["px-4", "py-2", "text-left", "font-semibold"] },
    { tag: "td", classes: ["px-4", "py-2", "border-t"] },
    {
      tag: "hr",
      classes: ["border-t", "border-muted-foreground", "my-4"],
    },
    {
      tag: "strong",
      classes: ["font-semibold", "text-foreground"],
    },
    {
      tag: "em",
      classes: ["italic"],
    },
  ];

  elementsWithClasses.forEach(({ tag, classes }) => {
    const elements = tempDiv.getElementsByTagName(tag);
    Array.from(elements).forEach((el) => {
      el.classList.add(...classes);
    });
  });

  return tempDiv.innerHTML;
};

module.exports = addCustomClassesToHtml;
