import {
  TaxInputs,
  TaxResults,
  CotisationsSociales,
  ImpotRevenu,
  TvaStatus,
} from "@/types"
import {
  TAX_RATES,
  IR_TRANCHES,
  getCfpRate,
  getTvaThreshold,
} from "@/lib/tax-rates"

function calculateCotisationsSociales(
  inputs: TaxInputs
): CotisationsSociales {
  const baseRate = TAX_RATES.cotisations[inputs.activityType]
  const effectiveRate = inputs.hasACRE
    ? baseRate * (1 - TAX_RATES.acreReduction)
    : baseRate
  const amount = (inputs.annualRevenue * effectiveRate) / 100

  return {
    baseRate,
    effectiveRate,
    amount,
    acreApplied: inputs.hasACRE,
  }
}

function estimateIRFromTranches(revenuImposable: number): number {
  if (revenuImposable <= 0) return 0
  let ir = 0
  for (const tranche of IR_TRANCHES) {
    if (revenuImposable <= tranche.min) break
    const taxableInTranche = Math.min(revenuImposable, tranche.max) - tranche.min
    ir += (taxableInTranche * tranche.rate) / 100
  }
  return ir
}

function calculateImpotRevenu(inputs: TaxInputs): ImpotRevenu {
  const abattementRate = TAX_RATES.abattement[inputs.activityType]
  const abattementAmount = (inputs.annualRevenue * abattementRate) / 100
  const minAbattement = 305
  const effectiveAbattement = Math.max(abattementAmount, minAbattement)
  const revenuImposable = Math.max(0, inputs.annualRevenue - effectiveAbattement)

  if (inputs.hasVersementLiberatoire) {
    const versementRate = TAX_RATES.versementLiberatoire[inputs.activityType]
    const versementAmount = (inputs.annualRevenue * versementRate) / 100
    return {
      abattementRate,
      revenuImposable,
      versementLiberatoireRate: versementRate,
      versementLiberatoireAmount: versementAmount,
      estimatedIR: versementAmount,
    }
  }

  // Estimation barème IR (célibataire, 1 part) — indicatif
  const estimatedIR = estimateIRFromTranches(revenuImposable)

  return {
    abattementRate,
    revenuImposable,
    versementLiberatoireRate: null,
    versementLiberatoireAmount: null,
    estimatedIR,
  }
}

function calculateTvaStatus(inputs: TaxInputs): TvaStatus {
  const threshold = getTvaThreshold(inputs.activityType)
  const revenue = inputs.annualRevenue
  const percentageUsed = (revenue / threshold.base) * 100

  let warning: TvaStatus["warning"] = "none"
  if (revenue >= threshold.tolerance) {
    warning = "exceeded_tolerance"
  } else if (revenue >= threshold.base) {
    warning = "exceeded_base"
  } else if (percentageUsed >= 80) {
    warning = "approaching"
  }

  // TVA collectée (si assujetti)
  const tvaCollectee =
    warning !== "none" ? (inputs.annualRevenue * 20) / 120 : 0

  // TVA déductible sur achats
  const tvaDeductible = inputs.purchases.reduce((sum, p) => {
    const tvaAmount = (p.amountHT * p.tvaRate) / 100
    return sum + tvaAmount
  }, 0)

  const tvaSolde = Math.max(0, tvaCollectee - tvaDeductible)

  return {
    isExempt: warning === "none",
    threshold: threshold.base,
    toleranceThreshold: threshold.tolerance,
    currentRevenue: revenue,
    percentageUsed,
    warning,
    tvaCollectee,
    tvaDeductible,
    tvaSolde,
  }
}

export function calculateTaxes(inputs: TaxInputs): TaxResults {
  const cotisationsSociales = calculateCotisationsSociales(inputs)
  const cfpRate = getCfpRate(inputs.activityType)
  const cfp = (inputs.annualRevenue * cfpRate) / 100

  const versementLiberatoireInUrssaf = inputs.hasVersementLiberatoire
    ? (inputs.annualRevenue * TAX_RATES.versementLiberatoire[inputs.activityType]) / 100
    : 0

  const totalUrssaf = cotisationsSociales.amount + cfp + versementLiberatoireInUrssaf

  const impotRevenu = calculateImpotRevenu(inputs)
  const tvaStatus = calculateTvaStatus(inputs)

  const totalPurchasesHT = inputs.purchases.reduce((s, p) => s + p.amountHT, 0)
  const totalTvaDeductible = inputs.purchases.reduce((s, p) => {
    return s + (p.amountHT * p.tvaRate) / 100
  }, 0)

  // Charges totales = cotisations + CFP + IR (si non versement libératoire)
  const irHorsUrssaf = inputs.hasVersementLiberatoire
    ? 0
    : (impotRevenu.estimatedIR ?? 0)

  const totalCharges = cotisationsSociales.amount + cfp + (impotRevenu.estimatedIR ?? 0)
  const revenueNet = inputs.annualRevenue - cotisationsSociales.amount - cfp - irHorsUrssaf

  return {
    cotisationsSociales,
    cfp,
    totalUrssaf,
    impotRevenu,
    tvaStatus,
    totalCharges,
    revenueNet,
    purchases: inputs.purchases,
    totalPurchasesHT,
    totalTvaDeductible,
  }
}
