import { useState } from "react";
import {
  Risk,
  ControlEffectiveness,
  RiskCategory,
  RiskStatus,
  ResponseType,
  calculateInherentRisk,
  calculateResidualRisk,
} from "@/types/risk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Save, X } from "lucide-react";

interface RiskFormProps {
  risk?: Risk | null;
  onSave: (risk: Risk) => void;
  onCancel: () => void;
}

const emptyRisk: Omit<Risk, "id" | "inherentRiskScore" | "residualRiskScore"> = {
  title: "",
  description: "",
  assetOrProcess: "",
  threatSource: "",
  threatEvent: "",
  existingControls: "",
  controlEffectiveness: "Partially Effective",
  likelihood: 3,
  impact: 3,
  category: "Security",
  riskOwner: "",
  status: "Open",
  treatment: {
    responseType: "Mitigate",
    proposedActions: "",
    targetDate: "",
    notes: "",
  },
};

const RiskForm = ({ risk, onSave, onCancel }: RiskFormProps) => {
  const [form, setForm] = useState(() => {
    if (risk) {
      const { id, inherentRiskScore, residualRiskScore, ...rest } = risk;
      return rest;
    }
    return { ...emptyRisk, treatment: { ...emptyRisk.treatment } };
  });

  const inherent = calculateInherentRisk(form.likelihood, form.impact);
  const residual = calculateResidualRisk(inherent, form.controlEffectiveness);

  const update = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const updateTreatment = <K extends keyof Risk["treatment"]>(
    key: K,
    val: Risk["treatment"][K]
  ) => setForm((p) => ({ ...p, treatment: { ...p.treatment, [key]: val } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      id: risk?.id || crypto.randomUUID(),
      inherentRiskScore: inherent,
      residualRiskScore: residual,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {risk ? "Edit Risk" : "Add New Risk"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Risk Title *</Label>
              <Input
                required
                placeholder="e.g., Unauthorized Data Access"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Risk Description</Label>
              <Textarea
                placeholder="Describe the risk in detail..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Asset / Process Impacted</Label>
              <Input
                placeholder="e.g., Customer Database"
                value={form.assetOrProcess}
                onChange={(e) => update("assetOrProcess", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Threat Source</Label>
              <Input
                placeholder="e.g., External Attacker"
                value={form.threatSource}
                onChange={(e) => update("threatSource", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Threat Event</Label>
              <Input
                placeholder="e.g., SQL Injection Attack"
                value={form.threatEvent}
                onChange={(e) => update("threatEvent", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Risk Owner</Label>
              <Input
                placeholder="e.g., John Doe"
                value={form.riskOwner}
                onChange={(e) => update("riskOwner", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Existing Controls</Label>
              <Textarea
                placeholder="Describe current controls in place..."
                value={form.existingControls}
                onChange={(e) => update("existingControls", e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Ratings */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Control Effectiveness</Label>
              <Select
                value={form.controlEffectiveness}
                onValueChange={(v) =>
                  update("controlEffectiveness", v as ControlEffectiveness)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Effective">Effective</SelectItem>
                  <SelectItem value="Partially Effective">Partially Effective</SelectItem>
                  <SelectItem value="Ineffective">Ineffective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Likelihood (1–5)</Label>
              <Select
                value={String(form.likelihood)}
                onValueChange={(v) => update("likelihood", Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} — {["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"][n - 1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Impact (1–5)</Label>
              <Select
                value={String(form.impact)}
                onValueChange={(v) => update("impact", Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} — {["Negligible", "Minor", "Moderate", "Major", "Severe"][n - 1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => update("category", v as RiskCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Security", "Compliance", "Operational", "Privacy", "Financial"].map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => update("status", v as RiskStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Open", "Accepted", "Mitigated", "Transferred"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calculated scores */}
          <div className="flex gap-6 rounded-lg border bg-muted/50 p-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Inherent Risk Score
              </span>
              <p className="text-2xl font-bold">{inherent}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Residual Risk Score
              </span>
              <p className="text-2xl font-bold">{residual}</p>
            </div>
          </div>

          <Separator />

          {/* Treatment */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Treatment Actions
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Response Type</Label>
                <Select
                  value={form.treatment.responseType}
                  onValueChange={(v) =>
                    updateTreatment("responseType", v as ResponseType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mitigate", "Accept", "Transfer", "Avoid"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Completion Date</Label>
                <Input
                  type="date"
                  value={form.treatment.targetDate}
                  onChange={(e) => updateTreatment("targetDate", e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Proposed Remediation Actions</Label>
                <Textarea
                  placeholder="Describe the proposed actions..."
                  value={form.treatment.proposedActions}
                  onChange={(e) =>
                    updateTreatment("proposedActions", e.target.value)
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={form.treatment.notes}
                  onChange={(e) => updateTreatment("notes", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit">
              {risk ? (
                <>
                  <Save className="mr-1 h-4 w-4" /> Update Risk
                </>
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" /> Add Risk
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default RiskForm;
