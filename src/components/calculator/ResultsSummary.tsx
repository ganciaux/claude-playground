import { TaxResults } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { TrendingDown, TrendingUp, Wallet, Receipt } from "lucide-react"

interface ResultsSummaryProps {
  results: TaxResults
  annualRevenue: number
}

interface StatCardProps {
  label: string
  value: string
  sublabel?: string
  icon: React.ElementType
  variant?: "default" | "positive" | "negative"
}

function StatCard({ label, value, sublabel, icon: Icon, variant = "default" }: StatCardProps) {
  const colorClass =
    variant === "positive"
      ? "text-green-600"
      : variant === "negative"
      ? "text-red-600"
      : "text-foreground"

  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  )
}

export function ResultsSummary({ results, annualRevenue }: ResultsSummaryProps) {
  const chargesRate = annualRevenue > 0 ? (results.totalCharges / annualRevenue) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Revenu net estimé"
          value={formatCurrency(results.revenueNet)}
          sublabel={`${formatPercent(results.revenueNet > 0 ? (results.revenueNet / annualRevenue) * 100 : 0)} du CA`}
          icon={Wallet}
          variant="positive"
        />
        <StatCard
          label="Charges totales"
          value={formatCurrency(results.totalCharges)}
          sublabel={`${formatPercent(chargesRate)} du CA`}
          icon={TrendingDown}
          variant="negative"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cotisations URSSAF</CardTitle>
          <CardDescription>
            Déclarées et payées selon la fréquence choisie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground flex items-center gap-2">
              Cotisations sociales
              {results.cotisationsSociales.acreApplied && (
                <Badge variant="success" className="text-xs">ACRE -50%</Badge>
              )}
            </span>
            <div className="text-right">
              <span className="font-medium">
                {formatCurrency(results.cotisationsSociales.amount)}
              </span>
              <span className="text-xs text-muted-foreground block">
                {formatPercent(results.cotisationsSociales.effectiveRate)} du CA
              </span>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Formation professionnelle (CFP)
            </span>
            <span className="font-medium">{formatCurrency(results.cfp)}</span>
          </div>

          {results.impotRevenu.versementLiberatoireAmount !== null && (
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                Versement libératoire IR
                <Badge variant="secondary" className="text-xs">
                  {results.impotRevenu.versementLiberatoireRate}%
                </Badge>
              </span>
              <span className="font-medium">
                {formatCurrency(results.impotRevenu.versementLiberatoireAmount)}
              </span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total URSSAF</span>
            <span>{formatCurrency(results.totalUrssaf)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Impôt sur le revenu
          </CardTitle>
          <CardDescription>
            {results.impotRevenu.versementLiberatoireRate !== null
              ? "Versement libératoire inclus dans les cotisations URSSAF"
              : "Estimation barème IR — célibataire, 1 part fiscale"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Abattement forfaitaire ({results.impotRevenu.abattementRate}%)
            </span>
            <span className="font-medium text-green-600">
              -{formatCurrency(
                Math.max(
                  annualRevenue * results.impotRevenu.abattementRate / 100,
                  305
                )
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Revenu imposable estimé</span>
            <span className="font-medium">
              {formatCurrency(results.impotRevenu.revenuImposable)}
            </span>
          </div>
          {results.impotRevenu.estimatedIR !== null && (
            <>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>
                  {results.impotRevenu.versementLiberatoireRate !== null
                    ? "IR (versement libératoire)"
                    : "IR estimé (barème)"}
                </span>
                <span className="text-orange-600">
                  {formatCurrency(results.impotRevenu.estimatedIR)}
                </span>
              </div>
              {results.impotRevenu.versementLiberatoireRate === null && (
                <p className="text-xs text-muted-foreground">
                  ⚠️ Estimation indicative. L&apos;IR réel dépend de votre situation
                  fiscale globale (autres revenus, parts familiales, déductions).
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Synthèse annuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chiffre d&apos;affaires</span>
            <span className="font-medium">{formatCurrency(annualRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">— Cotisations sociales + CFP</span>
            <span className="text-red-600">
              -{formatCurrency(results.cotisationsSociales.amount + results.cfp)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">— Impôt sur le revenu</span>
            <span className="text-orange-600">
              -{formatCurrency(results.impotRevenu.estimatedIR ?? 0)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-bold pt-1">
            <span>Revenu net estimé</span>
            <span className="text-green-600">
              {formatCurrency(results.revenueNet)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Revenu net mensuel estimé</span>
            <span>{formatCurrency(results.revenueNet / 12)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
