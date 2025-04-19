"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SplitExpenseCard } from "@/components/split-expense-card"
import { SplitExpenseForm } from "@/components/split-expense-form"
import { ArrowLeft, PlusCircle, DollarSign, Users, Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useData } from "@/contexts/data-context"
import type { SplitExpense } from "@/contexts/data-context"

export default function SplitExpensesPage() {
  const router = useRouter()
  const { splitExpenses, addSplitExpense, updateSplitExpense } = useData()
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [editingExpense, setEditingExpense] = useState<SplitExpense | null>(null)

  const handleAddExpense = (expense: Omit<SplitExpense, "id">) => {
    addSplitExpense(expense)
    setShowAddExpense(false)
  }

  const handleEditExpense = (expense: SplitExpense) => {
    setEditingExpense(expense)
  }

  const handleUpdateExpense = (expense: Omit<SplitExpense, "id">) => {
    if (editingExpense) {
      updateSplitExpense({
        ...expense,
        id: editingExpense.id,
      })
      setEditingExpense(null)
    }
  }

  // Calcular estadísticas
  const totalExpenses = splitExpenses.reduce((sum, expense) => sum + expense.totalAmount, 0)

  // Contar participantes únicos (excluyendo gastos individuales)
  const uniqueParticipants = new Set()
  splitExpenses.forEach((expense) => {
    if (!(expense.participants.length === 1 && expense.participants[0].name === "Individual")) {
      expense.participants.forEach((p) => uniqueParticipants.add(p.name))
    }
  })
  const totalParticipants = uniqueParticipants.size

  const totalPending = splitExpenses.reduce(
    (sum, expense) => sum + expense.participants.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0),
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300">
      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="mb-6 text-gray-400 hover:text-white hover:bg-gray-800/50 -ml-2 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm">Volver al Inicio</span>
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Gastos</h1>
            <p className="text-sm text-gray-500 mt-1">Gestiona gastos individuales y compartidos</p>
          </div>
          <Button
            onClick={() => setShowAddExpense(true)}
            className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-900/20"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuevo Gasto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-4 border border-blue-800/20 backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <DollarSign className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Gastos</p>
                <p className="text-lg font-semibold text-white">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
            <p className="text-xs text-blue-400">{splitExpenses.length} gastos registrados</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-4 border border-green-800/20 backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                <Users className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Participantes</p>
                <p className="text-lg font-semibold text-white">{totalParticipants}</p>
              </div>
            </div>
            <p className="text-xs text-green-400">Personas en todos los gastos</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-xl p-4 border border-amber-800/20 backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                <Receipt className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Pendiente de Pago</p>
                <p className="text-lg font-semibold text-white">{formatCurrency(totalPending)}</p>
              </div>
            </div>
            <p className="text-xs text-amber-400">Monto total por cobrar</p>
          </div>
        </div>

        {splitExpenses.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/80 flex items-center justify-center">
              <Receipt className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No hay gastos registrados</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Añade un nuevo gasto para comenzar a gestionar tus finanzas.
            </p>
            <Button
              onClick={() => setShowAddExpense(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nuevo Gasto
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {splitExpenses.map((expense) => (
              <SplitExpenseCard key={expense.id} expense={expense} onEdit={handleEditExpense} />
            ))}
          </div>
        )}
      </div>

      {/* Modal para añadir gasto */}
      {showAddExpense && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddExpense(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-5 w-full max-w-md shadow-xl"
          >
            <h2 className="text-lg font-semibold mb-4 text-white">Nuevo Gasto</h2>
            <SplitExpenseForm onSubmit={handleAddExpense} onCancel={() => setShowAddExpense(false)} />
          </div>
        </div>
      )}

      {/* Modal para editar gasto */}
      {editingExpense && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setEditingExpense(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-5 w-full max-w-md shadow-xl"
          >
            <h2 className="text-lg font-semibold mb-4 text-white">Editar Gasto</h2>
            <SplitExpenseForm
              initialExpense={editingExpense}
              onSubmit={handleUpdateExpense}
              onCancel={() => setEditingExpense(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
