"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Trash2, Edit, Check, Users, User, Share2 } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { ShareSplitExpenseModal } from "./share-split-expense-modal"
import type { SplitExpense } from "@/contexts/data-context"

interface SplitExpenseCardProps {
  expense: SplitExpense
  onEdit: (expense: SplitExpense) => void
}

export function SplitExpenseCard({ expense, onEdit }: SplitExpenseCardProps) {
  const { deleteSplitExpense, updateParticipantPaymentStatus } = useData()
  const [expanded, setExpanded] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar el gasto "${expense.title}"?`)) {
      deleteSplitExpense(expense.id)
    }
  }

  const handleTogglePayment = (participantId: string, currentStatus: boolean) => {
    updateParticipantPaymentStatus(expense.id, participantId, !currentStatus)
  }

  const totalPaid = expense.participants.reduce((sum, p) => sum + (p.paid ? p.amount : 0), 0)
  const percentPaid = Math.round((totalPaid / expense.totalAmount) * 100)
  const paidParticipants = expense.participants.filter((p) => p.paid).length
  const totalParticipants = expense.participants.length

  // Verificar si es un gasto individual (un solo participante con nombre "Individual")
  const isIndividualExpense = expense.participants.length === 1 && expense.participants[0].name === "Individual"

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-5 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-semibold text-white">{expense.title}</h3>
          <p className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString("es-CL")}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowShareModal(true)}
            className="h-8 w-8 p-0 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(expense)}
            className="h-8 w-8 p-0 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-white font-medium">{formatCurrency(expense.totalAmount)}</p>
            <div className="flex items-center text-xs text-gray-400">
              {isIndividualExpense ? <User className="h-3 w-3 mr-1" /> : <Users className="h-3 w-3 mr-1" />}
              <span>{isIndividualExpense ? "Gasto individual" : `${expense.participants.length} personas`}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white font-medium">{percentPaid}% pagado</p>
            {!isIndividualExpense && (
              <p className="text-xs text-gray-400">
                {paidParticipants} de {totalParticipants} han pagado
              </p>
            )}
          </div>
        </div>

        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${percentPaid}%` }}></div>
        </div>

        {expense.description && <p className="text-sm text-gray-300 mt-2">{expense.description}</p>}

        {!isIndividualExpense && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {expanded ? "Ocultar participantes" : "Ver participantes"}
          </Button>
        )}

        {expanded && !isIndividualExpense && (
          <div className="space-y-2 mt-3">
            {expense.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex justify-between items-center bg-gray-800/50 rounded-lg p-2 border border-gray-700/30"
              >
                <div>
                  <p className="text-sm font-medium text-white">{participant.name}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(participant.amount)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTogglePayment(participant.id, participant.paid)}
                  className={`h-8 w-8 p-0 rounded-full ${
                    participant.paid
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {participant.paid && <Check className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para compartir */}
      {showShareModal && <ShareSplitExpenseModal expense={expense} onClose={() => setShowShareModal(false)} />}
    </div>
  )
}
