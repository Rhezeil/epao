
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
      allCaseNames.forEach(caseName => {
        const id = caseName.toLowerCase().replace(/[\s/().,]+/g, '-').replace(/-+$/, '');
        const docRef = doc(db, "caseRequirements", id);
        const data = caseSpecificData[caseName] || { requirements: [], steps: universalPaoFlow, description: "" };
        
        setDocumentNonBlocking(docRef, {
          caseName: caseName,
          requirements: data.requirements,
          steps: data.steps,
          description: data.description
        }, { merge: true });
      });

      toast({
        title: "Seeding Initialized",
        description: `Updating ${allCaseNames.length} statutory standards in background.`
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

    const id = selectedCase.toLowerCase().replace(/[\s/().,]+/g, '-').replace(/-+$/, '');
    const docRef = doc(db, "caseRequirements", id);

    setDocumentNonBlocking(docRef, {
      caseName: selectedCase,
      description: description,
      requirements: requirements,
      steps: steps
    }, { merge: true });

    toast({
      title: "Standards Saved",
      description: `Procedural roadmap for ${selectedCase} has been officially updated.`
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Statutory Standards Manager</h1>
            <p className="text-muted-foreground font-medium">Manage dynamic requirements and interactive roadmap flows for all PAO services.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 pb-6">
              <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Seeding
              </CardTitle>
              <CardDescription className="text-xs">Bulk initialize statutory standards.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Button 
                onClick={handleSeedAll} 
                disabled={isSeeding}
                className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl font-black text-white shadow-lg"
              >
                {isSeeding ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <UploadCloud className="mr-2 h-5 w-5" />}
                Seed All Legal Standards
              </Button>
              <p className="text-[9px] text-center text-muted-foreground mt-4 italic">Warning: This will overwrite default values with PAO statutory defaults.</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 pb-6">
              <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Requirement Editor
              </CardTitle>
              <CardDescription className="text-xs">Define specific evidence and roadmap for a legal matter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Case Classification</Label>
                  <Input 
                    placeholder="e.g. Qualified Theft" 
                    value={selectedCase} 
                    onChange={(e) => setSelectedCase(e.target.value)}
                    className="h-12 rounded-xl border-primary/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Short Description</Label>
                  <Input 
                    placeholder="Statutory basis (e.g. RPC Art. 310)" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-12 rounded-xl border-primary/10"
                  />
                </div>
              </div>

              <Tabs defaultValue="requirements" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-2xl h-14">
                  <TabsTrigger value="requirements" className="rounded-xl font-bold flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" /> Document Checklist
                  </TabsTrigger>
                  <TabsTrigger value="steps" className="rounded-xl font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Action Roadmap
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="requirements" className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Add Documentary Evidence</Label>
                    <div className="flex gap-3">
                      <Input 
                        placeholder="e.g. CCTV Footage, Demand Letter" 
                        value={newReq} 
                        onChange={(e) => setNewReq(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addRequirement()}
                        className="h-12 rounded-xl border-primary/10"
                      />
                      <Button size="icon" onClick={addRequirement} variant="outline" className="h-12 w-12 rounded-xl border-2 border-primary/10 text-primary">
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10 group">
                        <span className="text-sm font-bold text-primary">{req}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeRequirement(idx)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="steps" className="space-y-6 pt-6">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {steps.map((step, idx) => (
                      <div key={idx} className="p-6 border-2 border-dashed border-primary/10 rounded-[2rem] bg-primary/[0.02] space-y-4 relative">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-4 right-4 h-8 w-8 text-destructive"
                          onClick={() => removeStep(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-1">
                            <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Step #</Label>
                            <Input type="number" value={step.step} onChange={(e) => updateStep(idx, 'step', parseInt(e.target.value))} className="h-10 rounded-lg" />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Phase Title</Label>
                            <Input value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)} className="h-10 rounded-lg" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Guidance Instruction</Label>
                          <Textarea 
                            className="text-xs rounded-xl min-h-[80px]" 
                            rows={3} 
                            value={step.content} 
                            onChange={(e) => updateStep(idx, 'content', e.target.value)} 
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addStep} className="w-full h-12 rounded-xl border-2 border-dashed border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/5">
                      <Plus className="mr-2 h-4 w-4" /> Add Custom Roadmap Phase
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                className="w-full h-16 bg-primary text-white font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] transition-transform" 
                onClick={handleSaveIndividual}
                disabled={!selectedCase}
              >
                <Save className="mr-2 h-6 w-6" /> Commit Changes to Registry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
