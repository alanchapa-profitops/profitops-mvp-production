"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const dealsPerWeekData = [
  { week: "Sem 1", won: 2, lost: 1, added: 4 },
  { week: "Sem 2", won: 3, lost: 1, added: 5 },
  { week: "Sem 3", won: 2, lost: 0, added: 3 },
  { week: "Sem 4", won: 1, lost: 1, added: 3 },
]

const pipelineByMonthData = [
  { month: "Oct", value: 523 },
  { month: "Nov", value: 674 },
  { month: "Dic", value: 890 },
]

const winRateByStageData = [
  { stage: "Prospección", value: 65, color: "#3b82f6" },
  { stage: "Discovery", value: 75, color: "#8b5cf6" },
  { stage: "Propuesta", value: 80, color: "#10b981" },
  { stage: "Negociación", value: 70, color: "#f59e0b" },
  { stage: "Cierre", value: 85, color: "#06b6d4" },
]

const activitiesData = [
  { month: "Oct", programadas: 42, completadas: 38 },
  { month: "Nov", programadas: 48, completadas: 45 },
  { month: "Dic", programadas: 55, completadas: 51 },
]

export function VisualCharts() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Visual Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Deals per Week Line Chart */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Deals por Semana</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dealsPerWeekData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="won" stroke="#10b981" name="Ganados" strokeWidth={2} />
                <Line type="monotone" dataKey="lost" stroke="#ef4444" name="Perdidos" strokeWidth={2} />
                <Line type="monotone" dataKey="added" stroke="#3b82f6" name="Agregados" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Pipeline Value Bar Chart */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Pipeline Value por Mes</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pipelineByMonthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value) => `$${value}K`}
                />
                <Bar dataKey="value" fill="#3b82f6" name="Pipeline Value" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Win Rate Donut Chart */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Win Rate por Etapa</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={winRateByStageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => `${entry.value}%`}
                >
                  {winRateByStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Activities Bar Chart */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Actividades: Programadas vs Completadas</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activitiesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar dataKey="programadas" fill="#8b5cf6" name="Programadas" />
                <Bar dataKey="completadas" fill="#10b981" name="Completadas" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  )
}
