import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  [key: string]: any; // ← AGREGAR esta línea para solucionar el error de ChartDataInput
}

interface CategoryFilterProps {
  data: CategoryData[];
  title: string;
  colors: string[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ data, title, colors }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredData = selectedCategories.length > 0 
    ? data.filter(item => selectedCategories.includes(item.category))
    : data;

  // ← CORREGIR el CustomTooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.category}</p>
          <p className="text-sm text-gray-600">
            ${Number(data.amount).toLocaleString()} ({Number(data.percentage).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={() => setSelectedCategories([])}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Mostrar Todas
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {data.map((item, index) => (
          <button
            key={item.category}
            onClick={() => toggleCategory(item.category)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              selectedCategories.includes(item.category) || selectedCategories.length === 0
                ? `bg-blue-100 border-blue-300 text-blue-700`
                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              {item.category}
            </div>
          </button>
        ))}
      </div>

      {/* Chart - CORREGIR la función label */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="amount"
            label={({ category, percentage }: any) => `${category} ${Number(percentage).toFixed(1)}%`}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Category List */}
      <div className="mt-6 space-y-2">
        {filteredData.slice(0, 5).map((item, index) => (
          <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="font-medium text-gray-900">{item.category}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                ${item.amount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;