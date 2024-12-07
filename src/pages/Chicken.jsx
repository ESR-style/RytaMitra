import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { GiChicken, GiMoneyStack, GiChart } from 'react-icons/gi'
import { FaEgg } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const Chicken = () => {
  const { t } = useTranslation();
  const [poultryData, setPoultryData] = useState(null);

  useEffect(() => {
    fetchPoultryData();
  }, []);

  const fetchPoultryData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/livestock/chicken');
      const data = await response.json();
      if (data) {
        setPoultryData({
          totalBirds: data.count,
          dailyEggs: data.daily_production,
          monthlyRevenue: data.daily_production * 30 * 5, // assuming ₹5 per egg
          averagePerBird: data.daily_production / data.count
        });
      }
    } catch (err) {
      console.error('Error fetching poultry data:', err);
    }
  };

  const chartData = [
    { name: 'Mon', eggs: 39 },
    { name: 'Tue', eggs: 40 },
    { name: 'Wed', eggs: 41 },
    { name: 'Thu', eggs: 38 },
    { name: 'Fri', eggs: 40 },
    { name: 'Sat', eggs: 37 },
    { name: 'Sun', eggs: 38 },
  ]

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{t('animals.poultry.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiChicken className="text-4xl text-orange-600" />
            <div>
              <h3 className="text-gray-600">{t('animals.poultry.totalBirds')}</h3>
              <p className="text-2xl font-bold text-gray-800">{poultryData?.totalBirds}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <FaEgg className="text-4xl text-orange-600" />
            <div>
              <h3 className="text-gray-600">{t('animals.poultry.dailyEggs')}</h3>
              <p className="text-2xl font-bold text-gray-800">{poultryData?.dailyEggs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiMoneyStack className="text-4xl text-orange-600" />
            <div>
              <h3 className="text-gray-600">{t('animals.poultry.monthlyRevenue')}</h3>
              <p className="text-2xl font-bold text-gray-800">{poultryData?.monthlyRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <GiChart className="text-4xl text-orange-600" />
            <div>
              <h3 className="text-gray-600">{t('animals.poultry.averagePerBird')}</h3>
              <p className="text-2xl font-bold text-gray-800">{poultryData?.averagePerBird}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">{t('animals.poultry.weeklyOverview')}</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="eggs" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Chicken
