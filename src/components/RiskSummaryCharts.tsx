import { Risk, getRiskSeverity } from "@/types/risk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface RiskSummaryChartsProps {
  risks: Risk[];
}

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "hsl(0, 72%, 51%)",
  High: "hsl(25, 95%, 53%)",
  Medium: "hsl(45, 93%, 47%)",
  Low: "hsl(142, 71%, 45%)",
};

const RiskSummaryCharts = ({ risks }: RiskSummaryChartsProps) => {
  // Severity distribution
  const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  risks.forEach((r) => {
    const sev = getRiskSeverity(r.inherentRiskScore);
    severityCounts[sev]++;
  });
  const severityData = Object.entries(severityCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Inherent vs Residual comparison
  const comparisonData = risks.map((r) => ({
    name: r.title.length > 18 ? r.title.slice(0, 18) + "…" : r.title,
    Inherent: r.inherentRiskScore,
    Residual: r.residualRiskScore,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-accent" />
            Risks by Severity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {risks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {severityData.map((entry) => (
                    <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-accent" />
            Inherent vs Residual Risk
          </CardTitle>
        </CardHeader>
        <CardContent>
          {risks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Inherent" fill="hsl(217, 71%, 30%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Residual" fill="hsl(192, 75%, 36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskSummaryCharts;
