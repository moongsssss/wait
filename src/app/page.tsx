"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, HelpCircle, Link2, ChevronRight, X } from 'lucide-react';

// --- Data ---
const INDUSTRIES = [
  { 
    id: 'restaurant', 
    name: '음식점', 
    setup: '포스 + 주방프린터 + 테이블오더', 
    desc: '주문 누락을 원천 차단하고 주방과 홀의 소통을 극대화하는 가장 완벽한 식당 구성입니다.' 
  },
  { 
    id: 'cafe', 
    name: '카페 / 베이커리', 
    setup: '포스 + 진동벨 + 키오스크', 
    desc: '회전율이 생명인 카페 환경에 맞춰, 주문 대기열을 줄이고 초고속 결제를 지원하는 구성입니다.' 
  },
  { 
    id: 'retail', 
    name: '도소매 / 유통', 
    setup: '포스 + 바코드 스캐너', 
    desc: '방대한 상품의 실시간 재고 관리와 빠르고 정확한 바코드 결제 처리에 최적화되었습니다.' 
  },
  { 
    id: 'service', 
    name: '서비스 / 뷰티', 
    setup: '포스 + 고객용 모니터', 
    desc: '고객과 함께 예약 내역을 확인하고, 포인트 적립 현황을 직관적으로 보여주는 신뢰형 구성입니다.' 
  },
];

const PROCESS = [
  { step: '01', title: '상담 연결', desc: '현재 대기 중이며, 곧 전문 상담원과 연결됩니다.' },
  { step: '02', title: '환경 분석', desc: '매장 평수와 업종에 맞춘 최적의 구성을 확인합니다.' },
  { step: '03', title: '맞춤 견적', desc: '필요한 기기만 선별하여 투명한 견적을 안내합니다.' },
  { step: '04', title: '방문 설치', desc: '전국 직영망을 통해 전문 기사가 방문하여 세팅합니다.' },
];

const FAQS = [
  { q: "가입비나 설치비가 발생하나요?", a: "기본 설치비는 전액 지원됩니다. 단, 배선 공사 등 특수 환경의 경우 사전 고지 후 진행됩니다." },
  { q: "기존에 쓰던 장비와 호환 되나요?", a: "대부분의 표준 규격 장비는 호환 가능합니다. 상담 시 사용 중인 기기 모델을 알려주시면 정확합니다." },
  { q: "사용 중 고장 나면 어떻게 하나요?", a: "365일 24시간 원격 지원 센터를 운영하며, 필요 시 전국 직영 AS팀이 즉각 현장으로 출동합니다." },
];

const LINKS = [
  { label: '공식몰 (장비 둘러보기)', url: 'https://www.okposmall.co.kr/' },
  { label: '스마트스토어', url: 'https://smartstore.naver.com/tpay' },
  { label: '인스타그램', url: 'https://www.instagram.com/okpos_official/' },
  { label: '유튜브 채널', url: 'https://www.youtube.com/@OKPOS_official' },
];

const TABS = [
  { id: 'home', icon: Home, label: '추천구성' },
  { id: 'process', icon: Info, label: '도입절차' },
  { id: 'faq', icon: HelpCircle, label: 'FAQ' },
  { id: 'links', icon: Link2, label: '공식채널' },
];

// --- Animation ---
const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

export default function HomeApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedIndustry, setSelectedIndustry] = useState<typeof INDUSTRIES[0] | null>(null);

  return (
    <div className="h-[100dvh] w-full bg-[#FFFFFF] text-[#111111] font-sans overflow-hidden flex flex-col selection:bg-[#0066FF] selection:text-white">
      
      {/* Top Status Bar (Fixed) */}
      <header className="flex-shrink-0 pt-12 pb-6 px-6 flex flex-col items-center border-b border-gray-100 bg-white z-20">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F5F5F7] mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0066FF]"></span>
          </span>
          <span className="text-sm font-bold tracking-tight text-[#0066FF]">
            1688-4345 상담 연결 대기 중
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-[-0.05em] text-center leading-tight">
          매장에 맞는 솔루션을<br />먼저 확인해보세요.
        </h1>
      </header>

      {/* Main Content Area (Scrollable internally if needed, but mostly fits) */}
      <main className="flex-1 relative overflow-y-auto bg-white pb-24 hide-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: 추천 구성 (Home) */}
          {activeTab === 'home' && (
             <motion.div key="home" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6 h-full flex flex-col">
               {!selectedIndustry ? (
                 <>
                   <h2 className="text-xl font-bold tracking-[-0.05em] text-gray-400 mb-6">
                     어떤 매장을 운영하시나요?
                   </h2>
                   <div className="flex flex-col gap-3">
                     {INDUSTRIES.map((ind) => (
                       <button
                         key={ind.id}
                         onClick={() => setSelectedIndustry(ind)}
                         className="flex items-center justify-between w-full p-6 bg-[#F9F9F9] hover:bg-gray-100 active:scale-[0.98] transition-all rounded-3xl text-left border border-transparent hover:border-gray-200"
                       >
                         <span className="text-2xl font-black tracking-[-0.05em] text-[#111111]">{ind.name}</span>
                         <ChevronRight className="text-gray-400" />
                       </button>
                     ))}
                   </div>
                 </>
               ) : (
                 <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                   <button 
                     onClick={() => setSelectedIndustry(null)}
                     className="self-end p-2 bg-gray-100 rounded-full mb-4 active:scale-90 transition-transform"
                   >
                     <X className="w-6 h-6 text-gray-600" />
                   </button>
                   <div className="flex-1 flex flex-col justify-center text-center px-4">
                     <span className="text-[#0066FF] font-black tracking-tighter text-xl mb-4">{selectedIndustry.name} 추천 구성</span>
                     <h3 className="text-4xl font-black tracking-[-0.05em] mb-8 leading-tight break-keep">
                       {selectedIndustry.setup}
                     </h3>
                     <p className="text-lg text-gray-500 font-semibold leading-relaxed break-keep">
                       {selectedIndustry.desc}
                     </p>
                     <div className="mt-12 p-6 bg-[#F9F9F9] rounded-3xl border border-gray-100">
                       <p className="text-sm font-bold text-gray-400">
                         상담원 연결 시 위 구성을 말씀해주시면<br/>더욱 빠른 안내가 가능합니다.
                       </p>
                     </div>
                   </div>
                 </div>
               )}
             </motion.div>
          )}

          {/* TAB 2: 도입 절차 (Process) */}
          {activeTab === 'process' && (
            <motion.div key="process" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6">
              <h2 className="text-xl font-bold tracking-[-0.05em] text-gray-400 mb-8">
                단순하고 명확한 절차
              </h2>
              <div className="space-y-10">
                {PROCESS.map((p) => (
                  <div key={p.step} className="flex gap-6 items-start">
                    <div className="text-4xl font-black text-gray-200 tracking-tighter leading-none mt-1">
                      {p.step}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-[-0.05em] mb-2 text-[#111111]">{p.title}</h3>
                      <p className="text-gray-500 font-semibold leading-snug">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === 'faq' && (
            <motion.div key="faq" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6">
              <h2 className="text-xl font-bold tracking-[-0.05em] text-gray-400 mb-6">
                자주 묻는 질문
              </h2>
              <div className="border-t-2 border-[#111111]">
                {FAQS.map((faq, idx) => (
                  <details key={idx} className="group py-6 border-b border-gray-100 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex justify-between items-center outline-none">
                      <span className="text-lg font-black tracking-[-0.05em] pr-4 leading-tight">{faq.q}</span>
                      <ChevronRight className="w-6 h-6 text-gray-300 group-open:rotate-90 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="mt-4 text-base text-gray-500 font-semibold leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: 공식 채널 (Links) */}
          {activeTab === 'links' && (
            <motion.div key="links" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6 h-full flex flex-col">
              <h2 className="text-xl font-bold tracking-[-0.05em] text-gray-400 mb-6">
                오케이포스 공식 채널
              </h2>
              <div className="flex flex-col gap-3">
                {LINKS.map((link) => (
                  <a 
                    key={link.label} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between w-full p-6 bg-[#111111] active:bg-[#333333] transition-colors rounded-3xl"
                  >
                    <span className="text-xl font-black tracking-[-0.05em] text-white">{link.label}</span>
                    <Link2 className="text-gray-400 w-5 h-5" />
                  </a>
                ))}
              </div>
              <div className="mt-auto pt-10 text-center text-xs font-bold text-gray-300">
                © OKPOS. All rights reserved.
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Tab Bar (Fixed) */}
      <nav className="flex-shrink-0 h-[88px] bg-white border-t border-gray-100 flex justify-around items-center px-2 pb-safe">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedIndustry(null); // 탭 이동시 선택 초기화
              }}
              className="flex flex-col items-center justify-center w-full h-full gap-1.5 active:scale-95 transition-transform"
            >
              <Icon 
                className={`w-6 h-6 transition-colors ${isActive ? 'text-[#111111]' : 'text-gray-300'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[11px] font-bold tracking-tight transition-colors ${isActive ? 'text-[#111111]' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}