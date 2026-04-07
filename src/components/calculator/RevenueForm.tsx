import { ActivityType } from "@/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ActivitySelector } from "./ActivitySelector"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

interface RevenueFormProps {
  activityType: ActivityType
  annualRevenue: number
  hasACRE: boolean
  hasVersementLiberatoire: boolean
  onActivityTypeChange: (v: ActivityType) => void
  onRevenueChange: (v: number) => void
  onACREChange: (v: boolean) => void
  onVersementLiberatoireChange: (v: boolean) => void
}

export function RevenueForm({
  activityType,
  annualRevenue,
  hasACRE,
  hasVersementLiberatoire,
  onActivityTypeChange,
  onRevenueChange,
  onACREChange,
  onVersementLiberatoireChange,
}: RevenueFormProps) {
  return (
    <div className="space-y-6">
      <ActivitySelector value={activityType} onChange={onActivityTypeChange} />

      <div className="space-y-2">
        <Label htmlFor="annual-revenue">Chiffre d&apos;affaires annuel (€)</Label>
        <div className="relative">
          <Input
            id="annual-revenue"
            type="number"
            min={0}
            step={100}
            value={annualRevenue || ""}
            placeholder="Ex: 50000"
            onChange={(e) => onRevenueChange(parseFloat(e.target.value) || 0)}
            className="pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            €
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="acre-switch" className="cursor-pointer">
              Bénéficier de l&apos;ACRE
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Aide à la Création ou Reprise d&apos;Entreprise. Réduction de
                  50% sur les cotisations sociales pendant les 12 premiers mois.
                  Sous conditions de ressources et de création d&apos;activité.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            id="acre-switch"
            checked={hasACRE}
            onCheckedChange={onACREChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="vl-switch" className="cursor-pointer">
              Versement libératoire de l&apos;IR
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Option permettant de payer l&apos;impôt sur le revenu en même
                  temps que les cotisations sociales, calculé sur le CA. Taux
                  fixe : 1% (commerce), 1,7% (services BIC), 2,2% (BNC).
                  Conditions : RFR N-2 ≤ 28 797 € / part.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            id="vl-switch"
            checked={hasVersementLiberatoire}
            onCheckedChange={onVersementLiberatoireChange}
          />
        </div>
      </div>
    </div>
  )
}
