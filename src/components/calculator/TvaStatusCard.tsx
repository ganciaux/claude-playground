import { TvaStatus } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react"

interface TvaStatusCardProps {
  tvaStatus: TvaStatus
}

const WARNING_CONFIG = {
  none: {
    variant: "success" as const,
    icon: CheckCircle,
    title: "Franchise en base de TVA",
    message: "Vous bénéficiez de la franchise en base. Vous ne collectez pas de TVA et ne la déduisez pas non plus.",
  },
  approaching: {
    variant: "warning" as const,
    icon: Info,
    title: "Seuil TVA approchant",
    message: "Vous approchez du seuil de franchise en base. Surveillez votre CA.",
  },
  exceeded_base: {
    variant: "warning" as const,
    icon: AlertTriangle,
    title: "Seuil de base dépassé",
    message:
      "Vous avez dépassé le seuil de base. Si le seuil de tolérance est aussi dépassé en cours d'année, vous serez assujetti à la TVA immédiatement.",
  },
  exceeded_tolerance: {
    variant: "destructive" as const,
    icon: XCircle,
    title: "Assujettissement à la TVA",
    message:
      "Vous avez dépassé le seuil de tolérance. Vous devez facturer la TVA dès le 1er jour du mois de dépassement. Contactez votre SIE.",
  },
}

export function TvaStatusCard({ tvaStatus }: TvaStatusCardProps) {
  const config = WARNING_CONFIG[tvaStatus.warning]
  const Icon = config.icon
  const progressValue = Math.min(tvaStatus.percentageUsed, 100)

  const progressColor =
    tvaStatus.warning === "none"
      ? "bg-green-500"
      : tvaStatus.warning === "approaching"
      ? "bg-yellow-500"
      : "bg-red-500"

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          TVA — Franchise en base
          <Badge variant={tvaStatus.isExempt ? "success" : "destructive"}>
            {tvaStatus.isExempt ? "Exonéré" : "Assujetti"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Seuil : {formatCurrency(tvaStatus.threshold)} / Tolérance :{" "}
          {formatCurrency(tvaStatus.toleranceThreshold)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">CA actuel</span>
            <span className="font-medium">
              {formatCurrency(tvaStatus.currentRevenue)}
            </span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full transition-all ${progressColor}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {formatPercent(tvaStatus.percentageUsed)} du seuil de base atteint
          </p>
        </div>

        <Alert variant={config.variant}>
          <Icon className="h-4 w-4" />
          <AlertTitle>{config.title}</AlertTitle>
          <AlertDescription>{config.message}</AlertDescription>
        </Alert>

        {!tvaStatus.isExempt && (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              <h4 className="font-medium">Simulation TVA</h4>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA collectée (taux 20%)</span>
                <span>{formatCurrency(tvaStatus.tvaCollectee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA déductible (achats)</span>
                <span className="text-green-600">
                  -{formatCurrency(tvaStatus.tvaDeductible)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>TVA à reverser</span>
                <span className="text-destructive">
                  {formatCurrency(tvaStatus.tvaSolde)}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
