export type ControlEffectiveness = "Effective" | "Partially Effective" | "Ineffective";
export type RiskCategory = "Security" | "Compliance" | "Operational" | "Privacy" | "Financial";
export type RiskStatus = "Open" | "Accepted" | "Mitigated" | "Transferred";
export type ResponseType = "Mitigate" | "Accept" | "Transfer" | "Avoid";

export interface TreatmentAction {
  responseType: ResponseType;
  proposedActions: string;
  targetDate: string;
  notes: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  assetOrProcess: string;
  threatSource: string;
  threatEvent: string;
  existingControls: string;
  controlEffectiveness: ControlEffectiveness;
  likelihood: number;
  impact: number;
  inherentRiskScore: number;
  residualRiskScore: number;
  category: RiskCategory;
  riskOwner: string;
  status: RiskStatus;
  treatment: TreatmentAction;
}

export interface Assessment {
  name: string;
  description: string;
  businessUnit: string;
  owner: string;
  date: string;
}

export type RiskSeverity = "Critical" | "High" | "Medium" | "Low";

export function calculateInherentRisk(likelihood: number, impact: number): number {
  return likelihood * impact;
}

export function calculateResidualRisk(
  inherentScore: number,
  effectiveness: ControlEffectiveness
): number {
  const factors: Record<ControlEffectiveness, number> = {
    Effective: 0.3,
    "Partially Effective": 0.6,
    Ineffective: 0.9,
  };
  return Math.round(inherentScore * factors[effectiveness] * 10) / 10;
}

export function getRiskSeverity(score: number): RiskSeverity {
  if (score >= 20) return "Critical";
  if (score >= 12) return "High";
  if (score >= 6) return "Medium";
  return "Low";
}

export function getSeverityColor(severity: RiskSeverity): string {
  const map: Record<RiskSeverity, string> = {
    Critical: "hsl(var(--risk-critical))",
    High: "hsl(var(--risk-high))",
    Medium: "hsl(var(--risk-medium))",
    Low: "hsl(var(--risk-low))",
  };
  return map[severity];
}
