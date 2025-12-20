"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const breakdownData = [
  {
    period: "Dic 2024",
    won: 8,
    lost: 3,
    newDeals: 15,
    winRate: "73%",
    pipeline: "$890K",
  },
  {
    period: "Nov 2024",
    won: 6,
    lost: 5,
    newDeals: 13,
    winRate: "55%",
    pipeline: "$674K",
  },
  {
    period: "Oct 2024",
    won: 4,
    lost: 3,
    newDeals: 11,
    winRate: "57%",
    pipeline: "$523K",
  },
]

export function DetailedBreakdown() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Detailed Breakdown</h2>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead className="text-right">Deals Won</TableHead>
              <TableHead className="text-right">Deals Lost</TableHead>
              <TableHead className="text-right">New Deals</TableHead>
              <TableHead className="text-right">Win Rate</TableHead>
              <TableHead className="text-right">Pipeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breakdownData.map((row) => (
              <TableRow key={row.period}>
                <TableCell className="font-medium">{row.period}</TableCell>
                <TableCell className="text-right text-green-500 font-medium">{row.won}</TableCell>
                <TableCell className="text-right text-red-500 font-medium">{row.lost}</TableCell>
                <TableCell className="text-right">{row.newDeals}</TableCell>
                <TableCell className="text-right font-medium">{row.winRate}</TableCell>
                <TableCell className="text-right font-semibold">{row.pipeline}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
