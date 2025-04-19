"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PersonCard } from "@/components/person-card"
import { AddPersonForm } from "@/components/add-person-form"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download, Sun, Users, PieChart, Settings, LogOut, Share2, Receipt } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"

export default function Home() {
  const router = useRouter()
  const [showAddPerson, setShowAddPerson] = useState(false)
  const { setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("personas")
  const { isAuthenticated, logout } = useAuth()
  const { people, addPerson, exportData } = useData()

  // Establecer tema oscuro por defecto
  useEffect(() => {
    setTheme("dark")
  }, [setTheme])

  const handleAddPerson = (person: { name: string }) => {
    addPerson(person)
    setShowAddPerson(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Calcular totales para el resumen
  const totals = people.reduce(
    (acc, person) => {
      return {
        totalLoaned: acc.totalLoaned + person.totalLoaned,
        totalPaid: acc.totalPaid + person.totalPaid,
        balance: acc.balance + person.balance,
      }
    },
    { totalLoaned: 0, totalPaid: 0, balance: 0 },
  )

  // Si no está autenticado, mostrar pantalla de carga
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800/50 bg-gray-950/50 backdrop-blur-sm p-5 flex flex-col">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-white mb-1">Préstamos</h1>
            <p className="text-xs text-gray-500">Sistema de gestión de préstamos</p>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("personas")}
              className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === "personas"
                  ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <Users className={`h-4 w-4 mr-3 ${activeTab === "personas" ? "text-blue-400" : "text-gray-500"}`} />
              <span className="text-sm font-medium">Personas</span>
            </button>

            <button
              onClick={() => setActiveTab("resumen")}
              className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === "resumen"
                  ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <PieChart className={`h-4 w-4 mr-3 ${activeTab === "resumen" ? "text-blue-400" : "text-gray-500"}`} />
              <span className="text-sm font-medium">Resumen</span>
            </button>

            <button
              onClick={() => router.push("/shared")}
              className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-800/50`}
            >
              <Share2 className="h-4 w-4 mr-3 text-gray-500" />
              <span className="text-sm font-medium">Compartidos</span>
            </button>

            <button
              onClick={() => router.push("/split-expenses")}
              className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === "split-expenses"
                  ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <Receipt
                className={`h-4 w-4 mr-3 ${activeTab === "split-expenses" ? "text-blue-400" : "text-gray-500"}`}
              />
              <span className="text-sm font-medium">Gastos Divididos</span>
            </button>

            <button
              onClick={() => setActiveTab("ajustes")}
              className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === "ajustes"
                  ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <Settings className={`h-4 w-4 mr-3 ${activeTab === "ajustes" ? "text-blue-400" : "text-gray-500"}`} />
              <span className="text-sm font-medium">Ajustes</span>
            </button>
          </nav>

          <div className="mt-auto">
            <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800/50 mb-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-xs">
                  JH
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-white">Josbert</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme("light")}
                  className="h-8 w-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/70"
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={exportData}
                  className="h-8 w-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/70"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/70"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "personas" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Personas</h2>
                  <p className="text-sm text-gray-500 mt-1">Gestiona los préstamos por persona</p>
                </div>
                <Button
                  onClick={() => setShowAddPerson(true)}
                  className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-900/20"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Agregar Persona
                </Button>
              </div>

              {people.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/80 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No hay personas registradas</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Agrega una persona para comenzar a registrar préstamos y pagos.
                  </p>
                  <Button
                    onClick={() => setShowAddPerson(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Agregar Persona
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence>
                    {people.map((person) => (
                      <motion.div
                        key={person.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PersonCard person={person} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {activeTab === "resumen" && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Resumen</h2>
                <p className="text-sm text-gray-500 mt-1">Resumen general de préstamos y pagos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-5 border border-blue-800/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-400">Total Prestado</h3>
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 text-xs">💰</span>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-white">
                    {new Intl.NumberFormat("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 0,
                    }).format(totals.totalLoaned)}
                  </p>
                  <p className="text-xs text-blue-400 mt-2">{people.length} personas con préstamos activos</p>
                </div>

                <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-5 border border-green-800/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-400">Total Pagado</h3>
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-white">
                    {new Intl.NumberFormat("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 0,
                    }).format(totals.totalPaid)}
                  </p>
                  <p className="text-xs text-green-400 mt-2">
                    {people.filter((p) => p.totalPaid > 0).length} personas han realizado pagos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-xl p-5 border border-amber-800/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-400">Balance Pendiente</h3>
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <span className="text-amber-400 text-xs">⏱️</span>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-white">
                    {new Intl.NumberFormat("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 0,
                    }).format(totals.balance)}
                  </p>
                  <p className="text-xs text-amber-400 mt-2">
                    {people.filter((p) => p.balance > 0).length} personas con saldo pendiente
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm overflow-hidden">
                <div className="p-5 border-b border-gray-800/50">
                  <h3 className="text-lg font-medium text-white">Estado de Préstamos</h3>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {people.map((person) => (
                      <div key={person.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-medium text-xs">
                            {person.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-white">{person.name}</p>
                            <p className="text-xs text-gray-500">
                              {person.status === "Pagado"
                                ? "Completado"
                                : `${Math.round((person.totalPaid / person.totalLoaned) * 100)}% pagado`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4">
                            <p className="text-sm font-medium text-white text-right">
                              {new Intl.NumberFormat("es-CL", {
                                style: "currency",
                                currency: "CLP",
                                minimumFractionDigits: 0,
                              }).format(person.balance)}
                            </p>
                            <p className="text-xs text-gray-500 text-right">Pendiente</p>
                          </div>
                          <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${person.status === "Pagado" ? "bg-green-500" : "bg-blue-500"}`}
                              style={{
                                width: `${Math.min(100, Math.round((person.totalPaid / person.totalLoaned) * 100))}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ajustes" && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Ajustes</h2>
                <p className="text-sm text-gray-500 mt-1">Configura las opciones de la aplicación</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-800/50">
                    <h3 className="text-lg font-medium text-white">Apariencia</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Tema Oscuro</p>
                        <p className="text-xs text-gray-500">Cambiar entre tema claro y oscuro</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTheme("light")}
                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        Cambiar a Claro
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-800/50">
                    <h3 className="text-lg font-medium text-white">Datos</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Exportar Datos</p>
                        <p className="text-xs text-gray-500">Descargar todos los datos en formato JSON</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportData}
                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Cerrar Sesión</p>
                        <p className="text-xs text-gray-500">Salir del sistema</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddPerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddPerson(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-5 w-full max-w-md shadow-xl"
            >
              <h2 className="text-lg font-semibold mb-4 text-white">Agregar Persona</h2>
              <AddPersonForm onSubmit={handleAddPerson} onCancel={() => setShowAddPerson(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
