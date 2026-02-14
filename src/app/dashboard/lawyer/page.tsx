
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Globe, Zap, Lightbulb, Cpu } from "lucide-react";

export default function LawyerDashboard() {
  return (
    <DashboardLayout role="lawyer">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary font-headline tracking-tight text-center">
            Lawyer Information Portal
          </h1>
          <p className="text-center text-muted-foreground font-medium">
            Supporting Legal Professionals in Public Service
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/40 backdrop-blur-md border-primary/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To provide clear, accurate, and timely legal guidance to walk-in clients of the Public Attorney's Office through 
                a centralized, web-based platform. We empower lawyers to manage their workload more effectively.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-md border-primary/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Globe className="h-5 w-5" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To be a trusted digital support system for walk-in legal assistance in the Philippines, where legal professionals 
                can focus on justice while the system handles routine administration.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary text-center">Guiding Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Transparency", icon: Shield, desc: "Consistency in legal guidance." },
              { title: "Accessibility", icon: Globe, desc: "Inclusive access to legal services." },
              { title: "Efficiency", icon: Zap, desc: "Streamlined case management." },
              { title: "Empowerment", icon: Lightbulb, desc: "Informing clients proactively." },
              { title: "Innovation", icon: Cpu, desc: "Digital tools for better outcomes." }
            ].map((value) => (
              <Card key={value.title} className="bg-white/30 backdrop-blur-sm border-white/50 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-primary text-sm">{value.title}</h3>
                  <p className="text-[10px] text-muted-foreground">
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
