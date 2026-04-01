import { Risk, Assessment, getRiskSeverity } from "@/types/risk";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCSV(risks: Risk[], assessment: Assessment) {
  const headers = [
    "Risk Title", "Description", "Category", "Asset/Process", "Threat Source",
    "Threat Event", "Existing Controls", "Control Effectiveness",
    "Likelihood", "Impact", "Inherent Risk Score", "Residual Risk Score",
    "Severity", "Risk Owner", "Status", "Response Type",
    "Proposed Actions", "Target Date", "Notes"
  ];

  const rows = risks.map((r) => [
    r.title, r.description, r.category, r.assetOrProcess, r.threatSource,
    r.threatEvent, r.existingControls, r.controlEffectiveness,
    r.likelihood, r.impact, r.inherentRiskScore, r.residualRiskScore,
    getRiskSeverity(r.inherentRiskScore), r.riskOwner, r.status,
    r.treatment.responseType, r.treatment.proposedActions,
    r.treatment.targetDate, r.treatment.notes
  ]);

  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const csv = [headers.map(escape).join(","), ...rows.map(r => r.map(escape).join(","))].join("\n");
  download(csv, `${assessment.name || "risk-register"}.csv`, "text/csv");
}

export function exportPDF(risks: Risk[], assessment: Assessment) {
  const doc = new jsPDF({ orientation: "landscape" });

  // Title
  doc.setFontSize(18);
  doc.text("Risk Register Report", 14, 20);

  // Assessment info
  doc.setFontSize(10);
  const info = [
    `Assessment: ${assessment.name || "N/A"}`,
    `Business Unit: ${assessment.businessUnit || "N/A"}`,
    `Owner: ${assessment.owner || "N/A"}`,
    `Date: ${assessment.date || "N/A"}`,
  ];
  if (assessment.description) info.push(`Description: ${assessment.description}`);
  info.forEach((line, i) => doc.text(line, 14, 30 + i * 6));

  const startY = 30 + info.length * 6 + 6;

  // Risk table
  autoTable(doc, {
    startY,
    head: [["#", "Title", "Category", "L", "I", "Inherent", "Residual", "Severity", "Status", "Response", "Owner"]],
    body: risks.map((r, i) => [
      i + 1, r.title, r.category, r.likelihood, r.impact,
      r.inherentRiskScore, r.residualRiskScore,
      getRiskSeverity(r.inherentRiskScore), r.status,
      r.treatment.responseType, r.riskOwner
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255 },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 7) {
        const sev = String(data.cell.raw);
        const colors: Record<string, [number, number, number]> = {
          Critical: [220, 38, 38], High: [234, 88, 12],
          Medium: [202, 138, 4], Low: [22, 163, 74],
        };
        if (colors[sev]) data.cell.styles.textColor = colors[sev];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  doc.save(`${assessment.name || "risk-register"}.pdf`);
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}