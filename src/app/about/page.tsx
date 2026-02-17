
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Globe, Scale, Users, Heart } from "lucide-react";

export default function AboutPage() {
  const { role } = useAuth();

  return (
    <DashboardLayout role={role}>
      <div className="max-w-4xl mx-auto space-y-12 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-primary font-headline tracking-tight">
            About Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering every Filipino with accessible, transparent, and efficient legal support services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/50 backdrop-blur-sm border-primary/5 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To provide clear, accurate, and timely legal guidance to walk-in clients of the Public Attorney's Office through a centralized digital platform. We aim to reduce misinformation, streamline appointments, and improve the overall experience of seeking justice.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-primary/5 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Globe className="h-5 w-5" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To be the gold standard for public legal assistance platforms in the Philippines, fostering a society where legal information is a right, not a privilege, and where the PAO can serve its constituents with modern efficiency.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-primary text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Indigent-First",
                icon: Heart,
                desc: "Prioritizing the needs of our underprivileged citizens with compassion and respect."
              },
              {
                title: "Transparency",
                icon: Scale,
                desc: "Providing clear information about legal requirements and processes to eliminate confusion."
              },
              {
                title: "Public Service",
                icon: Users,
                desc: "Upholding the mandate of the Public Attorney's Office with integrity and dedication."
              }
            ].map((value) => (
              <div key={value.title} className="text-center space-y-3 p-6 bg-white/30 rounded-2xl border border-white/50">
                <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-primary">{value.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-primary text-primary-foreground overflow-hidden">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-xl font-bold">Need Legal Assistance?</h3>
            <p className="text-sm text-primary-foreground/80 max-w-lg mx-auto">
              If you are an indigent citizen in need of legal representation or advice, 
              please use our Case Requirement Navigator to check your requirements and book a consultation today.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
