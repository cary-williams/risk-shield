import { useState } from "react";
import { Risk, getRiskSeverity } from "@/types/risk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, ArrowUpDown, List } from "lucide-react";

interface RiskTableProps {
  risks: Risk[];
  onEdit: (risk: Risk) => void;
  onDelete: (id: string) => void;
}

type SortKey = "title" | "inherentRiskScore" | "residualRiskScore" | "category" | "status";

const severityBadgeClass: Record<string, string> = {
  Critical: "risk-badge-critical",
  High: "risk-badge-high",
  Medium: "risk-badge-medium",
  Low: "risk-badge-low",
};

const RiskTable = ({ risks, onEdit, onDelete }: RiskTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("inherentRiskScore");
  const [sortAsc, setSortAsc] = useState(false);

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sorted = [...risks].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === "number" ? (av as number) - (bv as number) : String(av).localeCompare(String(bv));
    return sortAsc ? cmp : -cmp;
  });

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground"
      onClick={() => toggle(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </span>
    </TableHead>
  );

  if (risks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <List className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="text-sm">No risks added yet. Add your first risk to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <List className="h-5 w-5 text-accent" />
          Risk Register ({risks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortHeader label="Risk" field="title" />
                <SortHeader label="Category" field="category" />
                <TableHead>Likelihood</TableHead>
                <TableHead>Impact</TableHead>
                <SortHeader label="Inherent" field="inherentRiskScore" />
                <SortHeader label="Residual" field="residualRiskScore" />
                <TableHead>Severity</TableHead>
                <SortHeader label="Status" field="status" />
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((risk) => {
                const severity = getRiskSeverity(risk.inherentRiskScore);
                return (
                  <TableRow key={risk.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {risk.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {risk.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{risk.likelihood}</TableCell>
                    <TableCell className="text-center">{risk.impact}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {risk.inherentRiskScore}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {risk.residualRiskScore}
                    </TableCell>
                    <TableCell>
                      <Badge className={severityBadgeClass[severity]}>
                        {severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={risk.status === "Open" ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {risk.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => onEdit(risk)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onDelete(risk.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskTable;
