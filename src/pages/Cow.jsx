import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { GiCow, GiMilkCarton, GiMoneyStack, GiChart } from 'react-icons/gi'
import { FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const Cow = () => {
  const { t } = useTranslation();
  const [milkData, setMilkData] = useState({
    totalCows: 0,
    dailyProduction: 0,
    monthlyRevenue: 0,
    averagePerCow: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCowData, setNewCowData] = useState({
    count: 1,
    dailyProduction: 0
  });

  useEffect(() => {
    fetchCowData();
  }, []);

  const fetchCowData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/livestock/cow');
      const data = await response.json();
      if (data) {
        setMilkData({
          totalCows: data.count,
          dailyProduction: data.daily_production,
          monthlyRevenue: data.daily_production * 30 * 60, // assuming ₹60 per liter
          averagePerCow: data.daily_production / data.count
        });
      }
    } catch (err) {
      console.error('Error fetching cow data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/livestock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'cow',
          count: parseInt(newCowData.count),
          dailyProduction: parseFloat(newCowData.dailyProduction)
        }),
      });
      if (response.ok) {
        fetchCowData();
        setShowAddForm(false);
        setNewCowData({ count: 1, dailyProduction: 0 });
      }
    } catch (err) {
      console.error('Error adding cow data:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('animals.dairy.deleteConfirm'))) {
      try {
        const response = await fetch('http://localhost:5000/api/livestock/cow', {
          method: 'DELETE',
        });
        if (response.ok) {
          setMilkData({
            totalCows: 0,
            dailyProduction: 0,
            monthlyRevenue: 0,
            averagePerCow: 0
          });
        }
      } catch (err) {
        console.error('Error deleting cow data:', err);
      }
    }
  };

  const chartData = [
    { name: 'Mon', production: 48 },
    { name: 'Tue', production: 50 },
    { name: 'Wed', production: 45 },
    { name: 'Thu', production: 52 },
    { name: 'Fri', production: 49 },
    { name: 'Sat', production: 47 },
    { name: 'Sun', production: 46 },
  ]

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('animals.dairy.title')}</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {t('animals.dairy.addNew')}
          </button>
          {milkData.totalCows > 0 && (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <FaTrash /> {t('animals.dairy.delete')}
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('animals.dairy.addNewCow')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('animals.dairy.count')}</label>
              <input
                type="number"
                value={newCowData.count}
                onChange={(e) => setNewCowData({...newCowData, count: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('animals.dairy.production')}</label>
              <input
                type="number"
                value={newCowData.dailyProduction}
                onChange={(e) => setNewCowData({...newCowData, dailyProduction: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {t('common.save')}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiCow className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-gray-600">{t('animals.dairy.totalCows')}</h3>
              <p className="text-2xl font-bold text-gray-800">{milkData.totalCows}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiMilkCarton className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-gray-600">{t('animals.dairy.dailyProduction')}</h3>
              <p className="text-2xl font-bold text-gray-800">{milkData.dailyProduction}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiMoneyStack className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-gray-600">{t('animals.dairy.monthlyRevenue')}</h3>
              <p className="text-2xl font-bold text-gray-800">{milkData.monthlyRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiChart className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-gray-600">{t('animals.dairy.averagePerCow')}</h3>
              <p className="text-2xl font-bold text-gray-800">{milkData.averagePerCow}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">{t('animals.dairy.weeklyOverview')}</h2>
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
