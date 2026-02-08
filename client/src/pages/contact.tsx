import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[hsl(220,40%,7%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[hsl(220,91%,55%)] text-sm font-bold tracking-widest uppercase mb-4">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" data-testid="text-contact-title">Contact Us</h1>
          <p className="text-[hsl(215,30%,65%)] text-lg">Have a question about our products or need support? We're here to help.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-4 py-2.5 text-white placeholder-[hsl(215,30%,65%)] focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)] focus:border-[hsl(220,91%,55%)] text-sm"
                    placeholder="Your name"
                    data-testid="input-contact-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-4 py-2.5 text-white placeholder-[hsl(215,30%,65%)] focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)] focus:border-[hsl(220,91%,55%)] text-sm"
                    placeholder="you@example.com"
                    data-testid="input-contact-email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-4 py-2.5 text-white placeholder-[hsl(215,30%,65%)] focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)] focus:border-[hsl(220,91%,55%)] text-sm"
                  placeholder="How can we help?"
                  data-testid="input-contact-subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-4 py-2.5 text-white placeholder-[hsl(215,30%,65%)] focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)] focus:border-[hsl(220,91%,55%)] text-sm resize-none"
                  placeholder="Tell us more..."
                  data-testid="input-contact-message"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-[hsl(220,91%,55%)] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[hsl(220,91%,45%)] hover:shadow-[0_0_20px_rgba(37,106,244,0.4)]"
                data-testid="button-send-message"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            {[
              { icon: Mail, title: "Email", value: "support@novaatoz.com", sub: "We reply within 24 hours" },
              { icon: Phone, title: "Phone", value: "+1 (888) 555-0123", sub: "Mon-Fri, 9am-5pm PST" },
              { icon: MapPin, title: "Office", value: "San Francisco, CA", sub: "United States" },
              { icon: Clock, title: "Hours", value: "Mon-Fri 9am-5pm", sub: "Pacific Standard Time" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4" data-testid={`contact-info-${i}`}>
                <div className="h-12 w-12 rounded-md bg-[hsl(220,91%,55%)]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-[hsl(220,91%,55%)]" />
                </div>
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-[hsl(215,30%,65%)] text-sm">{item.value}</p>
                  <p className="text-[hsl(215,30%,65%)]/60 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
