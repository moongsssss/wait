import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center bg-white">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
          매장에 맞는 POS 구성을<br />먼저 확인해보세요
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
          오케이포스는 매장 흐름에 맞춰 구성할 수 있습니다.<br className="hidden md:block" />
          상담 전 핵심 내용을 먼저 확인하시면 더 빠르게 안내받으실 수 있습니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200">
            업종별 구성 보기
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200">
            도입 전 체크사항 보기
          </button>
        </div>
      </div>
    </main>
  );
}