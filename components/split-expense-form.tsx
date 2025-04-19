"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, UserPlus, UserMinus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { SplitExpense, SplitExpenseParticipant } from "@/contexts/data-context"

interface SplitExpenseFormProps {
  initialExpense?: SplitExpense
  onSubmit: (expense: Omit<SplitExpense, "id">) => void
  onCancel: () => void
}

export function SplitExpenseForm({ initialExpense, onSubmit, onCancel }: SplitExpenseFormProps) {
  const [title, setTitle] = useState(initialExpense?.title || "")
  const [description, setDescription] = useState(initialExpense?.description || "")
  const [date, setDate] = useState(
    initialExpense?.date
      ? new Date(initialExpense.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  )
  const [totalAmount, setTotalAmount] = useState(initialExpense?.totalAmount.toString() || "")
  const [participants, setParticipants] = useState<Omit<SplitExpenseParticipant, "paid">[]>(
    initialExpense?.participants.map((p) => ({ id: p.id, name: p.name, amount: p.amount })) || [
      { id: Date.now().toString(), name: "", amount: 0 },
    ],
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [divideEqually, setDivideEqually] = useState(!initialExpense)

  // Nuevo estado para el tipo de gasto
  const [expenseType, setExpenseType] = useState<"individual" | "split">(initialExpense ? "split" : "individual")

  // Actualizar los montos cuando cambia el total o se activa la división equitativa
  useEffect(() => {
    if (expenseType === "split" && divideEqually && participants.length > 0 && totalAmount) {
      const amount = Math.floor(Number(totalAmount) / participants.length)
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          amount,
        })),
      )
    }
  }, [divideEqually, totalAmount, participants.length, expenseType])

  const addParticipant = () => {
    setParticipants([
      ...participants,
      {
        id: Date.now().toString(),
        name: "",
        amount: divideEqually && totalAmount ? Math.floor(Number(totalAmount) / (participants.length + 1)) : 0,
      },
    ])

    // Si está activada la división equitativa, recalcular los montos
    if (divideEqually && totalAmount) {
      const newAmount = Math.floor(Number(totalAmount) / (participants.length + 1))
      setParticipants((prev) => [
        ...prev.map((p) => ({ ...p, amount: newAmount })),
        { id: Date.now().toString(), name: "", amount: newAmount },
      ])
    }
  }

  const removeParticipant = (id: string) => {
    if (participants.length <= 1) {
      return
    }

    setParticipants((prev) => prev.filter((p) => p.id !== id))

    // Si está activada la división equitativa, recalcular los montos
    if (divideEqually && totalAmount) {
      const filteredParticipants = participants.filter((p) => p.id !== id)
      const newAmount = Math.floor(Number(totalAmount) / filteredParticipants.length)
      setParticipants(filteredParticipants.map((p) => ({ ...p, amount: newAmount })))
    }
  }

  const updateParticipant = (id: string, field: "name" | "amount", value: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (field === "amount") {
            // Si se está editando manualmente un monto, desactivar la división equitativa
            if (divideEqually) {
              setDivideEqually(false)
            }
            return { ...p, [field]: Number(value) }
          }
          return { ...p, [field]: value }
        }
        return p
      }),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "El título es obligatorio"
    }

    if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
      newErrors.totalAmount = "El monto total debe ser un número positivo"
    }

    if (!date) {
      newErrors.date = "La fecha es obligatoria"
    }

    // Si es un gasto dividido, validar participantes
    if (expenseType === "split") {
      let hasParticipantErrors = false
      const participantErrors: Record<string, { name?: string; amount?: string }> = {}

      participants.forEach((p) => {
        if (!p.name.trim()) {
          participantErrors[p.id] = { ...participantErrors[p.id], name: "El nombre es obligatorio" }
          hasParticipantErrors = true
        }

        if (p.amount <= 0) {
          participantErrors[p.id] = { ...participantErrors[p.id], amount: "El monto debe ser positivo" }
          hasParticipantErrors = true
        }
      })

      if (hasParticipantErrors) {
        newErrors.participants = JSON.stringify(participantErrors)
      }

      // Verificar que la suma de los montos sea igual al total
      const sum = participants.reduce((acc, p) => acc + p.amount, 0)
      if (Math.abs(sum - Number(totalAmount)) > 1) {
        // Permitir una pequeña diferencia por redondeo
        newErrors.sum = `La suma de los montos (${sum}) no coincide con el total (${totalAmount})`
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Si es un gasto individual, crear un solo participante con el monto total
    const finalParticipants =
      expenseType === "individual"
        ? [{ id: Date.now().toString(), name: "Individual", amount: Number(totalAmount), paid: false }]
        : participants.map((p) => ({
            ...p,
            paid: initialExpense?.participants.find((op) => op.id === p.id)?.paid || false,
          }))

    onSubmit({
      title,
      description,
      date: new Date(date).toISOString(),
      totalAmount: Number(totalAmount),
      participants: finalParticipants,
    })
  }

  const getParticipantError = (id: string, field: "name" | "amount") => {
    if (!errors.participants) return ""
    try {
      const participantErrors = JSON.parse(errors.participants)
      return participantErrors[id]?.[field] || ""
    } catch {
      return ""
    }
  }

  const getFrequencyText = () => {
    return "mensual"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm text-gray-300">
          Título
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setErrors({ ...errors, title: "" })
          }}
          placeholder="Ej: Cena en restaurante"
          className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
        />
        {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm text-gray-300">
          Descripción (opcional)
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Añade detalles sobre este gasto"
          className="bg-gray-800/70 border-gray-700/50 text-white min-h-[80px] focus:border-blue-500/50 focus:ring-blue-500/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            }}
            className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
          />
          {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalAmount" className="text-sm text-gray-300">
            Monto Total
          </Label>
          <Input
            id="totalAmount"
            type="number"
            value={totalAmount}
            onChange={(e) => {
              setTotalAmount(e.target.value)
              setErrors({ ...errors, totalAmount: "" })
            }}
            placeholder="0.00"
            className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
          />
          {errors.totalAmount && <p className="text-xs text-red-400">{errors.totalAmount}</p>}
        </div>
      </div>

      {/* Selector de tipo de gasto */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Tipo de Gasto</Label>
        <RadioGroup
          value={expenseType}
          onValueChange={(value) => setExpenseType(value as "individual" | "split")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual" className="text-sm text-gray-300 cursor-pointer">
              Gasto Individual
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="split" id="split" />
            <Label htmlFor="split" className="text-sm text-gray-300 cursor-pointer">
              Gasto Dividido
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sección de participantes (solo visible si es gasto dividido) */}
      {expenseType === "split" && (
        <>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-300 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Participantes
            </Label>
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-400 flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={divideEqually}
                  onChange={(e) => setDivideEqually(e.target.checked)}
                  className="mr-2 h-3 w-3"
                />
                Dividir equitativamente
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addParticipant}
                className="h-7 px-2 bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Añadir
              </Button>
            </div>
          </div>

          {errors.sum && (
            <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-md border border-red-500/20">{errors.sum}</p>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="grid grid-cols-[1fr,auto,auto] gap-2 items-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/30"
              >
                <div>
                  <Input
                    value={participant.name}
                    onChange={(e) => updateParticipant(participant.id, "name", e.target.value)}
                    placeholder="Nombre"
                    className="h-9 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                  {getParticipantError(participant.id, "name") && (
                    <p className="text-xs text-red-400 mt-1">{getParticipantError(participant.id, "name")}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="number"
                    value={participant.amount}
                    onChange={(e) => updateParticipant(participant.id, "amount", e.target.value)}
                    placeholder="Monto"
                    disabled={divideEqually}
                    className="h-9 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20 w-24"
                  />
                  {getParticipantError(participant.id, "amount") && (
                    <p className="text-xs text-red-400 mt-1">{getParticipantError(participant.id, "amount")}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParticipant(participant.id)}
                  disabled={participants.length <= 1}
                  className="h-9 w-9 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </>
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
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-900/20"
        >
          {initialExpense ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  )
}
