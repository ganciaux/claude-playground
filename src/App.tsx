import { TooltipProvider } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import { RevenueForm } from "@/components/calculator/RevenueForm"
import { PurchasesManager } from "@/components/calculator/PurchasesManager"
import { ResultsSummary } from "@/components/calculator/ResultsSummary"
import { TvaStatusCard } from "@/components/calculator/TvaStatusCard"
import { useTaxCalculator } from "@/hooks/useTaxCalculator"
import { Calculator, ShoppingCart, BarChart3, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function App() {
  const {
    inputs,
    results,
    setActivityType,
    setAnnualRevenue,
    setHasACRE,
    setHasVersementLiberatoire,
    addPurchase,
    removePurchase,
  } = useTaxCalculator()

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column — Inputs */}
            <div className="space-y-6">
              <Tabs defaultValue="revenue">
                <TabsList className="w-full">
                  <TabsTrigger value="revenue" className="flex-1 gap-2">
                    <Calculator className="w-4 h-4" />
                    Revenus
                  </TabsTrigger>
                  <TabsTrigger value="purchases" className="flex-1 gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Achats
                    {inputs.purchases.length > 0 && (
                      <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center">
                        {inputs.purchases.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="revenue">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Votre situation
                      </CardTitle>
                      <CardDescription>
                        Renseignez votre activité et votre chiffre d&apos;affaires
                        annuel prévisionnel ou réel.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RevenueForm
                        activityType={inputs.activityType}
                        annualRevenue={inputs.annualRevenue}
                        hasACRE={inputs.hasACRE}
                        hasVersementLiberatoire={inputs.hasVersementLiberatoire}
                        onActivityTypeChange={setActivityType}
                        onRevenueChange={setAnnualRevenue}
                        onACREChange={setHasACRE}
                        onVersementLiberatoireChange={setHasVersementLiberatoire}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="purchases">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Achats professionnels
                      </CardTitle>
                      <CardDescription>
                        En franchise de TVA, vous ne pouvez pas déduire la TVA.
                        Si vous devenez assujetti, la TVA sur vos achats est
                        récupérable.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PurchasesManager
                        purchases={inputs.purchases}
                        onAdd={addPurchase}
                        onRemove={removePurchase}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* TVA Status */}
              {results && (
                <TvaStatusCard tvaStatus={results.tvaStatus} />
              )}
            </div>

            {/* Right column — Results */}
            <div className="space-y-6">
              {results ? (
                <>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">
                      Résultats de la simulation
                    </h2>
                  </div>
                  <ResultsSummary
                    results={results}
                    annualRevenue={inputs.annualRevenue}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                  Entrez un chiffre d&apos;affaires pour voir les résultats
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <Alert className="mt-10" variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs text-muted-foreground">
              <strong>Avertissement :</strong> Ce calculateur est fourni à titre
              informatif uniquement, basé sur les taux URSSAF 2025. Les résultats
              sont des estimations et ne constituent pas un conseil fiscal ou
              juridique. Pour votre situation personnelle, consultez un expert-
              comptable ou l&apos;URSSAF. L&apos;estimation de l&apos;impôt sur le
              revenu est calculée pour un célibataire sans autres revenus ni
              déductions.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    </TooltipProvider>
  )
}
