
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
import { Loader2, Database, UploadCloud, Plus, Trash2, Save } from "lucide-react";
import { allCaseNames, defaultRequirements, defaultSteps } from "@/app/lib/case-data";

export default function CaseRequirementsManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [selectedCase, setSelectedCase] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newReq, setNewReq] = useState("");

  const handleSeedAll = async () => {
    if (!db) return;
    setIsSeeding(true);
    
    try {
      const promises = allCaseNames.map(caseName => {
        const id = caseName.toLowerCase().replace(/\s+/g, '-');
        const docRef = doc(db, "caseRequirements", id);
        return setDocumentNonBlocking(docRef, {
          caseName: caseName,
          requirements: defaultRequirements,
          steps: defaultSteps
        }, { merge: true });
      });

      toast({
        title: "Seeding Started",
        description: `Initializing ${allCaseNames.length} case requirements in Firestore.`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Seeding Failed",
        description: error.message
      });
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

  const handleSaveIndividual = () => {
    if (!db || !selectedCase) return;

    const id = selectedCase.toLowerCase().replace(/\s+/g, '-');
    const docRef = doc(db, "caseRequirements", id);

    setDocumentNonBlocking(docRef, {
      caseName: selectedCase,
      requirements: requirements,
      steps: defaultSteps
    }, { merge: true });

    toast({
      title: "Saved",
      description: `Requirements for ${selectedCase} updated.`
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Case Requirements Manager</h1>
          <p className="text-muted-foreground">Manage dynamic requirements and processes for all legal case types.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Database Seeding
              </CardTitle>
              <CardDescription>
                Populate Firestore with default requirements for all {allCaseNames.length} known case types.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSeedAll} 
                disabled={isSeeding}
                className="w-full bg-secondary hover:bg-secondary/90"
              >
                {isSeeding ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Seed All Case Categories
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Manual Entry
              </CardTitle>
              <CardDescription>
                Override or add specific requirements for a particular case.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Case Name</Label>
                <Input 
                  placeholder="e.g. Murder, Theft, Annulment" 
                  value={selectedCase} 
                  onChange={(e) => setSelectedCase(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Requirements</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add document requirement" 
                    value={newReq} 
                    onChange={(e) => setNewReq(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <Button size="icon" onClick={addRequirement} variant="outline"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-2 mt-2">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                      <span>{req}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeRequirement(idx)} className="h-6 w-6 text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleSaveIndividual}
                disabled={!selectedCase || requirements.length === 0}
              >
                <Save className="mr-2 h-4 w-4" /> Save Case Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
