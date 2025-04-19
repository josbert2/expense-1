"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowDown, ArrowUp, Calendar, Calculator } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Transaction {
  id: string
  personId: string
  type: "Préstamo" | "Pago"
  amount: number
  description: string
  date: string
}

interface AddTransactionFormProps {
  personId: string
  onSubmit: (transaction: Omit<Transaction, "id">) => void
  onCancel: () => void
}

export function AddTransactionForm({ personId, onSubmit, onCancel }: AddTransactionFormProps) {
  const [type, setType] = useState<"Préstamo" | "Pago">("Préstamo")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProgrammed, setIsProgrammed] = useState(false)

  // Nuevos estados para cuotas
  const [enableInstallments, setEnableInstallments] = useState(false)
  const [installments, setInstallments] = useState("3")
  const [installmentFrequency, setInstallmentFrequency] = useState("monthly")
  const [installmentAmount, setInstallmentAmount] = useState("")
  const [showInstallmentPreview, setShowInstallmentPreview] = useState(false)
  const [installmentDates, setInstallmentDates] = useState<string[]>([])

  // Calcular el monto de cada cuota cuando cambia el monto total o el número de cuotas
  useEffect(() => {
    if (
      enableInstallments &&
      amount &&
      !isNaN(Number(amount)) &&
      Number(amount) > 0 &&
      installments &&
      !isNaN(Number(installments)) &&
      Number(installments) > 0
    ) {
      const installmentAmountValue = Math.ceil(Number(amount) / Number(installments))
      setInstallmentAmount(installmentAmountValue.toString())

      // Calcular fechas de cuotas
      const dates: string[] = []
      const startDate = new Date(date)

      for (let i = 0; i < Number(installments); i++) {
        const installmentDate = new Date(startDate)

        if (installmentFrequency === "weekly") {
          installmentDate.setDate(startDate.getDate() + i * 7)
        } else if (installmentFrequency === "biweekly") {
          installmentDate.setDate(startDate.getDate() + i * 14)
        } else {
          // monthly
          installmentDate.setMonth(startDate.getMonth() + i)
        }

        dates.push(installmentDate.toISOString().split("T")[0])
      }

      setInstallmentDates(dates)
    }
  }, [enableInstallments, amount, installments, installmentFrequency, date])

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

    if (enableInstallments && (!installments || isNaN(Number(installments)) || Number(installments) <= 0)) {
      newErrors.installments = "El número de cuotas debe ser un número positivo"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    let finalDescription = description
    if (isProgrammed && type === "Pago") {
      finalDescription = description ? `${description} (Programada)` : "Pago programado"
    }

    // Si está habilitado el pago en cuotas y es un préstamo, crear múltiples transacciones de pago programadas
    if (enableInstallments && type === "Préstamo") {
      // Primero, enviar la transacción del préstamo
      const loanDescription = description
        ? `${description} (Préstamo en ${installments} cuotas de ${installmentAmount})`
        : `Préstamo en ${installments} cuotas de ${installmentAmount}`

      onSubmit({
        personId,
        type,
        amount: Number(amount),
        description: loanDescription,
        date: new Date(date).toISOString(),
      })

      // Luego, crear las transacciones de pago programadas
      installmentDates.forEach((installmentDate, index) => {
        const paymentDescription = `Cuota ${index + 1}/${installments} (Programada)`

        onSubmit({
          personId,
          type: "Pago",
          amount: Number(installmentAmount),
          description: paymentDescription,
          date: new Date(installmentDate).toISOString(),
        })
      })
    } else {
      // Comportamiento normal para transacciones sin cuotas
      onSubmit({
        personId,
        type,
        amount: Number(amount),
        description: finalDescription,
        date: new Date(date).toISOString(),
      })
    }
  }

  const getFrequencyText = () => {
    switch (installmentFrequency) {
      case "weekly":
        return "semanal"
      case "biweekly":
        return "quincenal"
      case "monthly":
        return "mensual"
      default:
        return "mensual"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3">
        <Label className="text-sm text-gray-300">Tipo de Movimiento</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={type === "Préstamo" ? "default" : "outline"}
            onClick={() => setType("Préstamo")}
            className={`flex items-center justify-center h-16 ${
              type === "Préstamo"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 shadow-lg shadow-blue-900/20"
                : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <div className="flex flex-col items-center">
              <ArrowDown className={`h-5 w-5 mb-1 ${type === "Préstamo" ? "text-white" : "text-blue-400"}`} />
              <span>Préstamo</span>
            </div>
          </Button>
          <Button
            type="button"
            variant={type === "Pago" ? "default" : "outline"}
            onClick={() => setType("Pago")}
            className={`flex items-center justify-center h-16 ${
              type === "Pago"
                ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white border-0 shadow-lg shadow-green-900/20"
                : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <div className="flex flex-col items-center">
              <ArrowUp className={`h-5 w-5 mb-1 ${type === "Pago" ? "text-white" : "text-green-400"}`} />
              <span>Pago</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm text-gray-300">
          Monto
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setErrors({ ...errors, amount: "" })
          }}
          placeholder="0.00"
          className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
        />
        {errors.amount && <p className="text-xs text-red-400">{errors.amount}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm text-gray-300">
          Descripción
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del movimiento"
          className="bg-gray-800/70 border-gray-700/50 text-white min-h-[80px] focus:border-blue-500/50 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm text-gray-300">
          Fecha
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setErrors({ ...errors, date: "" })

            // Verificar si la fecha es futura
            const selectedDate = new Date(e.target.value)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            setIsProgrammed(selectedDate > today)
          }}
          className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
        />
        {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}

        {isProgrammed && type === "Pago" && (
          <p className="text-xs text-amber-400 flex items-center mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
            Este pago quedará registrado como programado
          </p>
        )}
      </div>

      {/* Sección de cuotas (solo para préstamos) */}
      {type === "Préstamo" && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="h-4 w-4 text-blue-400" />
              <Label className="text-sm text-gray-300">Dividir en cuotas</Label>
            </div>
            <Switch checked={enableInstallments} onCheckedChange={setEnableInstallments} />
          </div>

          {enableInstallments && (
            <div className="space-y-4 bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="installments" className="text-sm text-gray-300">
                    Número de cuotas
                  </Label>
                  <Input
                    id="installments"
                    type="number"
                    min="1"
                    value={installments}
                    onChange={(e) => {
                      setInstallments(e.target.value)
                      setErrors({ ...errors, installments: "" })
                    }}
                    className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                  {errors.installments && <p className="text-xs text-red-400">{errors.installments}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installmentFrequency" className="text-sm text-gray-300">
                    Frecuencia
                  </Label>
                  <select
                    id="installmentFrequency"
                    value={installmentFrequency}
                    onChange={(e) => setInstallmentFrequency(e.target.value)}
                    className="w-full h-10 text-sm bg-gray-800/70 border border-gray-700/50 text-white rounded-md focus:border-blue-500/50 focus:ring-blue-500/20"
                  >
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quincenal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>
              </div>

              {amount &&
                installments &&
                !isNaN(Number(amount)) &&
                !isNaN(Number(installments)) &&
                Number(installments) > 0 && (
                  <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-white">Monto por cuota:</p>
                      <p className="text-sm font-medium text-blue-400">
                        {new Intl.NumberFormat("es-CL", {
                          style: "currency",
                          currency: "CLP",
                          minimumFractionDigits: 0,
                        }).format(Number(installmentAmount))}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Number(installments)} cuotas con frecuencia {getFrequencyText()}
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInstallmentPreview(!showInstallmentPreview)}
                      className="w-full mt-2 text-xs text-blue-400 hover:text-white hover:bg-blue-900/30"
                    >
                      {showInstallmentPreview ? "Ocultar calendario de pagos" : "Ver calendario de pagos"}
                    </Button>

                    {showInstallmentPreview && installmentDates.length > 0 && (
                      <div className="mt-2 space-y-1 max-h-40 overflow-y-auto pr-1">
                        {installmentDates.map((installmentDate, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-xs p-2 bg-gray-800/50 rounded"
                          >
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1.5 text-gray-500" />
                              <span className="text-gray-300">Cuota {index + 1}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-gray-400">{formatDate(installmentDate)}</span>
                              <span className="text-blue-400">
                                {new Intl.NumberFormat("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                  minimumFractionDigits: 0,
                                }).format(Number(installmentAmount))}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-2">
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
          className={`${
            type === "Préstamo"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          } text-white border-0 shadow-lg shadow-blue-900/20`}
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}
