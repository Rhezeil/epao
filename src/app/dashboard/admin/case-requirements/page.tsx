
"use client";

import { useState, useMemo } from "react";
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { doc, collection, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Database, 
  UploadCloud, 
  Plus, 
  Trash2, 
  Save, 
  Layers, 
  ClipboardList, 
  Search, 
  Edit3, 
  FileText,
  AlertCircle,
  X,
  Scale
} from "lucide-react";
import { allCaseNames, caseSpecificData, universalPaoFlow } from "@/app/lib/case-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function CaseRequirementsManager() {
  const db = useFirestore();
  const { toast } = useToast();
  
  // Registry State
  const [registrySearch, setRegistrySearch] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);

  // Editor State
  const [selectedCase, setSelectedCase] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [steps, setSteps] = useState<any[]>(universalPaoFlow);
  const [newReq, setNewReq] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Queries
  const standardsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "caseRequirements"), orderBy("caseName", "asc"));
  }, [db]);

  const { data: registry, isLoading: isRegistryLoading } = useCollection(standardsQuery);

  const filteredRegistry = useMemo(() => {
    if (!registry) return [];
    return registry.filter(r => 
      r.caseName?.toLowerCase().includes(registrySearch.toLowerCase()) ||
      r.description?.toLowerCase().includes(registrySearch.toLowerCase())
    );
  }, [registry, registrySearch]);

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
    if (!db || !selectedCase) {
      toast({ variant: "destructive", title: "Incomplete Data", description: "Case classification is required." });
      return;
    }

    setIsSaving(true);
    const id = selectedCase.toLowerCase().replace(/[\s/().,]+/g, '-').replace(/-+$/, '');
    const docRef = doc(db, "caseRequirements", id);

    setDocumentNonBlocking(docRef, {
      caseName: selectedCase,
      description: description,
      requirements: requirements,
      steps: steps
    }, { merge: true });

    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Standards Saved",
        description: `Registry updated for ${selectedCase}.`
      });
    }, 800);
  };

  const handleDelete = (id: string, name: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, "caseRequirements", id));
    toast({ title: "Standard Removed", description: `${name} has been excised from the registry.` });
    if (selectedCase === name) {
      handleClear();
    }
  };

  const handleEdit = (item: any) => {
    setSelectedCase(item.caseName || "");
    setDescription(item.description || "");
    setRequirements(item.requirements || []);
    setSteps(item.steps || universalPaoFlow);
  };

  const handleClear = () => {
    setSelectedCase("");
    setDescription("");
    setRequirements([]);
    setSteps(universalPaoFlow);
    setNewReq("");
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Statutory Standards Manager</h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Registry of Requirements and Procedural Roadmaps</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSeedAll} 
              disabled={isSeeding}
              className="h-12 rounded-2xl border-primary/10 font-bold"
            >
              {isSeeding ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Database className="mr-2 h-4 w-4" />}
              Sync Standards
            </Button>
            <Button onClick={handleClear} className="h-12 rounded-2xl bg-secondary font-black shadow-lg">
              <Plus className="mr-2 h-5 w-5" /> New Legal Matter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Registry Browser */}
          <Card className="lg:col-span-4 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden flex flex-col h-[calc(100vh-16rem)]">
            <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
              <CardTitle className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4" /> Active Registry
              </CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                <Input 
                  placeholder="Search standards..." 
                  className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
                  value={registrySearch}
                  onChange={e => setRegistrySearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto divide-y divide-primary/5">
              {isRegistryLoading ? (
                <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary/20" /></div>
              ) : filteredRegistry.length > 0 ? (
                filteredRegistry.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "p-6 flex items-center justify-between group transition-colors hover:bg-primary/[0.02] cursor-pointer",
                      selectedCase === item.caseName && "bg-primary/5"
                    )}
                    onClick={() => handleEdit(item)}
                  >
                    <div className="space-y-1 pr-4 min-w-0">
                      <p className="font-black text-primary truncate text-sm">{item.caseName}</p>
                      <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tighter">
                        {item.description || "No classification basis"}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.caseName); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-4">
                  <Search className="h-12 w-12 text-primary/5 mx-auto" />
                  <p className="text-xs font-bold text-muted-foreground uppercase">No standards found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editor Panel */}
          <Card className="lg:col-span-8 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden flex flex-col h-[calc(100vh-16rem)]">
            <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Standard Editor
                </CardTitle>
                <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest mt-1">Define evidence and roadmaps</p>
              </div>
              {selectedCase && (
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground hover:text-primary rounded-lg font-bold">
                  <X className="h-4 w-4 mr-1" /> Clear Editor
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-10 space-y-8 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Case Classification Name</Label>
                  <Input 
                    placeholder="e.g. Qualified Theft" 
                    value={selectedCase} 
                    onChange={(e) => setSelectedCase(e.target.value)}
                    className="h-12 rounded-xl border-primary/10 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Statutory Description / Basis</Label>
                  <Input 
                    placeholder="e.g. RPC Art. 310" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-12 rounded-xl border-primary/10 font-bold"
                  />
                </div>
              </div>

              <Tabs defaultValue="requirements" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-2xl h-14">
                  <TabsTrigger value="requirements" className="rounded-xl font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    <ClipboardList className="h-4 w-4" /> Document Checklist
                  </TabsTrigger>
                  <TabsTrigger value="steps" className="rounded-xl font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    <Layers className="h-4 w-4" /> Action Roadmap
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="requirements" className="space-y-6 pt-6 animate-in fade-in duration-300">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10 group transition-all hover:bg-primary/10">
                        <span className="text-xs font-bold text-primary truncate pr-2">{req}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeRequirement(idx)} className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {requirements.length === 0 && (
                      <div className="md:col-span-2 py-12 text-center bg-muted/5 rounded-3xl border-2 border-dashed">
                        <AlertCircle className="h-8 w-8 text-primary/10 mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No custom requirements listed</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="steps" className="space-y-6 pt-6 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    {steps.map((step, idx) => (
                      <div key={idx} className="p-6 border-2 border-dashed border-primary/10 rounded-[2rem] bg-primary/[0.02] space-y-4 relative group hover:border-primary/20 transition-all">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-4 right-4 h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeStep(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-2">
                            <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Step #</Label>
                            <Input type="number" value={step.step} onChange={(e) => updateStep(idx, 'step', parseInt(e.target.value))} className="h-10 rounded-lg font-bold text-center" />
                          </div>
                          <div className="col-span-10">
                            <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Phase Title</Label>
                            <Input value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)} className="h-10 rounded-lg font-bold" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Guidance Instruction</Label>
                          <Textarea 
                            className="text-xs rounded-xl min-h-[80px] bg-white" 
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
            </CardContent>
            <div className="p-8 bg-muted/30 border-t flex justify-end shrink-0">
              <Button 
                onClick={handleSaveIndividual}
                disabled={isSaving || !selectedCase}
                className="min-w-[200px] h-14 bg-primary text-white font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] transition-transform"
              >
                {isSaving ? <Loader2 className="animate-spin mr-2 h-6 w-6" /> : <Save className="mr-2 h-6 w-6" />}
                Publish Changes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
