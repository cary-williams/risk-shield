import { Risk, getRiskSeverity } from "@/types/risk";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle } from "lucide-react";

interface RiskPostureProps {
  risks: Risk[];
}

const RiskPosture = ({ risks }: RiskPostureProps) => {
  if (risks.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground text-sm">
          Add risks to see the overall posture
        </CardContent>
      </Card>
    );
  }

  const avgResidual =
    risks.reduce((sum, r) => sum + r.residualRiskScore, 0) / risks.length;

  const criticalCount = risks.filter(
    (r) => getRiskSeverity(r.inherentRiskScore) === "Critical"
  ).length;
  const highCount = risks.filter(
    (r) => getRiskSeverity(r.inherentRiskScore) === "High"
  ).length;
  const openCount = risks.filter((r) => r.status === "Open").length;
  const mitigatedCount = risks.filter((r) => r.status === "Mitigated").length;

  let posture: { label: string; color: string; bgColor: string; Icon: typeof ShieldCheck };
  if (avgResidual >= 15 || criticalCount >= 2) {
    posture = { label: "Critical", color: "text-risk-critical", bgColor: "bg-risk-critical/10", Icon: ShieldAlert };
  } else if (avgResidual >= 10 || criticalCount >= 1) {
    posture = { label: "High Risk", color: "text-risk-high", bgColor: "bg-risk-high/10", Icon: AlertTriangle };
  } else if (avgResidual >= 5) {
    posture = { label: "Moderate", color: "text-risk-medium", bgColor: "bg-risk-medium/10", Icon: ShieldCheck };
  } else {
    posture = { label: "Low Risk", color: "text-risk-low", bgColor: "bg-risk-low/10", Icon: CheckCircle };
  }

  const stats = [
    { label: "Total Risks", value: risks.length },
    { label: "Critical", value: criticalCount },
    { label: "High", value: highCount },
    { label: "Open", value: openCount },
    { label: "Mitigated", value: mitigatedCount },
    { label: "Avg Residual", value: avgResidual.toFixed(1) },
  ];

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className={`flex items-center gap-3 rounded-lg px-4 py-3 ${posture.bgColor}`}>
            <posture.Icon className={`h-8 w-8 ${posture.color}`} />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Overall Posture
              </p>
              <p className={`text-xl font-bold ${posture.color}`}>{posture.label}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-start">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskPosture;
