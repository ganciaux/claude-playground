import { Calculator } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Calculateur Auto-Entrepreneur
          </h1>
          <p className="text-xs text-muted-foreground">
            Taxes & cotisations 2025 — données URSSAF / service-public.fr
          </p>
        </div>
      </div>
    </header>
  )
}
