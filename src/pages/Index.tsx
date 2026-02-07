import { useState } from "react";
import {
  Risk,
  Assessment,
  calculateInherentRisk,
  calculateResidualRisk,
} from "@/types/risk";
import AssessmentContext from "@/components/AssessmentContext";
import RiskForm from "@/components/RiskForm";
import RiskTable from "@/components/RiskTable";
import RiskHeatMap from "@/components/RiskHeatMap";
import RiskSummaryCharts from "@/components/RiskSummaryCharts";
import RiskPosture from "@/components/RiskPosture";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ShieldCheck } from "lucide-react";

const Index = () => {
  const [assessment, setAssessment] = useState<Assessment>({
    name: "",
    description: "",
    businessUnit: "",
    owner: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [risks, setRisks] = useState<Risk[]>([]);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSaveRisk = (risk: Risk) => {
    setRisks((prev) => {
      const idx = prev.findIndex((r) => r.id === risk.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = risk;
        return updated;
      }
      return [...prev, risk];
    });
    setShowForm(false);
    setEditingRisk(null);
  };

  const handleEdit = (risk: Risk) => {
    setEditingRisk(risk);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setRisks((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRisk(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container max-w-7xl mx-auto flex items-center gap-3 px-4 py-4">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Risk Register Generator</h1>
            <p className="text-xs text-muted-foreground">
              Security, Compliance & Operational Risk Assessment
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Assessment Context */}
        <AssessmentContext assessment={assessment} onChange={setAssessment} />

        {/* Risk Posture */}
        <RiskPosture risks={risks} />

        {/* Tabs */}
        <Tabs defaultValue="register" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="register">Risk Register</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Risk
              </Button>
            )}
          </div>

          <TabsContent value="register" className="space-y-4">
            {showForm && (
              <RiskForm
                risk={editingRisk}
                onSave={handleSaveRisk}
                onCancel={handleCancel}
              />
            )}
            <RiskTable
              risks={risks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <RiskHeatMap risks={risks} />
            <RiskSummaryCharts risks={risks} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
