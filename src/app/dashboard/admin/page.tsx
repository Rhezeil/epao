
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Shield, Globe, Zap, Lightbulb, Cpu } from "lucide-react";

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-12 py-8 px-4 text-center">
        {/* Logo and Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-full shadow-sm border">
              <Scale className="h-12 w-12 text-[#2E5A99]" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
            ePAO Case Requirements, Appointment, and Service Management System
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Making Legal Guidance Simple, Accessible, and Transparent
          </p>
        </div>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-12 text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              To provide clear, accurate, and timely legal guidance to walk-in clients of the Public Attorney's Office through 
              a centralized, web-based platform. The ePAO system helps clients identify their case type, understand 
              required documents, and manage appointments in advance—reducing misinformation, repeat visits, and 
              long queues while improving transparency and efficiency in public legal services.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              To be a trusted digital support system for walk-in legal assistance in the Philippines, where citizens can 
              easily understand and prepare for their legal concerns, and where the Public Attorney's Office can manage 
              services, appointments, and workloads more efficiently through data-driven insights and streamlined 
              processes.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8 pt-8">
          <h2 className="text-2xl font-bold text-primary">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: "Transparency",
                icon: Shield,
                desc: "We ensure clients receive clear, accurate, and consistent case guidance and service information, minimizing confusion and unnecessary office visits."
              },
              {
                title: "Accessibility",
                icon: Globe,
                desc: "We design the system to be simple, open, and inclusive—requiring no client accounts for initial guidance and usable by individuals with limited technical skills."
              },
              {
                title: "Efficiency",
                icon: Zap,
                desc: "We reduce repetitive explanations, long waiting times, and manual processes by streamlining case guidance, appointment scheduling, and service management."
              },
              {
                title: "Empowerment",
                icon: Lightbulb,
                desc: "We enable citizens to be informed and prepared before visiting PAO, allowing them to engage confidently in the legal assistance process."
              },
              {
                title: "Innovation",
                icon: Cpu,
                desc: "We responsibly apply digital tools, rule-based logic, and analytics to enhance PAO operations while upholding data privacy and confidentiality."
              }
            ].map((value) => (
              <Card key={value.title} className="bg-white border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-2 bg-[#EBF2FA] rounded-full text-primary">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-primary">{value.title}</h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {value.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
