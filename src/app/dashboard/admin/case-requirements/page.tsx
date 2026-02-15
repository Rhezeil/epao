
"use client";

import { useState } from "react";
import { useFirestore, setDocumentNonBlocking } from "@/firebase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Database, UploadCloud, Plus, Trash2, Save, Layers, ClipboardList, Info } from "lucide-react";
import { allCaseNames, caseSpecificData, universalPaoFlow } from "@/app/lib/case-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CaseRequirementsManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [selectedCase, setSelectedCase] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [steps, setSteps] = useState<any[]>(universalPaoFlow);
  const [description, setDescription] = useState("");
  const [newReq, setNewReq] = useState("");

  const handleSeedAll = async () => {
    if (!db) return;
    setIsSeeding(true);
    
    try {
      const promises = allCaseNames.map(caseName => {
        const id = caseName.toLowerCase().replace(/[\s/]+/g, '-');
        const docRef = doc(db, "caseRequirements", id);
        const data = caseSpecificData[caseName] || { requirements: [], steps: universalPaoFlow, description: "" };
        
        return setDocumentNonBlocking(docRef, {
          caseName: caseName,
          requirements: data.requirements,
          steps: data.steps,
          description: data.description
        }, { merge: true });
      });

      toast({
        title: "Seeding Started",
        description: `Initializing ${allCaseNames.length} cases with separated requirements and steps.`
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Seeding Failed", description: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  const addRequirement = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: string, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { step: steps.length + 1, title: "", content: "" }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSaveIndividual = () => {
    if (!db || !selectedCase) return;

    const id = selectedCase.toLowerCase().replace(/[\s/]+/g, '-');
    const docRef = doc(db, "caseRequirements", id);

    setDocumentNonBlocking(docRef, {
      caseName: selectedCase,
      description: description,
      requirements: requirements,
      steps: steps
    }, { merge: true });

    toast({
      title: "Saved",
      description: `Requirements and Process Flow for ${selectedCase} updated.`
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Legal Database Manager</h1>
          <p className="text-muted-foreground">Manage dynamic requirements and interactive process flows for all PAO case types.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Database Actions
              </CardTitle>
              <CardDescription>
                Bulk initialize the system with statutory standards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSeedAll} 
                disabled={isSeeding}
                className="w-full bg-secondary hover:bg-secondary/90 h-12"
              >
                {isSeeding ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Seed All Standards
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Case Editor
              </CardTitle>
              <CardDescription>
                Define detailed requirements and roadmap steps for a specific matter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Case Name</Label>
                  <Input 
                    placeholder="e.g. Qualified Theft" 
                    value={selectedCase} 
                    onChange={(e) => setSelectedCase(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Input 
                    placeholder="Legal basis or article reference" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="requirements" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="requirements" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" /> Documents
                  </TabsTrigger>
                  <TabsTrigger value="steps" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Process Steps
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="requirements" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Add Case Evidence Requirement</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g. CCTV Footage, Demand Letter" 
                        value={newReq} 
                        onChange={(e) => setNewReq(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addRequirement()}
                      />
                      <Button size="icon" onClick={addRequirement} variant="outline"><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm border">
                        <span>{req}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeRequirement(idx)} className="h-6 w-6 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="steps" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    {steps.map((step, idx) => (
                      <div key={idx} className="p-4 border rounded-xl bg-muted/10 space-y-3 relative">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6 text-destructive"
                          onClick={() => removeStep(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="col-span-1">
                            <Label className="text-xs">Step #</Label>
                            <Input type="number" value={step.step} onChange={(e) => updateStep(idx, 'step', parseInt(e.target.value))} />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-xs">Title</Label>
                            <Input value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)} />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Guidance Content</Label>
                          <Textarea 
                            className="text-xs" 
                            rows={2} 
                            value={step.content} 
                            onChange={(e) => updateStep(idx, 'content', e.target.value)} 
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addStep} className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Add Custom Step
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                className="w-full h-12 bg-primary shadow-lg" 
                onClick={handleSaveIndividual}
                disabled={!selectedCase}
              >
                <Save className="mr-2 h-4 w-4" /> Commit Changes to Database
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
