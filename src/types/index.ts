export type ActivityType =
  | "bic_commerce"
  | "bic_services"
  | "bnc_liberal"
  | "cipav_liberal"

export type TvaRate = 0 | 5.5 | 10 | 20

export interface Purchase {
  id: string
  description: string
  amountHT: number
  tvaRate: TvaRate
}

export interface TaxInputs {
  activityType: ActivityType
  annualRevenue: number
  hasACRE: boolean
  hasVersementLiberatoire: boolean
  purchases: Purchase[]
}

export interface CotisationsSociales {
  baseRate: number
  effectiveRate: number
  amount: number
  acreApplied: boolean
}

export interface ImpotRevenu {
  abattementRate: number
  revenuImposable: number
  versementLiberatoireRate: number | null
  versementLiberatoireAmount: number | null
  estimatedIR: number | null
}

export interface TvaStatus {
  isExempt: boolean
  threshold: number
  toleranceThreshold: number
  currentRevenue: number
  percentageUsed: number
  warning: "none" | "approaching" | "exceeded_base" | "exceeded_tolerance"
  tvaCollectee: number
  tvaDeductible: number
  tvaSolde: number
}

export interface TaxResults {
  cotisationsSociales: CotisationsSociales
  cfp: number
  totalUrssaf: number
  impotRevenu: ImpotRevenu
  tvaStatus: TvaStatus
  totalCharges: number
  revenueNet: number
  purchases: Purchase[]
  totalPurchasesHT: number
  totalTvaDeductible: number
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  bic_commerce: "BIC — Vente / Achat-Revente (Commerce)",
  bic_services: "BIC — Prestations de services",
  bnc_liberal: "BNC — Professions libérales non réglementées",
  cipav_liberal: "BNC — Professions libérales réglementées (CIPAV)",
}

export const ACTIVITY_DESCRIPTIONS: Record<ActivityType, string> = {
  bic_commerce:
    "Vente de marchandises, restauration, hébergement. Ex: e-commerce, boutique, artisan-commerçant.",
  bic_services:
    "Prestations de services commerciales et artisanales. Ex: plombier, coiffeur, développeur, consultant.",
  bnc_liberal:
    "Professions libérales non réglementées. Ex: formateur, coach, traducteur, graphiste.",
  cipav_liberal:
    "Professions libérales réglementées affiliées CIPAV. Ex: architecte, géomètre, ostéopathe.",
}
