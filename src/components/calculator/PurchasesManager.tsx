import { useState } from "react"
import { Purchase, TvaRate } from "@/types"
import { TVA_RATES } from "@/lib/tax-rates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { PlusCircle, Trash2, ShoppingCart } from "lucide-react"

interface PurchasesManagerProps {
  purchases: Purchase[]
  onAdd: (purchase: Purchase) => void
  onRemove: (id: string) => void
}

const TVA_LABELS: Record<TvaRate, string> = {
  0: "0% — Exonéré",
  5.5: "5,5% — Taux réduit (alimentaire, livres…)",
  10: "10% — Taux intermédiaire (restauration, travaux…)",
  20: "20% — Taux normal",
}

export function PurchasesManager({
  purchases,
  onAdd,
  onRemove,
}: PurchasesManagerProps) {
  const [description, setDescription] = useState("")
  const [amountHT, setAmountHT] = useState("")
  const [tvaRate, setTvaRate] = useState<TvaRate>(20)

  const handleAdd = () => {
    const amount = parseFloat(amountHT)
    if (!description.trim() || isNaN(amount) || amount <= 0) return

    onAdd({
      id: crypto.randomUUID(),
      description: description.trim(),
      amountHT: amount,
      tvaRate,
    })
    setDescription("")
    setAmountHT("")
    setTvaRate(20)
  }

  const totalHT = purchases.reduce((s, p) => s + p.amountHT, 0)
  const totalTVA = purchases.reduce((s, p) => s + (p.amountHT * p.tvaRate) / 100, 0)
  const totalTTC = totalHT + totalTVA

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <div className="space-y-1">
          <Label htmlFor="purchase-desc">Description de l&apos;achat</Label>
          <Input
            id="purchase-desc"
            placeholder="Ex: Ordinateur portable, logiciel…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="purchase-amount">Montant HT (€)</Label>
            <div className="relative">
              <Input
                id="purchase-amount"
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                value={amountHT}
                onChange={(e) => setAmountHT(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                €
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="tva-rate">Taux TVA</Label>
            <Select
              value={String(tvaRate)}
              onValueChange={(v) => setTvaRate(parseFloat(v) as TvaRate)}
            >
              <SelectTrigger id="tva-rate">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TVA_RATES.map((rate: TvaRate) => (
                  <SelectItem key={rate} value={String(rate)}>
                    {TVA_LABELS[rate]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleAdd}
          variant="outline"
          className="w-full gap-2"
          disabled={!description.trim() || !amountHT || parseFloat(amountHT) <= 0}
        >
          <PlusCircle className="w-4 h-4" />
          Ajouter l&apos;achat
        </Button>
      </div>

      {purchases.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between gap-2 rounded-md border p-3 text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ShoppingCart className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{purchase.description}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatCurrency(purchase.amountHT)} HT + TVA {purchase.tvaRate}%
                      {" = "}
                      <span className="font-medium text-foreground">
                        {formatCurrency(purchase.amountHT * (1 + purchase.tvaRate / 100))} TTC
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(purchase.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          <div className="rounded-md bg-muted/50 p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total HT</span>
              <span className="font-medium">{formatCurrency(totalHT)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total TVA</span>
              <span className="font-medium">{formatCurrency(totalTVA)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-semibold">
              <span>Total TTC</span>
              <span>{formatCurrency(totalTTC)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
