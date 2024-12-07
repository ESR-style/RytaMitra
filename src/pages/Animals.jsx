import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GiCow, GiChicken } from 'react-icons/gi'

const Animals = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Animal Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          onClick={() => navigate('/cow')}
          className="bg-white p-8 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-4">
            <GiCow className="text-5xl text-blue-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Dairy Management</h2>
              <p className="text-gray-600">Track milk production and revenue</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Daily Production</p>
              <p className="text-xl font-bold text-blue-600">250L</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Cows</p>
              <p className="text-xl font-bold text-blue-600">25</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/chicken')}
          className="bg-white p-8 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-4">
            <GiChicken className="text-5xl text-orange-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Poultry Management</h2>
              <p className="text-gray-600">Monitor egg production and health</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Daily Eggs</p>
              <p className="text-xl font-bold text-orange-600">400</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Birds</p>
              <p className="text-xl font-bold text-orange-600">500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Animals
