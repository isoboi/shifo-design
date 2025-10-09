import React from 'react';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export function NotFound({ onGoHome }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
              <FileQuestion className="w-16 h-16 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-blue-300 rounded-full opacity-50 animate-pulse delay-75"></div>
          </div>
        </div>

        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Страница не найдена
        </h2>

        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          К сожалению, страница, которую вы ищете, не существует или была перемещена
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onGoHome}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>На главную</span>
          </button>

          <button
            onClick={() => window.history.back()}
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Если вы считаете, что это ошибка, пожалуйста, свяжитесь с поддержкой
          </p>
        </div>
      </div>
    </div>
  );
}
