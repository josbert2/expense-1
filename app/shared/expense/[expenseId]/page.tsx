"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Lock, ShieldAlert, Users, Check, Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"

interface SplitExpenseParticipant {
  id: string
  name: string
  amount: number
  paid: boolean
}

interface SplitExpense {
  id: string
  title: string
  description: string
  date: string
  totalAmount: number
  participants: SplitExpenseParticipant[]
}

export default function SharedExpensePage({ params }: { params: { expenseId: string } }) {
  const router = useRouter()
  const expenseId = params.expenseId
  const { isAuthenticated } = useAuth()
  const { splitExpenses, sharedSplitExpenses, incrementSplitExpenseLinkViews } = useData()

  const [isLoading, setIsLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [expense, setExpense] = useState<SplitExpense | null>(null)
  const [includeDetails, setIncludeDetails] = useState(false)
  const [includeParticipants, setIncludeParticipants] = useState(false)

  useEffect(() => {
    // Simulamos la obtención de parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search)
    const expenseIdParam = urlParams.get("eid") || ""
    const expiryTimestamp = urlParams.get("exp") || "0"
    const includeDetailsParam = urlParams.get("det") === "1"
    const includeParticipantsParam = urlParams.get("part") === "1"

    // Verificar si el enlace ha expirado
    const expiryDate = new Date(Number.parseInt(expiryTimestamp))
    const isLinkExpired = expiryDate < new Date()
    setIsExpired(isLinkExpired)

    if (!isLinkExpired) {
      // Simulamos que algunos enlaces están protegidos con contraseña
      const isProtected = expenseId.startsWith("abc")
      setIsPasswordProtected(isProtected)

      // Configurar opciones de visualización
      setIncludeDetails(includeDetailsParam)
      setIncludeParticipants(includeParticipantsParam)

      // Buscar el gasto en el contexto global
      const foundExpense = splitExpenses.find((e) => e.id === expenseIdParam)

      if (foundExpense) {
        setExpense(foundExpense)
      }

      // Incrementar vistas del enlace
      const link = sharedSplitExpenses.find((link) => link.id === expenseId || link.url.includes(expenseId))
      if (link) {
        incrementSplitExpenseLinkViews(link.id)
      }
    }

    setIsLoading(false)
  }, [expenseId, splitExpenses, sharedSplitExpenses, incrementSplitExpenseLinkViews])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // En una implementación real, verificaríamos la contraseña con una API
    // Por ahora, simulamos la verificación
    if (password === "1234") {
      setIsPasswordProtected(false)
    } else {
      setIsPasswordError(true)
    }
  }

  const handleClose = () => {
    if (isAuthenticated) {
      router.push("/split-expenses")
    } else {
      window.close()
      // Si window.close() no funciona (por políticas del navegador), redirigir a la página compartida
      setTimeout(() => {
        router.push("/shared")
      }, 300)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Cargando información compartida...</p>
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300 p-4">
        <div className="bg-gray-900/70 border border-gray-800/50 rounded-xl p-8 max-w-md text-center backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Enlace Expirado</h2>
          <p className="text-gray-400 mb-6">
            Este enlace ha expirado y ya no está disponible. Por favor, solicita un nuevo enlace para acceder a esta
            información.
          </p>
          <Button
            onClick={() => router.push("/shared")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Volver
          </Button>
        </div>
      </div>
    )
  }

  if (isPasswordProtected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300 p-4">
        <div className="bg-gray-900/70 border border-gray-800/50 rounded-xl p-8 max-w-md backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Lock className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2 text-center">Contenido Protegido</h2>
          <p className="text-gray-400 mb-6 text-center">
            Este contenido está protegido con contraseña. Introduce la contraseña para acceder.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setIsPasswordError(false)
                }}
                placeholder="Contraseña"
                className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
              />
              {isPasswordError && (
                <p className="text-xs text-red-400 mt-1">Contraseña incorrecta. Inténtalo de nuevo.</p>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/shared")}
                className="text-gray-400 hover:text-white hover:bg-gray-800/70"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Acceder
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (!expense) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300 p-4">
        <div className="bg-gray-900/70 border border-gray-800/50 rounded-xl p-8 max-w-md text-center backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Información no encontrada</h2>
          <p className="text-gray-400 mb-6">
            No se pudo encontrar la información solicitada. Es posible que el enlace sea inválido o que los datos hayan
            sido eliminados.
          </p>
          <Button
            onClick={() => router.push("/shared")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Volver
          </Button>
        </div>
      </div>
    )
  }

  // Calcular estadísticas del gasto
  const totalPaid = expense.participants.reduce((sum, p) => sum + (p.paid ? p.amount : 0), 0)
  const percentPaid = Math.round((totalPaid / expense.totalAmount) * 100)
  const paidParticipants = expense.participants.filter((p) => p.paid).length
  const totalParticipants = expense.participants.length

  // Verificar si es un gasto individual (un solo participante con nombre "Individual")
  const isIndividualExpense = expense.participants.length === 1 && expense.participants[0].name === "Individual"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Información de Gasto Compartido</h1>
            <p className="text-sm text-gray-500 mt-1">Información compartida de forma segura</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Volver</span>
          </Button>
        </div>

        <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-600 flex items-center justify-center text-white font-medium text-base mr-4">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{expense.title}</h2>
              <span className="text-xs font-medium text-blue-400">
                {new Date(expense.date).toLocaleDateString("es-CL")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-4 border border-blue-800/20 backdrop-blur-sm">
              <p className="text-xs text-gray-400 mb-1">Monto Total</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(expense.totalAmount)}</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-4 border border-green-800/20 backdrop-blur-sm">
              <p className="text-xs text-gray-400 mb-1">Monto Pagado</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(totalPaid)}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-xl p-4 border border-amber-800/20 backdrop-blur-sm">
              <p className="text-xs text-gray-400 mb-1">Monto Pendiente</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(expense.totalAmount - totalPaid)}</p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500">Progreso de pago</p>
              <p className="text-xs font-medium text-blue-400">{percentPaid}%</p>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                style={{ width: `${percentPaid}%` }}
              ></div>
            </div>
          </div>
        </div>

        {includeDetails && expense.description && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm p-6 mb-6">
            <h3 className="text-base font-medium text-white mb-4">Descripción</h3>
            <p className="text-sm text-gray-300">{expense.description}</p>
          </div>
        )}

        {includeParticipants && !isIndividualExpense && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium text-white">Participantes</h3>
              <div className="flex items-center text-xs text-gray-400">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                <span>
                  {paidParticipants} de {totalParticipants} han pagado
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {expense.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/30"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{participant.name}</p>
                    <p className="text-xs text-gray-400">{formatCurrency(participant.amount)}</p>
                  </div>
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      participant.paid ? "bg-green-500/20 text-green-400" : "bg-gray-700/50 text-gray-500"
                    }`}
                  >
                    {participant.paid && <Check className="h-4 w-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm p-6 text-center">
          <p className="text-sm text-gray-400">
            Este enlace fue compartido de forma segura a través del Sistema de Gestión de Préstamos.
          </p>
          <p className="text-xs text-gray-500 mt-2">Fecha de visualización: {new Date().toLocaleDateString("es-CL")}</p>
        </div>
      </div>
    </div>
  )
}
