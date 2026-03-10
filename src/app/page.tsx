"use client";

import React, { useState } from 'react';

// Data
const INDUSTRIES = [
  { id: 'restaurant', name: '음식점', desc: '테이블오더와 주방의 완벽한 동기화.' },
  { id: 'cafe', name: '카페', desc: '초당 결제 처리량의 극대화와 진동벨 연동.' },
  { id: 'retail', name: '유통', desc: '방대한 재고 데이터의 실시간 추적.' },
  { id: 'service', name: '서비스', desc: '고객 예약과 포인트 제도의 유기적 결합.' },
];

const PROCESS = [
  { step: '01', title: '상담 접수', desc: '현재 대기 상태에서 시스템이 사전 정보를 수집합니다.' },
  { step: '02', title: '환경 분석', desc: '수집된 정보를 바탕으로 매장 환경을 진단합니다.' },
  { step: '03', title: '솔루션 제안', desc: '최적화된 포스 및 키오스크 구성을 제안받습니다.' },
  { step: '04', title: '구축 및 교육', desc: '전문 엔지니어가 방문하여 설치와 교육을 진행합니다.' },
];

const FAQS = [
  { q: "가입비나 설치비가 별도로 청구됩니까?", a: "기본 설치비는 무상으로 제공되며, 특수 환경의 경우 사전 고지 후 진행됩니다." },
  { q: "기존에 사용하던 장비와 호환이 가능합니까?", a: "대부분의 범용 규격 장비와 호환이 가능합니다. 상세 모델은 상담 시 확인 바랍니다." },
  { q: "사후 관리 정책은 어떻게 됩니까?", a: "전국 직영 인프라를 통해 신속한 현장 대응 및 24시간 원격 지원을 제공합니다." },
  { q: "약정 기간 내 해지 시 위약금이 발생합니까?", a: "약정 조건에 따라 위약금이 발생할 수 있으며, 계약 시 투명하게 고지합니다." }
];

const TABS = [
  { id: 'hero', label: '시작하기' },
  { id: 'industry', label: '업종별 솔루션' },
  { id: 'checklist', label: '환경 분석' },
  { id: 'process', label: '도입 절차' },
  { id: 'faq', label: 'FAQ' }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('hero');
  const [step, setStep] = useState(1);
  const [checklist, setChecklist] = useState({ type: '', features: [] as string[] });

  const handleTypeSelect = (type: string) => {
    setChecklist({ ...checklist, type });
    setStep(2);
  };

  const toggleFeature = (feature: string) => {
    const features = checklist.features.includes(feature)
      ? checklist.features.filter(f => f !== feature)
      : [...checklist.features, feature];
    setChecklist({ ...checklist, features });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased flex flex-col selection:bg-[#0066FF] selection:text-white overflow-hidden">
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="font-black text-2xl tracking-tighter cursor-pointer"
            onClick={() => setActiveTab('hero')}
          >
            OKPOS
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-lg font-bold tracking-tight transition-colors ${
                  activeTab === tab.id ? 'text-[#0066FF]' : 'text-gray-400 hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="md:hidden text-[#0066FF] font-bold">
             상담 대기 중
          </div>
        </div>
        
        {/* Mobile Menu Scrollable */}
        <div className="md:hidden flex overflow-x-auto px-6 py-3 gap-6 hide-scrollbar border-t border-gray-50">
           {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-bold tracking-tight whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'text-[#0066FF]' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      </nav>

      {/* Main Content Area (Click based) */}
      <main className="flex-1 pt-32 pb-32 flex flex-col justify-center items-center px-6 animate-in fade-in zoom-in-95 duration-300">
        
        {activeTab === 'hero' && (
          <div className="w-full max-w-5xl text-center space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm font-bold text-[#0066FF] mx-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] animate-pulse"></span>
              현재 상담 대기 중입니다
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.05em] leading-[1.05] text-[#111111] break-keep">
              매장에 맞는 구성을<br />먼저 확인해보세요.
            </h1>
            <p className="text-2xl md:text-3xl text-gray-400 font-semibold tracking-tight leading-snug">
              위 메뉴를 클릭하여 핵심 정보를 확인하시면,<br className="hidden md:block"/>
              연결 즉시 가장 정확한 안내를 받으실 수 있습니다.
            </p>
            <div className="pt-10">
              <button 
                onClick={() => setActiveTab('checklist')}
                className="px-12 py-6 bg-[#111111] text-white text-2xl font-black tracking-tight hover:bg-[#0066FF] transition-colors"
              >
                환경 분석 시작하기
              </button>
            </div>
          </div>
        )}

        {activeTab === 'industry' && (
          <div className="w-full max-w-7xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] mb-16 text-center">
              어떤 업종을 준비하십니까.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INDUSTRIES.map((item) => (
                <div key={item.id} className="p-12 md:p-16 border-2 border-gray-100 hover:border-[#111111] transition-colors group cursor-pointer bg-white">
                  <h3 className="text-4xl font-black tracking-[-0.05em] mb-6 text-[#111111]">{item.name}</h3>
                  <p className="text-gray-500 font-semibold text-xl leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="w-full max-w-5xl bg-[#111111] text-white p-10 md:p-20">
            <div className="flex gap-2 mb-20">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-2 flex-1 ${step >= s ? 'bg-[#0066FF]' : 'bg-[#333]'}`} />
              ))}
            </div>

            {step === 1 && (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-3xl md:text-5xl font-black tracking-[-0.05em] mb-16">Q1. 매장의 현재 상태는 어떠합니까?</h3>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button onClick={() => handleTypeSelect('신규')} className="flex-1 py-10 px-8 bg-[#222] hover:bg-[#0066FF] transition-colors text-3xl font-black tracking-tight text-left">
                    신규 창업입니다.
                  </button>
                  <button onClick={() => handleTypeSelect('교체')} className="flex-1 py-10 px-8 bg-[#222] hover:bg-[#0066FF] transition-colors text-3xl font-black tracking-tight text-left">
                    기존 장비 교체입니다.
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-3xl md:text-5xl font-black tracking-[-0.05em] mb-16">Q2. 가장 도입하고 싶은 기능은 무엇입니까?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                  {['테이블오더', '키오스크', '재고관리 시스템', '고객 포인트/예약'].map((feature) => (
                    <button 
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={`py-8 px-8 text-2xl font-bold tracking-tight text-left border-2 ${
                        checklist.features.includes(feature) ? 'bg-[#0066FF] border-[#0066FF]' : 'bg-[#222] border-transparent hover:border-gray-500'
                      } transition-colors`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setStep(3)}
                  disabled={checklist.features.length === 0}
                  className="w-full py-8 bg-white text-[#111111] font-black text-3xl tracking-tight disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  다음 단계로
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center animate-in fade-in duration-500 py-10">
                <div className="text-7xl font-black text-[#0066FF] mb-12">✓</div>
                <h3 className="text-5xl md:text-6xl font-black tracking-[-0.05em] mb-8">분석이 완료되었습니다.</h3>
                <p className="text-2xl text-gray-400 font-bold tracking-tight mb-16">입력하신 정보는 상담원에게 실시간으로 공유됩니다.</p>
                <button 
                  onClick={() => { setStep(1); setChecklist({ type: '', features: [] }); }}
                  className="px-12 py-5 bg-transparent border-2 border-gray-600 text-white font-bold text-xl tracking-tight hover:bg-white hover:text-[#111111] transition-colors"
                >
                  다시 시작하기
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'process' && (
          <div className="w-full max-w-6xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] mb-24 text-center">
              단순하고 명확한 절차.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
              {PROCESS.map((p, idx) => (
                <div key={idx} className="flex gap-8 items-start p-8 bg-gray-50">
                  <div className="text-6xl font-black text-[#0066FF] tracking-tighter leading-none mt-[-4px]">{p.step}</div>
                  <div>
                    <h3 className="text-3xl font-black tracking-[-0.05em] mb-4 text-[#111111]">{p.title}</h3>
                    <p className="text-xl text-gray-500 font-semibold leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="w-full max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] mb-20 text-center">
              자주 묻는 질문.
            </h2>
            <div className="border-t-2 border-[#111111]">
              {FAQS.map((faq, idx) => (
                <details key={idx} className="group py-10 border-b border-gray-200 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex justify-between items-center text-2xl md:text-3xl font-black tracking-[-0.05em] outline-none">
                    {faq.q}
                    <span className="text-4xl font-light text-[#0066FF] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="mt-6 text-xl text-gray-500 font-semibold leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer / Sticky CTA replacement */}
      <div className="mt-auto border-t border-gray-100 bg-[#F9F9F9] p-6 text-center">
         <p className="text-xl text-gray-400 font-bold tracking-tight">상담 및 도입 문의 <strong className="text-[#111111] text-2xl ml-2">1588-0000</strong></p>
      </div>

    </div>
  );
}