import React from 'react';

export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-9 bg-gray-200 rounded-lg w-64"></div>
        <div className="flex items-center space-x-3">
          <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-4"></div>
                </th>
                <th className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-36"></div>
                </th>
                <th className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </th>
                <th className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </th>
                <th className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </th>
                <th className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </th>
                <th className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(8)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-4"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-36"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
