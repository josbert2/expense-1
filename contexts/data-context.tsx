"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definir tipos
export interface Person {
  id: string
  name: string
  totalLoaned: number
  totalPaid: number
  balance: number
  status: "Pagado" | "Pendiente"
}

export interface Transaction {
  id: string
  personId: string
  type: "Préstamo" | "Pago"
  amount: number
  description: string
  date: string
  status: "Pagado" | "Pendiente"
}

export interface SharedLink {
  id: string
  personId: string
  personName: string
  url: string
  createdAt: string
  expiresAt: string
  includesTransactions: boolean
  includesPersonalInfo: boolean
  isPasswordProtected: boolean
  views: number
}

export interface SharedSplitExpense {
  id: string
  expenseId: string
  expenseTitle: string
  url: string
  createdAt: string
  expiresAt: string
  includesDetails: boolean
  includesParticipants: boolean
  isPasswordProtected: boolean
  views: number
}

export interface SplitExpenseParticipant {
  id: string
  name: string
  amount: number
  paid: boolean
}

export interface SplitExpense {
  id: string
  title: string
  description: string
  date: string
  totalAmount: number
  participants: SplitExpenseParticipant[]
}

// Datos de ejemplo para inicializar
const examplePeople: Person[] = [


  {
    id: "4",
    name: "Jose Castillo",
    totalLoaned: 496460,
    totalPaid: 198584,
    balance: 297876,
    status: "Pendiente",
  },
  {
    id: "5",
    name: "Barbara",
    totalLoaned: 55000,
    totalPaid: 0,
    balance: 55000,
    status: "Pendiente",
  },
  {
    id: "6",
    name: "Jose",
    totalLoaned: 416480,
    totalPaid: 0,
    balance: 416480,
    status: "Pendiente",
  },
  {
    id: "7",
    name: "Keiber",
    totalLoaned: 278222,
    totalPaid: 0,
    balance: 278222,
    status: "Pendiente",
  },
  {
    id: "9",
    name: "Eglennys",
    totalLoaned: 96480,
    totalPaid: 0,
    balance: 0,
    status: "Pendiente",
  },
]

// Datos de transacciones de ejemplo
const exampleTransactions: Record<string, Transaction[]> = {
  "1": [
    {
      id: "101",
      personId: "1",
      type: "Préstamo",
      amount: 100000,
      description: "Préstamo para reparación de auto",
      date: "2023-12-15T00:00:00.000Z",
    },
    {
      id: "102",
      personId: "1",
      type: "Préstamo",
      amount: 50000,
      description: "Préstamo para gastos médicos",
      date: "2024-01-20T00:00:00.000Z",
    },
    {
      id: "103",
      personId: "1",
      type: "Pago",
      amount: 50000,
      description: "Primer pago",
      date: "2024-02-10T00:00:00.000Z",
    },
  ],
  "2": [
    {
      id: "201",
      personId: "2",
      type: "Préstamo",
      amount: 75000,
      description: "Préstamo para compra de laptop",
      date: "2023-11-05T00:00:00.000Z",
    },
    {
      id: "202",
      personId: "2",
      type: "Pago",
      amount: 25000,
      description: "Primer pago",
      date: "2023-12-05T00:00:00.000Z",
    },
    {
      id: "203",
      personId: "2",
      type: "Pago",
      amount: 25000,
      description: "Segundo pago",
      date: "2024-01-05T00:00:00.000Z",
    },
    {
      id: "204",
      personId: "2",
      type: "Pago",
      amount: 25000,
      description: "Pago final",
      date: "2024-02-05T00:00:00.000Z",
    },
  ],
  "3": [
    {
      id: "301",
      personId: "3",
      type: "Préstamo",
      amount: 200000,
      description: "Préstamo para matrícula universitaria",
      date: "2024-01-10T00:00:00.000Z",
    },
    {
      id: "302",
      personId: "3",
      type: "Pago",
      amount: 50000,
      description: "Primer pago",
      date: "2024-02-10T00:00:00.000Z",
    },
  ],
  "4": [
    {
      id: "401",
      personId: "4",
      type: "Pago",
      amount: 49646,
      description: "Monto de la Cuota",
      date: "2023-12-01T00:00:00.000Z",
    },
   
    {
      id: "404",
      personId: "4",
      type: "Préstamo",
      amount: 49646,
      description: "Monto de la Cuota",
      date: "2024-03-01T00:00:00.000Z",
    },
    {
      id: "405",
      personId: "4",
      type: "Préstamo",
      amount: 49646,
      description: "Monto de la Cuota",
      date: "2024-04-01T00:00:00.000Z",
    },
    {
      id: "406",
      personId: "4",
      type: "Préstamo",
      amount: 49646,
      description: "Monto de la Cuota",
      date: "2024-05-01T00:00:00.000Z",
    },
    {
      id: "407",
      personId: "4",
      type: "Préstamo",
      amount: 49646,
      description: "Monto de la Cuota",
      date: "2024-06-01T00:00:00.000Z",
    },
    {
      id: "408",
      personId: "4",
      type: "Préstamo",
      amount: 49646,
      description: "Monto de la Cuota",
      date: "2024-07-01T00:00:00.000Z",
    },
    {
      id: "411",
      personId: "4",
      type: "Préstamo",
      amount: 20000,
      description: "Prestamo",
      date: "2023-12-15T00:00:00.000Z",
    },
  
    {
      id: "411",
      personId: "4",
      type: "Pago",
      amount: 49646,
      description: "Pago",
      date: "2023-12-15T00:00:00.000Z",
    },
    {
      id: "412",
      personId: "4",
      type: "Pago",
      amount: 49646,
      description: "Pago 05/01/2025",
      date: "2025-01-05T00:00:00.000Z",
    },
    {
      id: "413",
      personId: "4",
      type: "Pago",
      amount: 49646,
      description: "Pago 06/02/2025",
      date: "2025-02-06T00:00:00.000Z",
    },
    {
      id: "414",
      personId: "4",
      type: "Pago",
      amount: 49646,
      description: "Pago 06/03/2025",
      date: "2025-03-06T00:00:00.000Z",
    },
  ],
  "5": [
    {
      id: "501",
      personId: "5",
      type: "Préstamo",
      amount: 30000,
      description: "Préstamo personal",
      date: "2024-03-15T00:00:00.000Z",
    },
    {
      id: "502",
      personId: "5",
      type: "Préstamo",
      amount: 25000,
      description: "Préstamo personal",
      date: "2024-03-15T00:00:00.000Z",
    },
  ],
  "6": [
    {
      id: "601",
      personId: "6",
      type: "Préstamo",
      amount: 281480,
      description: "Préstamo personal",
      date: "2024-03-20T00:00:00.000Z",
    },
    {
      id: "602",
      personId: "6",
      type: "Pago",
      amount: 100000,
      description: "Pago",
      date: "2024-03-20T00:00:00.000Z",
    },
    {
      id: "602",
      personId: "6",
      type: "Préstamo",
      amount: 135000,
      description: "Préstamo personal",
      date: "2024-03-20T00:00:00.000Z",
    },
  ],
  "7": [
    {
      id: "701",
      personId: "7",
      type: "Préstamo",
      amount: 30000,
      description: "Préstamo personal",
      date: "2024-03-01T00:00:00.000Z",
    },
    {
      id: "702",
      personId: "7",
      type: "Préstamo",
      amount: 130000,
      description: "Préstamo para televisor",
      date: "2024-03-10T00:00:00.000Z",
    },
    {
      id: "703",
      personId: "7",
      type: "Préstamo",
      amount: 118222,
      description: "Préstamo para mouse",
      date: "2024-03-15T00:00:00.000Z",
    },
  ],
  "8": [
    {
      id: "801",
      personId: "8",
      type: "Préstamo",
      amount: 240000,
      description: "Préstamo para moto - 6 cuotas de $40.000",
      date: "2024-03-01T00:00:00.000Z",
    },
    {
      id: "802",
      personId: "8",
      type: "Pago",
      amount: 40000,
      description: "Cuota 1/6",
      date: "2024-04-01T00:00:00.000Z",
    },
    {
      id: "803",
      personId: "8",
      type: "Pago",
      amount: 40000,
      description: "Cuota 2/6 (Programada)",
      date: "2024-05-01T00:00:00.000Z",
    },
    {
      id: "804",
      personId: "8",
      type: "Pago",
      amount: 40000,
      description: "Cuota 3/6 (Programada)",
      date: "2024-06-01T00:00:00.000Z",
    },
    {
      id: "805",
      personId: "8",
      type: "Pago",
      amount: 40000,
      description: "Cuota 4/6 (Programada)",
      date: "2024-07-01T00:00:00.000Z",
    },
    {
      id: "806",
      personId: "8",
      type: "Pago",
      amount: 40000,
      description: "Cuota 5/6 (Programada)",
      date: "2024-08-01T00:00:00.000Z",
    },
    {
      id: "807",
      personId: "8",
      type: "Pago",
      amount: 40000,
      description: "Cuota 6/6 (Programada)",
      date: "2024-09-01T00:00:00.000Z",
    },
  ],
  "9": [
    {
      
      "personId": "9",
      "type": "Préstamo",
      "amount": 96480,
      "description": "Compra de botas (Préstamo en 6 cuotas de 16080)",
      "date": "2025-04-19T00:00:00.000Z",
      "id": "1",
      "status": "Pagado"
    },
    {
      "personId": "9",
      "type": "Pago",
      "amount": 16080,
      "description": "Cuota 1/6 (Programada)",
      "date": "2025-04-19T00:00:00.000Z",
      "id": "2",
      "status": "Pendiente"
    },
    {
      "personId": "9",
      "type": "Pago",
      "amount": 16080,
      "description": "Cuota 2/6 (Programada)",
      "date": "2025-05-19T00:00:00.000Z",
      "id": "3",
      "status": "Pendiente"

    },
    {
      "personId": "9",
      "type": "Pago",
      "amount": 16080,
      "description": "Cuota 3/6 (Programada)",
      "date": "2025-06-19T00:00:00.000Z",
      "id": "4",
      "status": "Pendiente"
    },
    {
      "personId": "9",
      "type": "Pago",
      "amount": 16080,
      "description": "Cuota 4/6 (Programada)",
      "date": "2025-07-19T00:00:00.000Z",
      "id": "5",
      "status": "Pendiente"
    },
    {
      "personId": "9",
      "type": "Pago",
      "amount": 16080,
      "description": "Cuota 5/6 (Programada)",
      "date": "2025-08-19T00:00:00.000Z",
      "id": "6",
      "status": "Pendiente"
    },
    {
      "personId": "9",
      "type": "Pago",
      "amount": 16080,
      "description": "Cuota 6/6 (Programada)",
      "date": "2025-09-18T00:00:00.000Z",
      "id": "7",
      "status": "Pendiente"
    }
  ]
}

// Datos de ejemplo para enlaces compartidos
const exampleSharedLinks: SharedLink[] = [
  {
    id: "1",
    personId: "4",
    personName: "Jose Castillo",
    url: "https://example.com/shared/abc123",
    createdAt: "2024-03-15T10:30:00.000Z",
    expiresAt: "2024-04-15T10:30:00.000Z",
    includesTransactions: true,
    includesPersonalInfo: false,
    isPasswordProtected: true,
    views: 3,
  },
  {
    id: "2",
    personId: "5",
    personName: "Barbara",
    url: "https://example.com/shared/def456",
    createdAt: "2024-03-20T14:45:00.000Z",
    expiresAt: "2024-03-27T14:45:00.000Z",
    includesTransactions: true,
    includesPersonalInfo: true,
    isPasswordProtected: false,
    views: 1,
  },
  {
    id: "3",
    personId: "8",
    personName: "Pedro",
    url: "https://example.com/shared/ghi789",
    createdAt: "2024-03-25T09:15:00.000Z",
    expiresAt: "2024-04-25T09:15:00.000Z",
    includesTransactions: false,
    includesPersonalInfo: false,
    isPasswordProtected: false,
    views: 0,
  },
]

// Datos de ejemplo para gastos divididos
const exampleSplitExpenses: SplitExpense[] = [
  {
    id: "1",
    title: "Cena en restaurante",
    description: "Cena del viernes en el restaurante italiano",
    date: "2024-03-10T20:00:00.000Z",
    totalAmount: 75000,
    participants: [
      { id: "1", name: "Carlos", amount: 15000, paid: true },
      { id: "2", name: "María", amount: 15000, paid: false },
      { id: "3", name: "Juan", amount: 15000, paid: true },
      { id: "4", name: "José", amount: 15000, paid: false },
      { id: "5", name: "Barbara", amount: 15000, paid: true },
    ],
  },
  {
    id: "2",
    title: "Viaje a la playa",
    description: "Gastos de gasolina y peajes",
    date: "2024-02-15T10:00:00.000Z",
    totalAmount: 45000,
    participants: [
      { id: "1", name: "Carlos", amount: 15000, paid: true },
      { id: "4", name: "José", amount: 15000, paid: true },
      { id: "5", name: "Barbara", amount: 15000, paid: true },
    ],
  },
]

// Definir la interfaz del contexto
interface DataContextType {
  people: Person[]
  setPeople: (people: Person[]) => void
  addPerson: (person: Omit<Person, "id" | "totalLoaned" | "totalPaid" | "balance" | "status">) => void
  deletePerson: (id: string) => void
  updatePerson: (person: Person) => void
  getPerson: (id: string) => Person | undefined

  getTransactions: (personId: string) => Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  deleteTransaction: (personId: string, transactionId: string) => void
  updateTransactions: (personId: string, transactions: Transaction[]) => void
  updateTransaction: (personId: string, updatedTransaction: Transaction) => void

  sharedLinks: SharedLink[]
  addSharedLink: (link: Omit<SharedLink, "id" | "createdAt" | "views">) => void
  deleteSharedLink: (id: string) => void
  incrementLinkViews: (id: string) => void

  sharedSplitExpenses: SharedSplitExpense[]
  addSharedSplitExpense: (link: Omit<SharedSplitExpense, "id" | "createdAt" | "views">) => void
  deleteSharedSplitExpense: (id: string) => void
  incrementSplitExpenseLinkViews: (id: string) => void

  splitExpenses: SplitExpense[]
  addSplitExpense: (expense: Omit<SplitExpense, "id">) => void
  updateSplitExpense: (expense: SplitExpense) => void
  deleteSplitExpense: (id: string) => void
  updateParticipantPaymentStatus: (expenseId: string, participantId: string, paid: boolean) => void

  exportData: () => void
  importData: (data: string) => boolean
}

// Crear el contexto
const DataContext = createContext<DataContextType | undefined>(undefined)

// Proveedor del contexto
export function DataProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([])
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({})
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([])
  const [sharedSplitExpenses, setSharedSplitExpenses] = useState<SharedSplitExpense[]>([])
  const [splitExpenses, setSplitExpenses] = useState<SplitExpense[]>([])

  // Cargar datos al iniciar - ahora siempre cargamos los datos de ejemplo
  useEffect(() => {
    // Inicializar con datos de ejemplo
    setPeople(examplePeople)
    setTransactions(exampleTransactions)
    setSharedLinks(exampleSharedLinks)
    setSplitExpenses(exampleSplitExpenses)
    setSharedSplitExpenses([])
  }, [])

  // Funciones para manejar personas
  const addPerson = (personData: Omit<Person, "id" | "totalLoaned" | "totalPaid" | "balance" | "status">) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name: personData.name,
      totalLoaned: 0,
      totalPaid: 0,
      balance: 0,
      status: "Pendiente",
    }

    setPeople((prev) => [...prev, newPerson])
    setTransactions((prev) => ({
      ...prev,
      [newPerson.id]: [],
    }))
  }

  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id))

    // Eliminar transacciones asociadas
    setTransactions((prev) => {
      const newTransactions = { ...prev }
      delete newTransactions[id]
      return newTransactions
    })

    // Eliminar enlaces compartidos asociados
    setSharedLinks((prev) => prev.filter((link) => link.personId !== id))
  }

  const updatePerson = (updatedPerson: Person) => {
    setPeople((prev) => prev.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)))
  }

  const getPerson = (id: string) => {
    return people.find((p) => p.id === id)
  }

  // Funciones para manejar transacciones
  const getTransactions = (personId: string) => {
    return transactions[personId] || []
  }

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }

    setTransactions((prev) => ({
      ...prev,
      [transaction.personId]: [...(prev[transaction.personId] || []), newTransaction],
    }))

    // Actualizar totales de la persona
    const person = people.find((p) => p.id === transaction.personId)
    if (person) {
      const personTransactions = [...(transactions[transaction.personId] || []), newTransaction]
      const totalLoaned = personTransactions.filter((t) => t.type === "Préstamo").reduce((sum, t) => sum + t.amount, 0)
      const totalPaid = personTransactions.filter((t) => t.type === "Pago").reduce((sum, t) => sum + t.amount, 0)
      const balance = totalLoaned - totalPaid
      const status = balance <= 0 ? "Pagado" : "Pendiente"

      updatePerson({
        ...person,
        totalLoaned,
        totalPaid,
        balance,
        status: status as "Pagado" | "Pendiente",
      })
    }
  }

  const deleteTransaction = (personId: string, transactionId: string) => {
    setTransactions((prev) => ({
      ...prev,
      [personId]: prev[personId]?.filter((t) => t.id !== transactionId) || [],
    }))

    // Actualizar totales de la persona
    const person = people.find((p) => p.id === personId)
    if (person) {
      const personTransactions = transactions[personId]?.filter((t) => t.id !== transactionId) || []
      const totalLoaned = personTransactions.filter((t) => t.type === "Préstamo").reduce((sum, t) => sum + t.amount, 0)
      const totalPaid = personTransactions.filter((t) => t.type === "Pago").reduce((sum, t) => sum + t.amount, 0)
      const balance = totalLoaned - totalPaid
      const status = balance <= 0 ? "Pagado" : "Pendiente"

      updatePerson({
        ...person,
        totalLoaned,
        totalPaid,
        balance,
        status: status as "Pagado" | "Pendiente",
      })
    }
  }

  const updateTransactions = (personId: string, updatedTransactions: Transaction[]) => {
    setTransactions((prev) => ({
      ...prev,
      [personId]: updatedTransactions,
    }))

    // Actualizar totales de la persona
    const person = people.find((p) => p.id === personId)
    if (person) {
      const totalLoaned = updatedTransactions.filter((t) => t.type === "Préstamo").reduce((sum, t) => sum + t.amount, 0)
      const totalPaid = updatedTransactions.filter((t) => t.type === "Pago").reduce((sum, t) => sum + t.amount, 0)
      const balance = totalLoaned - totalPaid
      const status = balance <= 0 ? "Pagado" : "Pendiente"

      updatePerson({
        ...person,
        totalLoaned,
        totalPaid,
        balance,
        status: status as "Pagado" | "Pendiente",
      })
    }
  }

  const updateTransaction = (personId: string, updatedTransaction: Transaction) => {
    setTransactions((prev) => ({
      ...prev,
      [personId]: prev[personId]?.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)) || [],
    }))

    // No es necesario actualizar los totales de la persona ya que solo estamos
    // cambiando el estado de la cuota, no los montos
  }

  // Funciones para manejar enlaces compartidos
  const addSharedLink = (link: Omit<SharedLink, "id" | "createdAt" | "views">) => {
    const newLink: SharedLink = {
      ...link,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      views: 0,
    }

    setSharedLinks((prev) => [...prev, newLink])
  }

  const deleteSharedLink = (id: string) => {
    setSharedLinks((prev) => prev.filter((link) => link.id !== id))
  }

  const incrementLinkViews = (id: string) => {
    setSharedLinks((prev) => prev.map((link) => (link.id === id ? { ...link, views: link.views + 1 } : link)))
  }

  // Funciones para manejar enlaces compartidos de gastos divididos
  const addSharedSplitExpense = (link: Omit<SharedSplitExpense, "id" | "createdAt" | "views">) => {
    const newLink: SharedSplitExpense = {
      ...link,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      views: 0,
    }

    setSharedSplitExpenses((prev) => [...prev, newLink])
  }

  const deleteSharedSplitExpense = (id: string) => {
    setSharedSplitExpenses((prev) => prev.filter((link) => link.id !== id))
  }

  const incrementSplitExpenseLinkViews = (id: string) => {
    setSharedSplitExpenses((prev) => prev.map((link) => (link.id === id ? { ...link, views: link.views + 1 } : link)))
  }

  // Funciones para manejar gastos divididos
  const addSplitExpense = (expense: Omit<SplitExpense, "id">) => {
    const newExpense: SplitExpense = {
      ...expense,
      id: Date.now().toString(),
    }

    setSplitExpenses((prev) => [...prev, newExpense])
  }

  const updateSplitExpense = (updatedExpense: SplitExpense) => {
    setSplitExpenses((prev) => prev.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
  }

  const deleteSplitExpense = (id: string) => {
    setSplitExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const updateParticipantPaymentStatus = (expenseId: string, participantId: string, paid: boolean) => {
    setSplitExpenses((prev) =>
      prev.map((expense) => {
        if (expense.id === expenseId) {
          return {
            ...expense,
            participants: expense.participants.map((participant) => {
              if (participant.id === participantId) {
                return { ...participant, paid }
              }
              return participant
            }),
          }
        }
        return expense
      }),
    )
  }

  // Exportar e importar datos
  const exportData = () => {
    const data = {
      people,
      transactions,
      sharedLinks,
      sharedSplitExpenses,
      splitExpenses,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `prestamos_${new Date().toLocaleDateString()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importData = (dataStr: string) => {
    try {
      const data = JSON.parse(dataStr)

      if (!data.people || !data.transactions || !data.sharedLinks || !data.splitExpenses || !data.sharedSplitExpenses) {
        return false
      }

      setPeople(data.people)
      setTransactions(data.transactions)
      setSharedLinks(data.sharedLinks)
      setSharedSplitExpenses(data.sharedSplitExpenses)
      setSplitExpenses(data.splitExpenses)

      return true
    } catch (error) {
      console.error("Error al importar datos:", error)
      return false
    }
  }

  return (
    <DataContext.Provider
      value={{
        people,
        setPeople,
        addPerson,
        deletePerson,
        updatePerson,
        getPerson,

        getTransactions,
        addTransaction,
        deleteTransaction,
        updateTransactions,
        updateTransaction,

        sharedLinks,
        addSharedLink,
        deleteSharedLink,
        incrementLinkViews,

        sharedSplitExpenses,
        addSharedSplitExpense,
        deleteSharedSplitExpense,
        incrementSplitExpenseLinkViews,

        splitExpenses,
        addSplitExpense,
        updateSplitExpense,
        deleteSplitExpense,
        updateParticipantPaymentStatus,

        exportData,
        importData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

// Hook para usar el contexto
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData debe ser usado dentro de un DataProvider")
  }
  return context
}
