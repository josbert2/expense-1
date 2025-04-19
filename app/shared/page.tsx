"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Link, Plus, Receipt } from "lucide-react"
import { SharedLinksTable } from "@/components/shared-links-table"
import { SharedSplitExpensesTable } from "@/components/shared-split-expenses-table"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SharedLinksPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { sharedLinks, deleteSharedLink, sharedSplitExpenses, deleteSharedSplitExpense } = useData()
  const [activeTab, setActiveTab] = useState<"loans" | "expenses">("loans")

  const handleDeleteSharedLink = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este enlace compartido?")) {
      deleteSharedLink(id)
    }
  }

  const handleDeleteSharedSplitExpense = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este enlace compartido?")) {
      deleteSharedSplitExpense(id)
    }
  }

  // Calcular estadísticas
  const activeLoans = sharedLinks.filter((link) => new Date(link.expiresAt) > new Date()).length
  const activeExpenses = sharedSplitExpenses.filter((link) => new Date(link.expiresAt) > new Date()).length

  const totalLoanViews = sharedLinks.reduce((total, link) => total + link.views, 0)
  const totalExpenseViews = sharedSplitExpenses.reduce((total, link) => total + link.views, 0)

  const expiredLoans = sharedLinks.filter((link) => new Date(link.expiresAt) <= new Date()).length
  const expiredExpenses = sharedSplitExpenses.filter((link) => new Date(link.expiresAt) <= new Date()).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(isAuthenticated ? "/" : "/login")}
          className="mb-6 text-gray-400 hover:text-white hover:bg-gray-800/50 -ml-2 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm">{isAuthenticated ? "Volver al Inicio" : "Iniciar Sesión"}</span>
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Enlaces Compartidos</h1>
            <p className="text-sm text-gray-500 mt-1">Gestiona los enlaces para compartir información</p>
          </div>
          {isAuthenticated && (
            <div className="flex space-x-3">
              <Button
                onClick={() => router.push("/")}
                className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-900/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Enlace de Préstamo
              </Button>
              <Button
                onClick={() => router.push("/split-expenses")}
                className="h-9 px-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white border-0 shadow-lg shadow-green-900/20"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Crear Enlace de Gasto
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-5 border border-blue-800/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Enlaces Activos</h3>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Link className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-white">{activeTab === "loans" ? activeLoans : activeExpenses}</p>
            <p className="text-xs text-blue-400 mt-2">Enlaces que aún no han expirado</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-5 border border-green-800/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Total de Vistas</h3>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xs">👁️</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-white">
              {activeTab === "loans" ? totalLoanViews : totalExpenseViews}
            </p>
            <p className="text-xs text-green-400 mt-2">Veces que se han visto tus enlaces</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-xl p-5 border border-amber-800/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Enlaces Expirados</h3>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-400 text-xs">⏱️</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-white">
              {activeTab === "loans" ? expiredLoans : expiredExpenses}
            </p>
            <p className="text-xs text-amber-400 mt-2">Enlaces que ya han expirado</p>
          </div>
        </div>

        <Tabs
          defaultValue="loans"
          onValueChange={(value) => setActiveTab(value as "loans" | "expenses")}
          className="mb-6"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="loans">Préstamos</TabsTrigger>
            <TabsTrigger value="expenses">Gastos Divididos</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "loans" ? (
          <SharedLinksTable links={sharedLinks} onDelete={handleDeleteSharedLink} />
        ) : (
          <SharedSplitExpensesTable links={sharedSplitExpenses} onDelete={handleDeleteSharedSplitExpense} />
        )}
      </div>
    </div>
  )
}
