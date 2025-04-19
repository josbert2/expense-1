"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, Link, Mail, QrCode, X, Users } from "lucide-react"
import { useData } from "@/contexts/data-context"
import type { SplitExpense } from "@/contexts/data-context"

interface ShareSplitExpenseModalProps {
  expense: SplitExpense
  onClose: () => void
}

export function ShareSplitExpenseModal({ expense, onClose }: ShareSplitExpenseModalProps) {
  const [shareMethod, setShareMethod] = useState<"link" | "email" | "qr">("link")
  const [expiryDays, setExpiryDays] = useState("7")
  const [includeDetails, setIncludeDetails] = useState(true)
  const [includeParticipants, setIncludeParticipants] = useState(true)
  const [requirePassword, setRequirePassword] = useState(false)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const { addSharedSplitExpense } = useData()

  // Función para generar el enlace compartido
  const generateShareLink = useCallback(() => {
    try {
      const uniqueId = Math.random().toString(36).substring(2, 15)
      const baseUrl = window.location.origin

      // Crear un enlace con todos los parámetros necesarios
      const link = `${baseUrl}/shared/expense/${uniqueId}?eid=${expense.id}&exp=${Date.now() + Number.parseInt(expiryDays) * 86400000}&det=${includeDetails ? 1 : 0}&part=${includeParticipants ? 1 : 0}`

      // Guardar el enlace usando el contexto global
      addSharedSplitExpense({
        expenseId: expense.id,
        expenseTitle: expense.title,
        url: link,
        expiresAt: new Date(Date.now() + Number.parseInt(expiryDays) * 86400000).toISOString(),
        includesDetails: includeDetails,
        includesParticipants: includeParticipants,
        isPasswordProtected: requirePassword,
      })

      return link
    } catch (error) {
      console.error("Error al generar enlace:", error)
      return ""
    }
  }, [expense, expiryDays, includeDetails, includeParticipants, requirePassword, addSharedSplitExpense])

  // Función para manejar la generación del enlace
  const handleGenerateLink = () => {
    const link = generateShareLink()
    setShareLink(link)
  }

  // Función para copiar el enlace
  const handleCopyLink = () => {
    try {
      if (!shareLink) {
        const newLink = generateShareLink()
        setShareLink(newLink)
        navigator.clipboard.writeText(newLink)
      } else {
        navigator.clipboard.writeText(shareLink)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error al copiar enlace:", error)
    }
  }

  // Función para enviar por email
  const handleSendEmail = () => {
    try {
      if (!shareLink) {
        setShareLink(generateShareLink())
      }
      // Simulamos el envío
      setEmailSent(true)
      setTimeout(() => setEmailSent(false), 3000)
    } catch (error) {
      console.error("Error al enviar email:", error)
    }
  }

  // Función para generar código QR
  const handleGenerateQR = () => {
    try {
      if (!shareLink) {
        setShareLink(generateShareLink())
      }
    } catch (error) {
      console.error("Error al generar QR:", error)
    }
  }

  // Evitar que el clic en el modal se propague al fondo
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Calcular estadísticas del gasto
  const totalPaid = expense.participants.reduce((sum, p) => sum + (p.paid ? p.amount : 0), 0)
  const percentPaid = Math.round((totalPaid / expense.totalAmount) * 100)
  const paidParticipants = expense.participants.filter((p) => p.paid).length
  const totalParticipants = expense.participants.length

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        onClick={handleModalClick}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-5 w-full max-w-md shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Compartir Gasto</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-2">{expense.title}</h3>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
            <span>
              Monto total: <span className="text-blue-400 font-medium">${expense.totalAmount.toLocaleString()}</span>
            </span>
            <span>{percentPaid}% pagado</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Users className="h-3 w-3 mr-1.5" />
            <span>
              {paidParticipants} de {totalParticipants} participantes han pagado
            </span>
          </div>
        </div>

        <Tabs
          defaultValue="link"
          className="mb-4"
          onValueChange={(value) => setShareMethod(value as "link" | "email" | "qr")}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="link" className="text-xs">
              <Link className="h-3.5 w-3.5 mr-1.5" />
              Enlace
            </TabsTrigger>
            <TabsTrigger value="email" className="text-xs">
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              Email
            </TabsTrigger>
            <TabsTrigger value="qr" className="text-xs">
              <QrCode className="h-3.5 w-3.5 mr-1.5" />
              Código QR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            {shareLink ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  <Input
                    value={shareLink}
                    readOnly
                    className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white pr-20"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className="absolute right-6 h-7 px-2.5 bg-gray-700 hover:bg-gray-600 text-xs"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 mr-1 text-green-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 mr-1" />
                    )}
                    {copied ? "Copiado" : "Copiar"}
                  </Button>
                </div>
                <p className="text-xs text-amber-400">Este enlace expirará en {expiryDays} días.</p>
              </div>
            ) : (
              <Button
                onClick={handleGenerateLink}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Link className="h-4 w-4 mr-2" />
                Generar Enlace
              </Button>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-300">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white"
              />
            </div>

            <Button
              onClick={handleSendEmail}
              disabled={!email || emailSent}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {emailSent ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-400" />
                  Enviado
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por Email
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            {shareLink ? (
              <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-gray-800" />
                  {/* En una implementación real, aquí se mostraría el código QR generado */}
                </div>
              </div>
            ) : (
              <Button
                onClick={handleGenerateQR}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Generar Código QR
              </Button>
            )}
          </TabsContent>
        </Tabs>

        <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 mb-4">
          <h3 className="text-sm font-medium text-white mb-2">Opciones de Compartir</h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Incluir Detalles</p>
              <p className="text-xs text-gray-400">Mostrar descripción y fecha</p>
            </div>
            <Switch
              checked={includeDetails}
              onCheckedChange={(checked) => {
                setIncludeDetails(checked)
                // Si ya hay un enlace generado, limpiarlo para que se genere uno nuevo con las nuevas opciones
                if (shareLink) setShareLink("")
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Incluir Participantes</p>
              <p className="text-xs text-gray-400">Mostrar lista de participantes</p>
            </div>
            <Switch
              checked={includeParticipants}
              onCheckedChange={(checked) => {
                setIncludeParticipants(checked)
                // Si ya hay un enlace generado, limpiarlo para que se genere uno nuevo con las nuevas opciones
                if (shareLink) setShareLink("")
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Proteger con Contraseña</p>
              <p className="text-xs text-gray-400">Requerir contraseña para acceder</p>
            </div>
            <Switch
              checked={requirePassword}
              onCheckedChange={(checked) => {
                setRequirePassword(checked)
                // Si ya hay un enlace generado, limpiarlo para que se genere uno nuevo con las nuevas opciones
                if (shareLink) setShareLink("")
              }}
            />
          </div>

          {requirePassword && (
            <div className="pt-2">
              <Label htmlFor="password" className="text-sm text-gray-300 mb-1 block">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  // Si ya hay un enlace generado, limpiarlo para que se genere uno nuevo con las nuevas opciones
                  if (shareLink) setShareLink("")
                }}
                placeholder="Contraseña para acceder"
                className="h-9 text-sm bg-gray-800/70 border-gray-700/50 text-white"
              />
            </div>
          )}

          <div className="pt-2">
            <Label htmlFor="expiry" className="text-sm text-gray-300 mb-1 block">
              Expiración
            </Label>
            <select
              id="expiry"
              value={expiryDays}
              onChange={(e) => {
                setExpiryDays(e.target.value)
                // Si ya hay un enlace generado, limpiarlo para que se genere uno nuevo con las nuevas opciones
                if (shareLink) setShareLink("")
              }}
              className="w-full h-9 text-sm bg-gray-800/70 border border-gray-700/50 text-white rounded-md focus:border-blue-500/50 focus:ring-blue-500/20"
            >
              <option value="1">1 día</option>
              <option value="3">3 días</option>
              <option value="7">7 días</option>
              <option value="30">30 días</option>
              <option value="90">90 días</option>
              <option value="0">Nunca</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
