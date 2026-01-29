import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Bug, Lightbulb, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter your feedback message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Construct mailto link
    const subject = encodeURIComponent(`[Tardometer ${category || "Feedback"}] ${name ? `From ${name}` : "Anonymous"}`);
    const body = encodeURIComponent(
      `Name: ${name || "Not provided"}\nEmail: ${email || "Not provided"}\nCategory: ${category || "Not specified"}\n\nMessage:\n${message}`
    );
    
    // Open mailto link
    window.location.href = `mailto:tardometer@gmail.com?subject=${subject}&body=${body}`;

    // Show success message after a brief delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Thanks for your feedback!",
        description: "Your email client should open. We'll get back to you soon.",
      });
      // Reset form
      setName("");
      setEmail("");
      setCategory("");
      setMessage("");
    }, 500);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "bug": return <Bug className="w-4 h-4" />;
      case "feature": return <Lightbulb className="w-4 h-4" />;
      case "feedback": return <MessageSquare className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        {/* Back Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-title mb-4 pb-1">
            Contact & Feedback
          </h1>
        </div>

        {/* Get in Touch Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Get in Touch</h2>
          <p className="text-muted-foreground leading-relaxed">
            We'd love to hear from you! Whether you've found a bug, have a feature suggestion, 
            or just want to share your thoughts on Tardometer.
          </p>
        </section>

        {/* Quick Feedback Form */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-6">Quick Feedback Form</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">
                  Name <span className="text-muted-foreground/50">(optional)</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/30 border-border/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">
                  Email <span className="text-muted-foreground/50">(optional, recommended for replies)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/30 border-border/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-muted-foreground">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-muted/30 border-border/50">
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="bug">
                    <span className="flex items-center gap-2">
                      <Bug className="w-4 h-4" /> Bug Report
                    </span>
                  </SelectItem>
                  <SelectItem value="feature">
                    <span className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" /> Feature Request
                    </span>
                  </SelectItem>
                  <SelectItem value="feedback">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> General Feedback
                    </span>
                  </SelectItem>
                  <SelectItem value="other">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Other
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-muted-foreground">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-muted/30 border-border/50 min-h-[150px]"
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="calculate" 
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                "Opening email..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </section>

        {/* Other Ways to Reach Us */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-6">Other Ways to Reach Us</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <Bug className="w-5 h-5 text-destructive" />
                <h4 className="font-semibold text-foreground">Found a bug?</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Please include:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>What you were trying to do</li>
                <li>What happened vs what you expected</li>
                <li>Browser and device info</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Feature ideas?</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Tell us:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>What problem would it solve?</li>
                <li>How would you use it?</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Navigation Links */}
        <div className="pt-6 border-t border-border/30 flex flex-wrap gap-4 text-sm">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <Link 
            to="/how-it-works" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            How It Works
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
