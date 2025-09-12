"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  ExternalLink,
  Send,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactSection() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerMessage(null);
    if (!formValues.firstName || !formValues.email || !formValues.message) {
      setServerMessage({ type: "error", text: "Please fill required fields." });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message.");
      }
      setServerMessage({
        type: "success",
        text: "Thanks! Your message has been sent.",
      });
      setFormValues({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setServerMessage({
        type: "error",
        text: err?.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Envelope Paper Background */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M100,200 L600,100 L1100,200 L1100,600 L100,600 Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
            className="animate-pulse"
          />
          {/* Envelope fold lines */}
          <line
            x1="100"
            y1="200"
            x2="600"
            y2="400"
            stroke="white"
            strokeWidth="1"
            opacity="0.5"
          />
          <line
            x1="1100"
            y1="200"
            x2="600"
            y2="400"
            stroke="white"
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Floating Message Bubbles */}
      <div className="absolute top-20 left-20 opacity-10">
        <div className="relative">
          <div className="w-16 h-12 bg-white rounded-2xl animate-pulse"></div>
          <div className="absolute -bottom-1 left-4 w-3 h-3 bg-white transform rotate-45"></div>
        </div>
      </div>

      {/* Network Connection Lines */}
      <div className="absolute bottom-20 right-20 opacity-5">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="white"
            className="animate-pulse"
          />
          <circle
            cx="150"
            cy="50"
            r="4"
            fill="white"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <circle
            cx="100"
            cy="150"
            r="4"
            fill="white"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <line
            x1="50"
            y1="50"
            x2="150"
            y2="50"
            stroke="white"
            strokeWidth="1"
            className="animate-pulse"
          />
          <line
            x1="50"
            y1="50"
            x2="100"
            y2="150"
            stroke="white"
            strokeWidth="1"
            className="animate-pulse"
          />
          <line
            x1="150"
            y1="50"
            x2="100"
            y2="150"
            stroke="white"
            strokeWidth="1"
            className="animate-pulse"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Section Header with Letter Paper */}
        <div className="text-center space-y-4 relative">
          {/* Letter paper background */}
          <div className="absolute inset-0 -z-10 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
              <rect
                x="50"
                y="40"
                width="300"
                height="120"
                fill="white"
                stroke="white"
                strokeWidth="1"
                rx="5"
              />
              {/* Letter fold marks */}
              <line
                x1="50"
                y1="80"
                x2="350"
                y2="80"
                stroke="white"
                strokeWidth="0.5"
                strokeDasharray="5,5"
              />
              <line
                x1="50"
                y1="120"
                x2="350"
                y2="120"
                stroke="white"
                strokeWidth="0.5"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white relative">
            Let's Build Together
            {/* Handwriting underline effect */}
            <svg
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-4"
              viewBox="0 0 200 20"
              fill="none"
            >
              <path
                d="M10,15 Q50,10 100,15 T190,12"
                stroke="white"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
                className="animate-pulse"
              />
            </svg>
          </h2>
          <p className="text-xl text-gray-300 text-balance">
            Ready to create the next generation of blockchain applications?
            Let's connect!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info with Notebook Style */}
          <div className="space-y-8 relative">
            {/* Notebook paper background */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
                <rect
                  x="20"
                  y="20"
                  width="360"
                  height="560"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Notebook holes */}
                <circle cx="50" cy="80" r="3" fill="black" />
                <circle cx="50" cy="140" r="3" fill="black" />
                <circle cx="50" cy="200" r="3" fill="black" />
                <circle cx="50" cy="260" r="3" fill="black" />
                {/* Ruled lines */}
                {Array.from({ length: 20 }, (_, i) => (
                  <line
                    key={i}
                    x1="80"
                    y1={60 + i * 25}
                    x2="360"
                    y2={60 + i * 25}
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                ))}
              </svg>
            </div>

            <div className="space-y-6 relative z-10">
              <h3 className="text-2xl font-bold text-white">Get In Touch</h3>
              <p className="text-gray-200 leading-relaxed">
                I'm always excited to discuss new opportunities, collaborate on
                innovative projects, or share insights about the blockchain
                ecosystem. Whether you're looking for a developer, mentor, or
                community builder, let's start a conversation.
              </p>
            </div>

            {/* Contact Methods with Ink Spots */}
            <div className="space-y-4 relative z-10">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "rythmenagrani@gmail.com",
                  href: "mailto:rythmenagrani@gmail.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 7000 938 600",
                  href: "tel:+917000938600",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Bhopal, India",
                  href: "#",
                },
                {
                  icon: Twitter,
                  label: "Twitter",
                  value: "@RythmeNagr64107",
                  href: "https://twitter.com/RythmeNagr64107",
                },
                {
                  icon: Github,
                  label: "GitHub",
                  value: "github.com/rythmern02",
                  href: "https://github.com/rythmern02",
                },
              ].map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 group relative"
                  >
                    {/* Ink spot behind each contact item */}
                    <div
                      className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-white/20 rounded-full animate-pulse"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    ></div>

                    <div className="p-3 rounded-lg bg-white/10 border border-white/20 group-hover:bg-white/20 transition-colors">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-200">
                        {contact.label}
                      </p>
                      <a
                        href={contact.href}
                        className="text-white hover:text-gray-300 transition-colors font-medium"
                      >
                        {contact.value}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Availability Card with Stamp Effect */}
            <Card className="border-white/20 bg-white/5 relative overflow-hidden">
              {/* Stamp effect */}
              <div className="absolute top-2 right-2 w-16 h-12 border-2 border-white/30 rounded opacity-30">
                <div className="text-xs text-white/50 text-center mt-2 font-mono">
                  OPEN
                </div>
              </div>

              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <h4 className="font-semibold text-white">
                    Available for New Opportunities
                  </h4>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Currently open to full-time positions, consulting projects,
                  and collaboration opportunities in blockchain development,
                  DevRel, and community building roles.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-white border-white/20"
                  >
                    Full-time
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-white border-white/20"
                  >
                    Consulting
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-white border-white/20"
                  >
                    Remote
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-white border-white/20"
                  >
                    Hybrid
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form with Parchment Style */}
          <Card className="group bg-black border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-white/20 relative overflow-hidden">
            {/* Parchment corner effect */}
            <div className="absolute top-0 left-0 w-8 h-8 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                <path d="M0,0 L20,0 Q15,5 20,10 L0,10 Z" fill="white" />
              </svg>
            </div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl text-white group-hover:text-white/90 transition-all">
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      placeholder="John"
                      className="bg-white/5 border-white/20 focus:border-white/40 text-white placeholder:text-gray-500"
                      value={formValues.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      placeholder="Doe"
                      className="bg-white/5 border-white/20 focus:border-white/40 text-white placeholder:text-gray-500"
                      value={formValues.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-white/5 border-white/20 focus:border-white/40 text-white placeholder:text-gray-500"
                    value={formValues.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    placeholder="Let's discuss a blockchain project"
                    className="bg-white/5 border-white/20 focus:border-white/40 text-white placeholder:text-gray-500"
                    value={formValues.subject}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Tell me about your project, opportunity, or how we can collaborate..."
                    className="min-h-32 bg-white/5 border-white/20 focus:border-white/40 resize-none text-white placeholder:text-gray-500"
                    value={formValues.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-300"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                  {serverMessage && (
                    <p
                      className={
                        serverMessage.type === "success"
                          ? "text-sm text-emerald-300"
                          : "text-sm text-red-300"
                      }
                      aria-live="polite"
                    >
                      {serverMessage.text}
                    </p>
                  )}
                </div>
              </form>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-200">
                  Prefer a quick call?
                  <Link href={"https://calendly.com/rythme/30min"}>
                    <Button
                      variant="link"
                      className="text-white hover:text-gray-300 p-0 ml-1 h-auto"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Schedule a meeting
                    </Button>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action with Signature Style */}
        <div className="text-center space-y-6 pt-16 relative">
          {/* Signature line background */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 800 200" fill="none">
              <line
                x1="200"
                y1="150"
                x2="600"
                y2="150"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="10,5"
              />
              <text
                x="400"
                y="170"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                opacity="0.5"
              >
                Rythme Nagrani
              </text>
            </svg>
          </div>

          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-bold text-white">
              Ready to Innovate?
            </h3>
            <p className="text-gray-200 text-balance max-w-2xl mx-auto">
              Join me in building the decentralized future. From smart contracts
              to community growth, let's create something extraordinary
              together.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link href={"https://calendly.com/rythme/30min"}>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
              >
                <Mail className="w-4 h-4 mr-2" />
                Start a Project
              </Button>
            </Link>
            <Link href={"https://drive.google.com/file/d/1JG6ojc-yyH7Q2nKBzf1bXeUvhrU39ug2/view?usp=drive_link"}> 
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 bg-transparent"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
