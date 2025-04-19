import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DebtTracker() {
  // Datos exactos de la hoja de cálculo
  const debtData = [
    {
      moises: "150000 mil pesos",
      joseCastillo: "360000 mil pesos",
      barbara: "Barbara",
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
      barbara: "Barbara pidio 20 pesos prestados Pagolos 20 miñ",
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

  // Función para formatear el texto con colores según el contenido
  const formatText = (text: string) => {
    if (text.toLowerCase().includes("pago todo")) {
      return <span className="text-green-600 font-medium">{text}</span>
    } else if (text.toLowerCase().includes("pago ")) {
      return <span className="text-red-500 font-medium">{text}</span>
    } else if (text.toUpperCase() === "PAGO TODO") {
      return <span className="text-green-600 font-bold uppercase">{text}</span>
    } else if (text.toLowerCase().includes("devuelto")) {
      return <span className="text-orange-500 font-medium">{text}</span>
    } else {
      return text
    }
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-bold">Moises</TableHead>
            <TableHead className="font-bold">Jose Castillo</TableHead>
            <TableHead className="font-bold">Barbara</TableHead>
            <TableHead className="font-bold">Jose/Josbert</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debtData.map((row, index) => (
            <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <TableCell>{formatText(row.moises)}</TableCell>
              <TableCell>{formatText(row.joseCastillo)}</TableCell>
              <TableCell>{formatText(row.barbara)}</TableCell>
              <TableCell>{formatText(row.joseJosbert)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
