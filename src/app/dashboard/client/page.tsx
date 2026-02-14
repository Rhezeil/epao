
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Globe, Zap, Lightbulb, Cpu } from "lucide-react";

export default function ClientDashboard() {
  return (
    <DashboardLayout role="client">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary font-headline tracking-tight text-center">
            Client Information Portal
          </h1>
          <p className="text-center text-muted-foreground font-medium">
            Navigating Your Legal Journey with Confidence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/40 backdrop-blur-md border-primary/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are here to provide you with clear, accurate, and timely legal guidance. 
                Our system helps you understand what is needed for your case, reducing stress and confusion.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-md border-primary/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb className="h-5 w-5" />
                Our Vision for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A Philippines where every citizen, regardless of status, can easily navigate legal challenges 
                through modern, accessible, and transparent digital support systems.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary text-center">Our Core Values to You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Transparency", icon: Shield, desc: "Clear information on your case." },
              { title: "Accessibility", icon: Globe, desc: "Legal guidance for everyone." },
              { title: "Efficiency", icon: Zap, desc: "Less waiting, more assistance." },
              { title: "Empowerment", icon: Lightbulb, desc: "Be prepared and informed." },
              { title: "Innovation", icon: Cpu, desc: "Modern tools for public service." }
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
