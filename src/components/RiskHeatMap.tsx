import { Risk, getRiskSeverity } from "@/types/risk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3X3 } from "lucide-react";

interface RiskHeatMapProps {
  risks: Risk[];
}

const RiskHeatMap = ({ risks }: RiskHeatMapProps) => {
  const getCellRisks = (likelihood: number, impact: number) =>
    risks.filter((r) => r.likelihood === likelihood && r.impact === impact);

  const getCellColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    const severity = getRiskSeverity(score);
    const map: Record<string, string> = {
      Critical: "bg-risk-critical/20 border-risk-critical/40",
      High: "bg-risk-high/20 border-risk-high/40",
      Medium: "bg-risk-medium/20 border-risk-medium/40",
      Low: "bg-risk-low/20 border-risk-low/40",
    };
    return map[severity];
  };

  const impactLabels = ["Negligible", "Minor", "Moderate", "Major", "Severe"];
  const likelihoodLabels = ["Almost Certain", "Likely", "Possible", "Unlikely", "Rare"];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Grid3X3 className="h-5 w-5 text-accent" />
          Risk Heat Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            {/* Header row */}
            <div className="grid grid-cols-6 gap-1 mb-1">
              <div className="text-[10px] font-medium text-muted-foreground text-right pr-2 flex items-end justify-end pb-1">
                Likelihood ↓ / Impact →
              </div>
              {impactLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-[10px] font-medium text-center text-muted-foreground pb-1"
                >
                  {i + 1}<br/>{label}
                </div>
              ))}
            </div>

            {/* Grid rows (likelihood 5 to 1) */}
            {[5, 4, 3, 2, 1].map((likelihood) => (
              <div key={likelihood} className="grid grid-cols-6 gap-1 mb-1">
                <div className="text-[10px] font-medium text-muted-foreground text-right pr-2 flex items-center justify-end">
                  {likelihood} - {likelihoodLabels[5 - likelihood]}
                </div>
                {[1, 2, 3, 4, 5].map((impact) => {
                  const cellRisks = getCellRisks(likelihood, impact);
                  return (
                    <div
                      key={impact}
                      className={`relative border rounded-md min-h-[48px] flex items-center justify-center transition-all ${getCellColor(likelihood, impact)}`}
                    >
                      {cellRisks.length > 0 && (
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold">{cellRisks.length}</span>
                          <span className="text-[9px] text-muted-foreground">
                            {cellRisks.length === 1 ? "risk" : "risks"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskHeatMap;
