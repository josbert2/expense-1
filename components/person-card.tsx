"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowUpRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useData } from "@/contexts/data-context"

interface Person {
  id: string
  name: string
  totalLoaned: number
  totalPaid: number
  balance: number
  status: string
}

interface PersonCardProps {
  person: Person
}

export function PersonCard({ person }: PersonCardProps) {
  const router = useRouter()
  const { deletePerson } = useData()

  const handleDeletePerson = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (confirm(`¿Estás seguro de eliminar a ${person.name}?`)) {
      deletePerson(person.id)
    }
  }

  const getStatusColor = () => {
    if (person.status === "Pagado") return "text-green-400"
    if (person.balance < 0) return "text-blue-400"
    return "text-amber-400"
  }

  const getStatusText = () => {
    if (person.status === "Pagado") return "Pagado"
    if (person.balance < 0) return "Sobrepago"
    return "Pendiente"
  }

  const getProgressPercent = () => {
    if (person.totalLoaned === 0) return 0
    return Math.min(100, Math.round((person.totalPaid / person.totalLoaned) * 100))
  }

  return (
    <div
      className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 border border-gray-700/50 rounded-xl p-5 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl group"
      onClick={() => router.push(`/${person.id}`)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-medium text-sm mr-3">
            {person.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
              {person.name}
            </h3>
            <span className={`text-xs font-medium ${getStatusColor()}`}>{getStatusText()}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDeletePerson}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-800/50 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Prestado</p>
            <p className="text-sm font-medium text-blue-400">{formatCurrency(person.totalLoaned)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Pagado</p>
            <p className="text-sm font-medium text-green-400">{formatCurrency(person.totalPaid)}</p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-2">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-gray-500">Saldo</p>
            <p className={`text-xs font-medium ${person.balance > 0 ? "text-amber-400" : "text-green-400"}`}>
              {getProgressPercent()}% completado
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className={`text-sm font-medium ${person.balance > 0 ? "text-amber-400" : "text-green-400"}`}>
              {formatCurrency(Math.abs(person.balance))}
            </p>
            <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${person.status === "Pagado" ? "bg-green-500" : "bg-blue-500"}`}
                style={{ width: `${getProgressPercent()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Ver detalles
          <ArrowUpRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  )
}
