"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function LoanTracker() {
  const [activeTab, setActiveTab] = useState("all")

  // Data structure representing the loan information
  const loanData = [
    {
      moises: "150000 mil pesos",
      joseCastillo: "360000 mil pesos",
      barbara: "",
      joseJosbert: "50000 550 mil a 8 cuotas",
    },
    {
      moises: "Pago 100 mil",
      joseCastillo: "",
      barbara: "160000 Barbara pidio prestado 60 mil pesos el dia 02/09",
      joseJosbert: "Adelanto 150 mil pesos",
    },
    {
      moises: "980 50 mil pesos",
      joseCastillo: "Pago todo",
      barbara: "Pago todo los 60 mil",
      joseJosbert: "Quedando jose en 207",
    },
    {
      moises: "",
      joseCastillo: "280 mil pesos prestados (200 + 80 prestado)",
      barbara: "Compro 3 cosas en hites que dió: 94 mil pesos",
      joseJosbert: "Compro nevera: 296000 + 2070000 a 6 cuotas",
    },
    {
      moises: "",
      joseCastillo: "Presto 80 para el xbox",
      barbara: "Barbara pidio 10 mil pesos prestado",
      joseJosbert: "Quedando jose en 503000 mil pesos",
    },
    {
      moises: "mil pesos de un total de 222.000$ pesos",
      joseCastillo: "Total: 360 mil pesos",
      barbara: "Barbara pidio 20 pesos prestados Pagolos 20 mil",
      joseJosbert: "Prestamo 100000 quedando 603000",
    },
    {
      moises: "",
      joseCastillo: "Pago 80",
      barbara: "Pidio 50 mil pesos prestados Pago todo (50mil)",
      joseJosbert: "Pago 200 quedando en 400000",
    },
    {
      moises: "",
      joseCastillo: "Total: 280 mil pesos",
      barbara: "Pidio 35 mil pesos prestados",
      joseJosbert: "Pago 200 quedando en 200000",
    },
    {
      moises: "",
      joseCastillo: "Pago 200",
      barbara: "Piadio 15 mil pesos prestados Pago todo (15 mil)",
      joseJosbert: "pago 100 quedadon 100",
    },
    {
      moises: "",
      joseCastillo: "Total: 80 mil pesos",
      barbara: "",
      joseJosbert: "PAGO TODO",
    },
    {
      moises: "",
      joseCastillo: "Pago 80",
      barbara: "",
      joseJosbert: "Playstation 5 (Devuelto - reembolso)",
    },
    {
      moises: "",
      joseCastillo: "",
      barbara: "",
      joseJosbert: "180 Dolares",
    },
    {
      moises: "",
      joseCastillo: "Monto de la Cuota",
      barbara: "",
      joseJosbert: "",
    },
    {
      moises: "",
      joseCastillo: "$49,646 Pago",
      barbara: "",
      joseJosbert: "Jose presto 20 mill pesos (Pago todo)",
    },
    {
      moises: "",
      joseCastillo: "$49,646 Pago 05/01/2025",
      barbara: "",
      joseJosbert: "",
    },
    {
      moises: "",
      joseCastillo: "$49,646 Pago 06/02/2025",
      barbara: "",
      joseJosbert: "Pidio 50 mil pesos",
    },
    {
      moises: "",
      joseCastillo: "$49,646 Pago 06/03/2025",
      barbara: "",
      joseJosbert: "Jose pidio prestado 143 mil pesos (PRIMO) Pago todo",
    },
    {
      moises: "",
      joseCastillo: "$49,646",
      barbara: "",
      joseJosbert: "Jose 280 mil televisor",
    },
    {
      moises: "",
      joseCastillo: "$49,646",
      barbara: "",
      joseJosbert: "",
    },
    {
      moises: "",
      joseCastillo: "$49,646",
      barbara: "",
      joseJosbert: "",
    },
    {
      moises: "",
      joseCastillo: "$49,646",
      barbara: "",
      joseJosbert: "",
    },
    {
      moises: "",
      joseCastillo: "$49,646",
      barbara: "",
      joseJosbert: "",
    },
    {
      moises: "",
      joseCastillo: "$49,646",
      barbara: "",
      joseJosbert: "",
    },
    {
      moises: "",
      joseCastillo: "Pidio 100 prestado",
      barbara: "",
      joseJosbert: "",
    },
  ]

  // Function to highlight payment text
  const formatText = (text: string) => {
    if (text.toLowerCase().includes("pago todo")) {
      return <span className="text-green-500 font-medium">{text}</span>
    } else if (text.toLowerCase().includes("pago")) {
      return <span className="text-red-500 font-medium">{text}</span>
    } else {
      return text
    }
  }

  // Filter data based on active tab
  const getFilteredData = () => {
    if (activeTab === "all") return loanData

    const person = activeTab.toLowerCase()
    return loanData.filter((row) => {
      switch (person) {
        case "moises":
          return row.moises !== ""
        case "jose-castillo":
          return row.joseCastillo !== ""
        case "barbara":
          return row.barbara !== ""
        case "jose-josbert":
          return row.joseJosbert !== ""
        default:
          return true
      }
    })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="moises">Moises</TabsTrigger>
          <TabsTrigger value="jose-castillo">Jose Castillo</TabsTrigger>
          <TabsTrigger value="barbara">Barbara</TabsTrigger>
          <TabsTrigger value="jose-josbert">Jose/Josbert</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Moises</TableHead>
              <TableHead className="w-[200px]">Jose Castillo</TableHead>
              <TableHead className="w-[200px]">Barbara</TableHead>
              <TableHead className="w-[200px]">Jose/Josbert</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getFilteredData().map((row, index) => (
              <TableRow key={index}>
                <TableCell>{formatText(row.moises)}</TableCell>
                <TableCell>{formatText(row.joseCastillo)}</TableCell>
                <TableCell>{formatText(row.barbara)}</TableCell>
                <TableCell>
                  {row.joseJosbert.toLowerCase().includes("pago todo") ? (
                    <span className="text-green-500 font-bold">{row.joseJosbert}</span>
                  ) : row.joseJosbert.toLowerCase().includes("devuelto") ? (
                    <span>
                      Playstation 5{" "}
                      <Badge variant="outline" className="bg-yellow-100">
                        Devuelto - reembolso
                      </Badge>
                    </span>
                  ) : (
                    formatText(row.joseJosbert)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
