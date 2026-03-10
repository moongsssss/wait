import React from 'react';

// 업종 데이터
const industries = [
  { id: 'restaurant', name: '음식점', icon: '🍽️' },
  { id: 'cafe', name: '카페', icon: '☕' },
  { id: 'retail', name: '도소매', icon: '🛍️' },
  { id: 'service', name: '서비스', icon: '💇' },
];

export default function Home() {
  return (
    <div className="bg-white text-gray-900 font-sans selection:bg-blue-100">
      {/* 1. Hero Section */}
      <header className="px-6 pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col items-center text-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black leading-tight mb-8">
            매장에 맞는 POS 구성을<br />먼저 확인해보세요
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-12">
            오케이포스는 매장 흐름에 맞춰 구성할 수 있습니다.<br className="hidden md:block" />
            상담 전 핵심 내용을 먼저 확인하시면 더 빠르게 안내받으실 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-5 bg-[#007AFF] text-white font-bold rounded-2xl hover:bg-[#0062CC] transition-all active:scale-95 shadow-lg shadow-blue-500/20">
              구성 확인하기
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95">
              도입 체크리스트
            </button>
          </div>
        </div>
      </header>

      {/* 2. Industry Selector Section */}
      <section className="px-6 py-24 md:py-32 bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">어떤 업종을 준비하시나요?</h2>
            <p className="text-gray-500">업종에 최적화된 추천 구성을 확인하실 수 있습니다.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {industries.map((item) => (
              <button
                key={item.id}
                className="group p-8 md:p-10 bg-white border border-gray-100 rounded-[28px] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all text-center flex flex-col items-center gap-4 active:scale-95 cursor-pointer"
              >
                <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 영역 (임시) */}
      <footer className="px-6 py-20 text-center text-gray-400 text-sm">
        © OKPOS. All rights reserved.
      </footer>
    </div>
  );
}
