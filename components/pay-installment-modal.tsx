"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Transaction {
  id: string
  date: string
  type: string
  amount: number
  description: string
}

interface PayInstallmentModalProps {
  installment: Transaction
  onSubmit: (paymentData: {
    installmentId: string
    amount: number
    date: string
    description: string
  }) => void
  onCancel: () => void
}

export function PayInstallmentModal({ installment, onSubmit, onCancel }: PayInstallmentModalProps) {
  const [amount, setAmount] = useState(installment.amount.toString())
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState(
    `Pago de ${installment.description.toLowerCase().replace("(programada)", "").trim()}`,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!amount) {
      newErrors.amount = "El monto es obligatorio"
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "El monto debe ser un número positivo"
    }

    if (!date) {
      newErrors.date = "La fecha es obligatoria"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Asegurarnos de que todos los datos estén correctos
    const paymentData = {
      installmentId: installment.id,
      amount: Number(amount),
      date: new Date(date).toISOString(),
      description: description || `Pago de ${installment.description.toLowerCase().replace("(programada)", "").trim()}`,
    }

    onSubmit(paymentData)
  }

  // Extraer el número de cuota del texto (ej: "Cuota 1/3 (Programada)")
  const getInstallmentNumber = () => {
    const match = installment.description.match(/Cuota (\d+)\/(\d+)/)
    if (match && match[1] && match[2]) {
      return {
        current: Number.parseInt(match[1]),
        total: Number.parseInt(match[2]),
      }
    }
    return { current: 0, total: 0 }
  }

  const { current, total } = getInstallmentNumber()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Registrar Pago de Cuota</h2>
          <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs font-medium border border-blue-500/30">
            Cuota {current}/{total}
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30 mb-5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-300">Monto de la cuota:</p>
            <p className="text-sm font-medium text-blue-400">{formatCurrency(installment.amount)}</p>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="h-3 w-3 mr-1.5 text-gray-500" />
            <span>Fecha programada: {new Date(installment.date).toLocaleDateString("es-CL")}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-gray-300">
              Monto a pagar
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setErrors({ ...errors, amount: "" })
              }}
              className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
            />
            {errors.amount && <p className="text-xs text-red-400">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm text-gray-300">
              Fecha de pago
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setErrors({ ...errors, date: "" })
                }}
                className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20 w-full"
              />
            </div>
            {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-gray-300">
              Descripción (opcional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800/70 border-gray-700/50 text-white min-h-[80px] focus:border-blue-500/50 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="text-gray-400 hover:text-white hover:bg-gray-800/70"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg shadow-green-900/20"
            >
              <Check className="h-4 w-4 mr-2" />
              Registrar Pago
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
