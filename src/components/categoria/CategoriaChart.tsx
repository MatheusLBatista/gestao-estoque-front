"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import type { ChartDataItem } from "@/types/Categorias"

interface CategoriaChartProps {
  data: ChartDataItem[]
  titulo: string
  descricao: string
  corEntrada?: string
  corSaida?: string
  categoria: string
}

export function CategoriaChart({
  data,
  titulo,
  descricao,
  corEntrada = "#0A2852",
  corSaida = "#97BDF2",
  categoria
}: CategoriaChartProps) {
  const chartConfig = {
    entradas: {
      label: "Entradas",
      color: corEntrada,
    },
    saidas: {
      label: "Saídas",
      color: corSaida,
    },
  } satisfies ChartConfig

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 'auto']}
              tickCount={10}
              tickFormatter={(value) => value.toString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="entradas"
              type="linear"
              stroke={corEntrada}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="saidas"
              type="linear"
              stroke={corSaida}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
