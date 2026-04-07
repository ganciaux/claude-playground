import { ActivityType } from "@/types"

// Taux 2025 — source URSSAF / service-public.fr
export const TAX_RATES = {
  // Cotisations sociales (% du CA)
  cotisations: {
    bic_commerce: 12.3,
    bic_services: 21.2,
    bnc_liberal: 25.6,
    cipav_liberal: 24.1,
  },

  // Contribution à la Formation Professionnelle (% du CA)
  cfp: {
    bic_commerce: 0.1,
    bic_services_artisan: 0.3,
    bic_services_commercant: 0.1,
    bnc_liberal: 0.1,
    cipav_liberal: 0.1,
  },

  // Versement Libératoire de l'IR (% du CA, optionnel)
  versementLiberatoire: {
    bic_commerce: 1.0,
    bic_services: 1.7,
    bnc_liberal: 2.2,
    cipav_liberal: 2.2,
  },

  // Abattement forfaitaire pour le calcul de l'IR
  abattement: {
    bic_commerce: 71,
    bic_services: 50,
    bnc_liberal: 34,
    cipav_liberal: 34,
  },

  // ACRE : réduction de 50% sur les cotisations (12 premiers mois)
  acreReduction: 0.5,
} as const

// Plafonds de CA (seuils micro-entreprise 2025)
export const CA_THRESHOLDS = {
  bic_commerce: 188_700,
  bic_services: 77_700,
  bnc_liberal: 77_700,
  cipav_liberal: 77_700,
} as const

// Seuils TVA franchise en base (2025)
export const TVA_THRESHOLDS = {
  commerce: {
    base: 85_000,
    tolerance: 93_500,
  },
  services: {
    base: 37_500,
    tolerance: 41_250,
  },
} as const

// Taux TVA
export const TVA_RATES = [0, 5.5, 10, 20] as const

// Tranches barème IR 2025 (revenus 2024)
export const IR_TRANCHES = [
  { min: 0, max: 11_294, rate: 0 },
  { min: 11_294, max: 28_797, rate: 11 },
  { min: 28_797, max: 82_341, rate: 30 },
  { min: 82_341, max: 177_106, rate: 41 },
  { min: 177_106, max: Infinity, rate: 45 },
] as const

export function getTvaThreshold(activityType: ActivityType) {
  if (activityType === "bic_commerce") {
    return TVA_THRESHOLDS.commerce
  }
  return TVA_THRESHOLDS.services
}

export function getCfpRate(activityType: ActivityType): number {
  if (activityType === "bic_commerce") return TAX_RATES.cfp.bic_commerce
  if (activityType === "bic_services") return TAX_RATES.cfp.bic_services_artisan
  return TAX_RATES.cfp.bnc_liberal
}
