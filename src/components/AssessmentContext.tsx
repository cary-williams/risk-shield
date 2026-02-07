import { Assessment } from "@/types/risk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield } from "lucide-react";

interface AssessmentContextProps {
  assessment: Assessment;
  onChange: (assessment: Assessment) => void;
}

const AssessmentContext = ({ assessment, onChange }: AssessmentContextProps) => {
  const update = (field: keyof Assessment, value: string) => {
    onChange({ ...assessment, [field]: value });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-accent" />
          Assessment Context
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Assessment Name</Label>
            <Input
              id="name"
              placeholder="e.g., Q1 2026 Security Risk Assessment"
              value={assessment.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the scope and objectives of this assessment..."
              value={assessment.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessUnit">Business Unit / System</Label>
            <Input
              id="businessUnit"
              placeholder="e.g., Cloud Infrastructure"
              value={assessment.businessUnit}
              onChange={(e) => update("businessUnit", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">Assessment Owner</Label>
            <Input
              id="owner"
              placeholder="e.g., Jane Smith"
              value={assessment.owner}
              onChange={(e) => update("owner", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Assessment Date</Label>
            <Input
              id="date"
              type="date"
              value={assessment.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentContext;
