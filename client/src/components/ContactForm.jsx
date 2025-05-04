import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, Sparkles } from "lucide-react";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[A-Za-z\s]+$/, { message: "Name must not contain numbers" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters" }),
  message: z
    .string()
    .min(12, { message: "Message must be at least 12 characters long" }),
});

export default function ContactForm() {
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you soon.", {
      description: "Thank you for reaching out to the FutureBlog team!",
      icon: <Sparkles className="h-5 w-5 text-primary" />,
    });
    reset();
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div>
          <label className="text-sm font-medium mb-1 block text-foreground/80">
            Your Name
          </label>
          <Input
            placeholder="John Doe"
            {...register("name")}
            className="rounded-xl bg-background/80 border border-border/70 focus:border-primary h-12 shadow-sm"
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block text-foreground/80">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="john.doe@example.com"
            {...register("email")}
            className="rounded-xl bg-background/80 border border-border/70 focus:border-primary h-12 shadow-sm"
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block text-foreground/80">
          Subject
        </label>
        <Input
          placeholder="How can we help you?"
          {...register("subject")}
          className="rounded-xl bg-background/80 border border-border/70 focus:border-primary h-12 shadow-sm"
        />
        {errors.subject && (
          <p className="text-destructive text-sm mt-1">
            {errors.subject.message}
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block text-foreground/80">
          Message
        </label>
        <Textarea
          placeholder="Tell us more about your inquiry..."
          rows={6}
          {...register("message")}
          className="rounded-xl bg-background/80 border border-border/70 focus:border-primary resize-none shadow-sm"
        />
        {errors.message && (
          <p className="text-destructive text-sm mt-1">
            {errors.message.message}
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={sending}
          className="rounded-full px-8 py-6 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all duration-300 shadow-lg shadow-primary/20"
        >
          {sending ? (
            <>
              <span className="animate-pulse">Sending Message</span>
              <Sparkles className="h-5 w-5 ml-2 animate-spin" />
            </>
          ) : (
            <>
              Send Message
              <Send className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
