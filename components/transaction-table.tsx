"use client"

import React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowDown, ArrowUp, Calendar, CreditCard, CheckCircle2, Check } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PayInstallmentModal } from "./pay-installment-modal"

interface Transaction {
  id: string
  date: string
  type: string
  amount: number
  description: string
  status: "Pagado" | "Pendiente" // Estado explícito
}

interface TransactionTableProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
  onPayInstallment?: (paymentData: {
    installmentId: string
    amount: number
    date: string
    description: string
  }) => void
  onToggleStatus?: (transactionId: string, newStatus: "Pendiente" | "Pagado") => void
}

export function TransactionTable({ transactions, onDelete, onPayInstallment, onToggleStatus }: TransactionTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction
    direction: "ascending" | "descending"
  }>({
    key: "date",
    direction: "descending",
  })

  const [selectedInstallment, setSelectedInstallment] = useState<Transaction | null>(null)

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key: keyof Transaction) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getTypeColor = (type: string) => {
    return type === "Préstamo"
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : "bg-green-500/20 text-green-400 border-green-500/30"
  }

  const getTypeIcon = (type: string) => {
    return type === "Préstamo" ? <ArrowDown className="h-3 w-3 mr-1" /> : <ArrowUp className="h-3 w-3 mr-1" />
  }

  const isInstallment = (transaction: Transaction) => {
    return transaction.description.toLowerCase().includes("cuota") && transaction.type === "Pago"
  }

  const isLoanWithInstallments = (transaction: Transaction) => {
    return transaction.description.toLowerCase().includes("cuotas") && transaction.type === "Préstamo"
  }

  const handlePayInstallment = (transaction: Transaction) => {
    if (onPayInstallment && transaction.status === "Pendiente") {
      setSelectedInstallment(transaction)
    }
  }

  const handleToggleStatus = (transaction: Transaction) => {
    if (onToggleStatus) {
      const newStatus = transaction.status === "Pagado" ? "Pendiente" : "Pagado"
      onToggleStatus(transaction.id, newStatus)
    }
  }

  const submitPayInstallment = (paymentData: {
    installmentId: string
    amount: number
    date: string
    description: string
  }) => {
    if (onPayInstallment) {
      onPayInstallment(paymentData)
      setSelectedInstallment(null)
    }
  }

  // Agrupar transacciones por préstamos en cuotas
  const groupInstallments = () => {
    const groups: Record<string, Transaction[]> = {}
    const standalone: Transaction[] = []

    // Primero identificar préstamos con cuotas
    sortedTransactions.forEach((transaction) => {
      if (isLoanWithInstallments(transaction)) {
        // Extraer el número de cuotas del texto (ej: "Préstamo en 3 cuotas de 10000")
        const match = transaction.description.match(/en (\d+) cuotas/)
        if (match && match[1]) {
          groups[transaction.id] = [transaction]
        }
      }
    })

    // Luego asignar las cuotas a sus préstamos correspondientes
    sortedTransactions.forEach((transaction) => {
      if (isInstallment(transaction)) {
        // Buscar a qué préstamo pertenece esta cuota
        let assigned = false
        for (const loanId in groups) {
          if (groups[loanId].length > 0) {
            const loan = groups[loanId][0]
            // Si la cuota es posterior al préstamo, asumimos que pertenece a este préstamo
            if (new Date(transaction.date) >= new Date(loan.date)) {
              groups[loanId].push(transaction)
              assigned = true
              break
            }
          }
        }

        if (!assigned) {
          standalone.push(transaction)
        }
      } else if (!isLoanWithInstallments(transaction)) {
        standalone.push(transaction)
      }
    })

    return { groups, standalone }
  }

  const { groups, standalone } = groupInstallments()

  return (
    <div>
      <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
        <h3 className="text-base font-medium text-white">Historial de Movimientos</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => requestSort("date")}
            className="h-8 text-xs bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Fecha
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-900/70">
            <TableRow className="border-b border-gray-800/50 hover:bg-transparent">
              <TableHead
                className="cursor-pointer text-xs text-gray-400 hover:text-white"
                onClick={() => requestSort("date")}
              >
                Fecha {sortConfig.key === "date" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer text-xs text-gray-400 hover:text-white"
                onClick={() => requestSort("type")}
              >
                Tipo
              </TableHead>
              <TableHead
                className="cursor-pointer text-xs text-gray-400 hover:text-white"
                onClick={() => requestSort("amount")}
              >
                Monto
              </TableHead>
              <TableHead className="text-xs text-gray-400">Descripción</TableHead>
              <TableHead className="text-xs text-gray-400">Estado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Renderizar transacciones independientes */}
            {standalone.map((transaction) => (
              <TableRow
                key={transaction.id}
                className={`border-b border-gray-800/30 hover:bg-gray-800/30 ${
                  transaction.type === "Pago" && transaction.status === "Pendiente" ? "bg-gray-800/10 opacity-70" : ""
                }`}
              >
                <TableCell className="text-xs text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1.5 text-gray-500" />
                    {formatDate(transaction.date)}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getTypeColor(transaction.type)}`}
                  >
                    {getTypeIcon(transaction.type)}
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {transaction.type === "Préstamo" ? (
                    <span className="text-blue-400">{formatCurrency(transaction.amount)}</span>
                  ) : (
                    <span className="text-green-400">{formatCurrency(transaction.amount)}</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-gray-300 max-w-[200px] truncate">
                  {transaction.description}
                </TableCell>
                <TableCell>
                
                  {transaction.type === "Pago" && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.status === "Pagado"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {transaction.type === "Pago" && onToggleStatus && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(transaction)}
                        className={`h-7 w-7 p-0 ${
                          transaction.status === "Pagado"
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                        }`}
                        title={transaction.status === "Pagado" ? "Marcar como pendiente" : "Marcar como pagado"}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {transaction.type === "Pago" && transaction.status === "Pendiente" && onPayInstallment && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePayInstallment(transaction)}
                        className="h-7 px-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                        title="Registrar pago"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Pagar</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transaction.id)}
                      className="h-6 w-6 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Renderizar grupos de préstamos con cuotas */}
            {Object.entries(groups).map(([loanId, transactions]) => (
              <React.Fragment key={loanId}>
                {/* Préstamo principal */}
                <TableRow className="border-b border-gray-800/30 hover:bg-gray-800/30 bg-blue-900/10">
                  <TableCell className="text-xs text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1.5 text-gray-500" />
                      {formatDate(transactions[0].date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      Préstamo
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    <span className="text-blue-400">{formatCurrency(transactions[0].amount)}</span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-300 max-w-[200px]">
                    <div>
                      {transactions[0].description}
                      <div className="mt-1 flex items-center">
                        <CreditCard className="h-3 w-3 mr-1 text-blue-400" />
                        <span className="text-blue-400 text-[10px]">{transactions.length - 1} cuotas programadas</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transactions[0].id)}
                      className="h-6 w-6 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Cuotas asociadas */}
                {transactions.slice(1).map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className={`border-b border-gray-800/30 hover:bg-gray-800/30 ${
                      transaction.status === "Pagado" ? "bg-green-900/5" : "bg-gray-800/10 opacity-70"
                    }`}
                  >
                    <TableCell className="text-xs text-gray-300 pl-8">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1.5 text-gray-500" />
                        {formatDate(transaction.date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border bg-green-500/20 text-green-400 border-green-500/30">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        Cuota
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      <span className="text-green-400">{formatCurrency(transaction.amount)}</span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-300 max-w-[200px] truncate">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                    
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.status === "Pagado"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {onToggleStatus && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(transaction)}
                            className={`h-7 w-7 p-0 ${
                              transaction.status === "Pagado"
                                ? "text-green-400 hover:bg-green-500/10"
                                : "text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                            }`}
                            title={transaction.status === "Pagado" ? "Marcar como pendiente" : "Marcar como pagado"}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {transaction.status === "Pendiente" && onPayInstallment && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePayInstallment(transaction)}
                            className="h-7 px-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                            title="Registrar pago"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">Pagar</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(transaction.id)}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal para pagar cuota */}
      {selectedInstallment && onPayInstallment && (
        <PayInstallmentModal
          installment={selectedInstallment}
          onSubmit={submitPayInstallment}
          onCancel={() => setSelectedInstallment(null)}
        />
      )}
    </div>
  )
}
