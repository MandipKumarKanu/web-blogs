import { Sparkles, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 text-foreground py-24 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto mb-16">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full font-semibold text-base backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 mb-6 animate-fade-in">
            <Sparkles className="h-5 w-5" />
            <span>Contact FutureBlog Team</span>
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent drop-shadow-sm mb-6">
            Let's Connect
          </h1>

          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you have feedback, a question, or just want to say hi — we'd
            love to hear from you. Our team is here to help you make the most of
            FutureBlog.
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6 h-full">
          <Card className="border border-border/50 bg-card/80 shadow-xl rounded-3xl backdrop-blur-md overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email Us</h3>
                  <p className="text-muted-foreground">hello@futureblog.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/80 shadow-xl rounded-3xl backdrop-blur-md overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-secondary/10 p-3 rounded-2xl">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Call Us</h3>
                  <p className="text-muted-foreground">+977 981-120-9589</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/80 shadow-xl rounded-3xl backdrop-blur-md overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-500/10 p-3 rounded-2xl">
                  <MapPin className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Visit Us</h3>
                  <p className="text-muted-foreground">
                    Birgunj, Nepal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border border-border/50 bg-card/80 shadow-xl rounded-3xl backdrop-blur-md overflow-hidden h-full">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Send us a message
                </span>
              </div>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
