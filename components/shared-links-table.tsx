"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Link, Trash2 } from "lucide-react"

interface SharedLink {
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

interface SharedLinksTableProps {
  links: SharedLink[]
  onDelete: (id: string) => void
}

export function SharedLinksTable({ links, onDelete }: SharedLinksTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-gray-800/50">
        <h3 className="text-base font-medium text-white">Enlaces Compartidos</h3>
      </div>

      {links.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-800/80 flex items-center justify-center mx-auto mb-3">
            <Link className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-gray-500">No hay enlaces compartidos activos</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-900/70">
              <TableRow className="border-b border-gray-800/50 hover:bg-transparent">
                <TableHead className="text-xs text-gray-400">Persona</TableHead>
                <TableHead className="text-xs text-gray-400">Creado</TableHead>
                <TableHead className="text-xs text-gray-400">Expira</TableHead>
                <TableHead className="text-xs text-gray-400">Vistas</TableHead>
                <TableHead className="text-xs text-gray-400">Opciones</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow
                  key={link.id}
                  className={`border-b border-gray-800/30 hover:bg-gray-800/30 ${
                    isExpired(link.expiresAt) ? "opacity-60" : ""
                  }`}
                >
                  <TableCell className="text-sm font-medium text-white">{link.personName}</TableCell>
                  <TableCell className="text-xs text-gray-400">{formatDate(link.createdAt)}</TableCell>
                  <TableCell className="text-xs">
                    <span className={isExpired(link.expiresAt) ? "text-red-400" : "text-amber-400"}>
                      {formatDate(link.expiresAt)}
                      {isExpired(link.expiresAt) && " (Expirado)"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400">{link.views}</TableCell>
                  <TableCell className="text-xs">
                    <div className="flex space-x-1">
                      {link.includesTransactions && (
                        <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] border border-blue-500/20">
                          Transacciones
                        </span>
                      )}
                      {link.includesPersonalInfo && (
                        <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px] border border-purple-500/20">
                          Info Personal
                        </span>
                      )}
                      {link.isPasswordProtected && (
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] border border-amber-500/20">
                          Protegido
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(link.url, link.id)}
                        className="h-7 w-7 p-0 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10"
                        title="Copiar enlace"
                      >
                        <Copy className={`h-3.5 w-3.5 ${copiedId === link.id ? "text-green-400" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(link.url, "_blank")}
                        className="h-7 w-7 p-0 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10"
                        title="Abrir enlace"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(link.id)}
                        className="h-7 w-7 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Eliminar enlace"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
