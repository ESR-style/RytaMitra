import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { GiCow, GiMilkCarton, GiMoneyStack, GiChart } from 'react-icons/gi'

const Cow = () => {
  const milkData = {
    totalCows: 25,
    dailyProduction: 250,
    monthlyRevenue: 75000,
    averagePerCow: 10
  }

  const chartData = [
    { name: 'Mon', production: 240 },
    { name: 'Tue', production: 250 },
    { name: 'Wed', production: 245 },
    { name: 'Thu', production: 260 },
    { name: 'Fri', production: 255 },
    { name: 'Sat', production: 240 },
    { name: 'Sun', production: 230 },
  ]

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dairy Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiCow className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-gray-600">Total Cows</h3>
              <p className="text-2xl font-bold text-gray-800">{milkData.totalCows}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiMilkCarton className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-gray-600">Daily Production (L)</h3>
              <p className="text-2xl font-bold text-gray-800">{milkData.dailyProduction}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiMoneyStack className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-gray-600">Monthly Revenue (₹)</h3>
              <p className="text-2xl font-bold text-gray-800">{milkData.monthlyRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiChart className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-gray-600">Average per Cow (L)</h3>
              <p className="text-2xl font-bold text-gray-800">{milkData.averagePerCow}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Weekly Production Overview</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="production" stroke="#2563eb" fill="#93c5fd" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Cow
