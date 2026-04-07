import { useState, useMemo } from "react"
import { ActivityType, Purchase, TaxInputs } from "@/types"
import { calculateTaxes } from "@/lib/tax-calculator"

const DEFAULT_INPUTS: TaxInputs = {
  activityType: "bic_services",
  annualRevenue: 40_000,
  hasACRE: false,
  hasVersementLiberatoire: false,
  purchases: [],
}

export function useTaxCalculator() {
  const [inputs, setInputs] = useState<TaxInputs>(DEFAULT_INPUTS)

  const results = useMemo(() => {
    if (inputs.annualRevenue <= 0) return null
    return calculateTaxes(inputs)
  }, [inputs])

  function setActivityType(activityType: ActivityType) {
    setInputs((prev) => ({ ...prev, activityType }))
  }

  function setAnnualRevenue(annualRevenue: number) {
    setInputs((prev) => ({ ...prev, annualRevenue }))
  }

  function setHasACRE(hasACRE: boolean) {
    setInputs((prev) => ({ ...prev, hasACRE }))
  }

  function setHasVersementLiberatoire(hasVersementLiberatoire: boolean) {
    setInputs((prev) => ({ ...prev, hasVersementLiberatoire }))
  }

  function addPurchase(purchase: Purchase) {
    setInputs((prev) => ({
      ...prev,
      purchases: [...prev.purchases, purchase],
    }))
  }

  function removePurchase(id: string) {
    setInputs((prev) => ({
      ...prev,
      purchases: prev.purchases.filter((p) => p.id !== id),
    }))
  }

  return {
    inputs,
    results,
    setActivityType,
    setAnnualRevenue,
    setHasACRE,
    setHasVersementLiberatoire,
    addPurchase,
    removePurchase,
  }
}
