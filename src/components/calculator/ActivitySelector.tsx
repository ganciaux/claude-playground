import { ActivityType, ACTIVITY_LABELS, ACTIVITY_DESCRIPTIONS } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CA_THRESHOLDS } from "@/lib/tax-rates"
import { formatCurrency } from "@/lib/utils"

interface ActivitySelectorProps {
  value: ActivityType
  onChange: (value: ActivityType) => void
}

const ACTIVITY_OPTIONS: ActivityType[] = [
  "bic_commerce",
  "bic_services",
  "bnc_liberal",
  "cipav_liberal",
]

export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="activity-type">Type d&apos;activité</Label>
      <Select value={value} onValueChange={(v) => onChange(v as ActivityType)}>
        <SelectTrigger id="activity-type" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ACTIVITY_OPTIONS.map((type) => (
            <SelectItem key={type} value={type}>
              {ACTIVITY_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Card className="mt-2 border-muted">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-muted-foreground">
            {ACTIVITY_DESCRIPTIONS[value]}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Plafond CA 2025 :{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(CA_THRESHOLDS[value])}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
