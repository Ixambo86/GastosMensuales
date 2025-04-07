// src/components/GraficoGastos.jsx


import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#8884D8', '#FF4D4D', '#4DD0E1']

export default function GraficoGastos({ gastos }) {
  const resumenPorCategoria = gastos.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto
    return acc
  }, {})

  const data = Object.entries(resumenPorCategoria).map(([categoria, monto]) => ({
    name: categoria,
    value: monto,
  }))

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full h-96">
      <h2 className="text-xl font-semibold mb-4">📊 Gastos por Categoría</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
