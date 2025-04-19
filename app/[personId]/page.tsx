"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TransactionTable } from "@/components/transaction-table"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { ShareModal } from "@/components/share-modal"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PlusCircle, Calendar, DollarSign, CreditCard, Share2, Code, Copy, Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useData } from "@/contexts/data-context"

export default function PersonDetail({ params }: { params: any }) {
  // Usar React.use para desenvolver el objeto params
  const unwrappedParams = React.use(params)
  const personId = unwrappedParams.personId

  const router = useRouter()
  const {
    people,
    getTransactions,
    addTransaction: addGlobalTransaction,
    deleteTransaction: deleteGlobalTransaction,
  } = useData()

  const [person, setPerson] = useState(people.find((p) => p.id === personId) || null)
  const [transactions, setTransactions] = useState(getTransactions(personId))
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const [jsonCopied, setJsonCopied] = useState(false)

  // Actualizar datos cuando cambian en el contexto global
  useEffect(() => {
    setPerson(people.find((p) => p.id === personId) || null)
    setTransactions(getTransactions(personId))
  }, [people, getTransactions, personId])

  // Actualizar transacciones cuando se añade o elimina una
  useEffect(() => {
    const updatedTransactions = getTransactions(personId)
    setTransactions(updatedTransactions)
  }, [getTransactions, personId])

  const addTransaction = (transaction) => {
    try {
      addGlobalTransaction({
        ...transaction,
        personId,
      })
      setShowAddTransaction(false)
    } catch (error) {
      console.error("Error al agregar transacción:", error)
    }
  }

  const deleteTransaction = (id) => {
    try {
      deleteGlobalTransaction(personId, id)
    } catch (error) {
      console.error("Error al eliminar transacción:", error)
    }
  }

  const handlePayInstallment = (paymentData) => {
    try {
      console.log("Procesando pago de cuota:", paymentData)

      // Primero, encontrar la cuota programada
      const installment = transactions.find((t) => t.id === paymentData.installmentId)

      if (installment) {
        console.log("Cuota encontrada:", installment)

        // Crear una nueva transacción de pago con un ID único
        const paymentTransaction = {
          personId,
          type: "Pago",
          amount: paymentData.amount,
          description:
            paymentData.description ||
            `Pago de ${installment.description.toLowerCase().replace("(programada)", "").trim()}`,
          date: paymentData.date,
          id: Date.now().toString(), // Asegurar un ID único
        }

        console.log("Nueva transacción de pago:", paymentTransaction)

        // Añadir la transacción de pago
        addGlobalTransaction(paymentTransaction)

        // Eliminar la cuota programada original
        deleteGlobalTransaction(personId, paymentData.installmentId)

        console.log("Pago procesado correctamente")
      } else {
        console.error("No se encontró la cuota con ID:", paymentData.installmentId)
      }
    } catch (error) {
      console.error("Error al pagar cuota:", error)
    }
  }

  const handleCopyJson = () => {
    const jsonData = JSON.stringify(transactions, null, 2)
    navigator.clipboard.writeText(jsonData)
    setJsonCopied(true)
    setTimeout(() => setJsonCopied(false), 2000)
  }

  // Calcular próximos pagos programados
  const upcomingPayments = transactions
    .filter(
      (t) => t.type === "Pago" && t.description.toLowerCase().includes("programada") && new Date(t.date) > new Date(),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  // Calcular estadísticas de cuotas
  const installmentStats = (() => {
    const loanWithInstallments = transactions.filter(
      (t) => t.type === "Préstamo" && t.description.toLowerCase().includes("cuotas"),
    )

    const installmentPayments = transactions.filter(
      (t) => t.type === "Pago" && t.description.toLowerCase().includes("cuota"),
    )

    const totalInstallments = installmentPayments.length
    const paidInstallments = installmentPayments.filter(
      (t) => !t.description.toLowerCase().includes("programada"),
    ).length
    const pendingInstallments = installmentPayments.filter((t) =>
      t.description.toLowerCase().includes("programada"),
    ).length

    const totalInstallmentAmount = installmentPayments.reduce((sum, t) => sum + t.amount, 0)
    const paidInstallmentAmount = installmentPayments
      .filter((t) => !t.description.toLowerCase().includes("programada"))
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      hasInstallments: loanWithInstallments.length > 0,
      totalInstallments,
      paidInstallments,
      pendingInstallments,
      totalInstallmentAmount,
      paidInstallmentAmount,
      percentPaid: totalInstallmentAmount > 0 ? Math.round((paidInstallmentAmount / totalInstallmentAmount) * 100) : 0,
    }
  })()

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    )
  }

  const getProgressPercent = () => {
    if (person.totalLoaned === 0) return 0
    return Math.min(100, Math.round((person.totalPaid / person.totalLoaned) * 100))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800/50 bg-gray-950/50 backdrop-blur-sm p-5">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="mb-4 text-gray-400 hover:text-white hover:bg-gray-800/50 -ml-2 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Volver</span>
            </Button>

            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-medium text-base mr-3">
                {person.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">{person.name}</h1>
                <span className={`text-xs font-medium ${person.balance > 0 ? "text-amber-400" : "text-green-400"}`}>
                  {person.balance > 0 ? "Pendiente" : "Pagado"}
                </span>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500">Progreso de pago</p>
                <p className="text-xs font-medium text-blue-400">{getProgressPercent()}%</p>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${person.status === "Pagado" ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-blue-600 to-blue-400"}`}
                  style={{ width: `${getProgressPercent()}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Prestado</p>
                  <p className="text-sm font-medium text-blue-400">{formatCurrency(person.totalLoaned)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pagado</p>
                  <p className="text-sm font-medium text-green-400">{formatCurrency(person.totalPaid)}</p>
                </div>
              </div>
            </div>
          </div>

          {upcomingPayments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white mb-3">Próximos Pagos</h3>
              <div className="space-y-2">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-white">{payment.description}</p>
                      <p className="text-xs text-green-400">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(payment.date).toLocaleDateString("es-CL")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estadísticas de cuotas */}
          {installmentStats.hasInstallments && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white mb-3">Cuotas</h3>
              <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500">Progreso de cuotas</p>
                  <p className="text-xs font-medium text-blue-400">{installmentStats.percentPaid}%</p>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    style={{ width: `${installmentStats.percentPaid}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-800/50 rounded p-2">
                    <p className="text-gray-400">Pagadas</p>
                    <p className="text-green-400 font-medium">{installmentStats.paidInstallments} cuotas</p>
                  </div>
                  <div className="bg-gray-800/50 rounded p-2">
                    <p className="text-gray-400">Pendientes</p>
                    <p className="text-amber-400 font-medium">{installmentStats.pendingInstallments} cuotas</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => setShowAddTransaction(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-900/20"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar Movimiento
            </Button>

            <Button
              onClick={() => setShowShareModal(true)}
              variant="outline"
              className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>

            <Button
              onClick={() => setShowJson(!showJson)}
              variant="outline"
              className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Code className="h-4 w-4 mr-2" />
              {showJson ? "Ocultar JSON" : "Mostrar JSON"}
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">Movimientos</h2>
              <p className="text-sm text-gray-500">Historial de préstamos y pagos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-4 border border-blue-800/20 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Saldo Pendiente</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(Math.abs(person.balance))}</p>
                  </div>
                </div>
                <p className="text-xs text-blue-400">
                  {person.balance > 0
                    ? `Falta por pagar ${formatCurrency(person.balance)}`
                    : person.balance < 0
                      ? `Sobrepago de ${formatCurrency(Math.abs(person.balance))}`
                      : "Préstamo completamente pagado"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-4 border border-green-800/20 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <CreditCard className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Último Pago</p>
                    <p className="text-lg font-semibold text-white">
                      {transactions.filter((t) => t.type === "Pago").length > 0
                        ? formatCurrency(
                            transactions
                              .filter((t) => t.type === "Pago" && new Date(t.date) <= new Date())
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.amount || 0,
                          )
                        : "Sin pagos"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-green-400">
                  {transactions.filter((t) => t.type === "Pago").length > 0
                    ? `Realizado el ${new Date(
                        transactions
                          .filter((t) => t.type === "Pago" && new Date(t.date) <= new Date())
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date,
                      ).toLocaleDateString("es-CL")}`
                    : "No hay pagos registrados"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-xl p-4 border border-amber-800/20 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Próximo Pago</p>
                    <p className="text-lg font-semibold text-white">
                      {upcomingPayments.length > 0
                        ? formatCurrency(upcomingPayments[0].amount)
                        : "Sin pagos programados"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-amber-400">
                  {upcomingPayments.length > 0
                    ? `Programado para el ${new Date(upcomingPayments[0].date).toLocaleDateString("es-CL")}`
                    : "No hay pagos programados"}
                </p>
              </div>
            </div>

            {/* Estadísticas de cuotas para pantallas grandes */}
            {installmentStats.hasInstallments && (
              <div className="mb-6 bg-gradient-to-br from-blue-900/10 to-blue-800/5 rounded-xl p-4 border border-blue-800/20 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Receipt className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-white">Préstamo en Cuotas</p>
                    <p className="text-xs text-gray-400">
                      {installmentStats.paidInstallments} de {installmentStats.totalInstallments} cuotas pagadas
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500">Progreso de cuotas</p>
                  <p className="text-xs font-medium text-blue-400">{installmentStats.percentPaid}%</p>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    style={{ width: `${installmentStats.percentPaid}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Total Cuotas</p>
                    <p className="text-sm font-medium text-white">{installmentStats.totalInstallments} cuotas</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Cuotas Pagadas</p>
                    <p className="text-sm font-medium text-green-400">{installmentStats.paidInstallments} cuotas</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Cuotas Pendientes</p>
                    <p className="text-sm font-medium text-amber-400">{installmentStats.pendingInstallments} cuotas</p>
                  </div>
                </div>
              </div>
            )}

            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/80 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No hay movimientos registrados</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Agrega un préstamo o pago para comenzar a registrar los movimientos.
                </p>
                <Button
                  onClick={() => setShowAddTransaction(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Agregar Movimiento
                </Button>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm overflow-hidden mb-6">
                <TransactionTable
                  transactions={transactions}
                  onDelete={deleteTransaction}
                  onPayInstallment={handlePayInstallment}
                />
              </div>
            )}

            {/* Sección para mostrar el JSON de las transacciones */}
            {showJson && transactions.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
                  <h3 className="text-base font-medium text-white">JSON de Transacciones</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyJson}
                    className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {jsonCopied ? "¡Copiado!" : "Copiar JSON"}
                  </Button>
                </div>
                <div className="p-4 overflow-auto">
                  <pre className="text-xs text-gray-300 bg-gray-800/70 p-4 rounded-lg max-h-96 overflow-auto">
                    {JSON.stringify(transactions, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar transacción */}
      {showAddTransaction && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddTransaction(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-5 w-full max-w-md shadow-xl"
          >
            <h2 className="text-lg font-semibold mb-4 text-white">Agregar Movimiento</h2>
            <AddTransactionForm
              personId={personId}
              onSubmit={addTransaction}
              onCancel={() => setShowAddTransaction(false)}
            />
          </div>
        </div>
      )}

      {/* Modal para compartir */}
      {showShareModal && (
        <ShareModal personId={personId} personName={person.name} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  )
}
