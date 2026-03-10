"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

// --- Data Types & Mappings ---
type Step = 'hero' | 'step1' | 'step2' | 'result';
type Industry = 'restaurant' | 'cafe' | 'retail' | null;

const LINKS = [
  { label: '오케이포스 공식몰', url: 'https://www.okposmall.co.kr/' },
  { label: '스마트스토어', url: 'https://smartstore.naver.com/tpay' },
  { label: '인스타그램', url: 'https://www.instagram.com/okpos_official/' },
  { label: '유튜브', url: 'https://www.youtube.com/@OKPOS_official' },
  { label: '블로그', url: 'https://blog.naver.com/okpos_official' },
];

const PROCESS = [
  { step: '01', title: '문의 접수', desc: '현재 대기 중이며 기초 환경을 파악합니다.' },
  { step: '02', title: '맞춤 제안', desc: '도출된 구성을 바탕으로 최적화된 견적을 안내합니다.' },
  { step: '03', title: '방문 설치', desc: '전국 직영망을 통해 전문 기사가 설치와 교육을 진행합니다.' },
];

// --- Animation Variants ---
const slideVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
};

export default function RecommendationEngine() {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(null);
  
  // 결과 상태 보관
  const [resultTitle, setResultTitle] = useState('');
  const [resultDesc, setResultDesc] = useState('');

  // --- Recommendation Logic ---
  const handleIndustrySelect = (ind: Industry) => {
    setSelectedIndustry(ind);
    if (ind === 'retail') {
      // 도소매/서비스업은 Step2 생략하고 바로 결과로
      setResultTitle('포스 + 네이버 커넥트 단말기');
      setResultDesc('빠르고 정확한 결제 환경을 위한 가장 직관적인 기본 패키지입니다.');
      setCurrentStep('result');
    } else {
      setCurrentStep('step2');
    }
  };

  const handleDetailSelect = (option: string) => {
    let title = '포스 + 네이버 커넥트 단말기';
    let desc = '';

    if (selectedIndustry === 'restaurant') {
      if (option === '배달 비중이 높음') {
        title += ' + 배달매니저 + 주방프린터';
        desc = '흩어진 배달 주문을 배달매니저로 한 번에 통합 관리하고, 주방프린터로 동선을 최소화하세요.';
      } else if (option === '소규모 홀 위주') {
        title += ' + QR오더';
        desc = '비싼 테이블오더 대신 저렴한 QR오더를 도입해 초기 비용을 확 낮추세요.';
      } else if (option === '대형 홀 위주') {
        title += ' + QR오더 + KDS(주방디스플레이)';
        desc = '수많은 테이블의 주문을 QR오더로 받고, KDS를 통해 주방으로 종이 영수증 없이 빠르고 정확하게 전달하세요.';
      }
    } else if (selectedIndustry === 'cafe') {
      title += ' + 키오스크 (또는 QR오더 키오스크 모드)';
      desc = '네이버 커넥트 단말기나 QR오더를 키오스크 모드로 활용해 좁은 공간에서도 결제 대기열을 해소하세요.';
    }

    setResultTitle(title);
    setResultDesc(desc);
    setCurrentStep('result');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#0056FF] selection:text-white pb-32">
      
      {/* Fixed Status Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-6 flex justify-center">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#F8FAFC]">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0056FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0056FF]"></span>
          </span>
          <span className="text-sm font-bold tracking-tight text-[#0056FF]">
            1688-4345 상담 연결 대기 중입니다
          </span>
        </div>
      </div>

      {/* Main Viewport for SPA Interaction */}
      <main className="w-full max-w-3xl mx-auto px-6 pt-12 md:pt-24 min-h-[70vh] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* [Screen A: Hero] */}
          {currentStep === 'hero' && (
            <motion.div key="hero" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <h1 className="text-5xl sm:text-7xl font-black tracking-[-0.05em] leading-[1.1] mb-8 break-keep text-[#0F172A]">
                매장에 가장 완벽한<br />
                포스 구성을<br />
                먼저 확인해보세요.
              </h1>
              <p className="text-xl sm:text-2xl text-gray-500 font-semibold tracking-tight mb-16 leading-relaxed">
                경우의 수를 계산하여<br className="sm:hidden"/> 가장 합리적인 구성을<br />
                단 1분 만에 찾아드립니다.
              </p>
              <button
                onClick={() => setCurrentStep('step1')}
                className="w-full min-h-[80px] bg-[#0056FF] hover:bg-blue-700 text-white text-2xl sm:text-3xl font-black rounded-3xl active:scale-[0.98] transition-all flex items-center justify-between px-8 sm:px-10 shadow-2xl shadow-blue-500/20"
              >
                <span>내 매장 맞춤 구성 찾기</span>
                <ArrowRight className="w-8 h-8" strokeWidth={3} />
              </button>
            </motion.div>
          )}

          {/* [Screen B: Step 1 - Industry] */}
          {currentStep === 'step1' && (
            <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <span className="text-[#0056FF] font-black text-xl tracking-tight mb-4 block">STEP 01</span>
              <h2 className="text-5xl sm:text-6xl font-black tracking-[-0.05em] mb-12">어떤 매장을 운영하시나요?</h2>
              <div className="flex flex-col gap-4">
                {[
                  { id: 'restaurant', label: '음식점' },
                  { id: 'cafe', label: '카페 / 베이커리' },
                  { id: 'retail', label: '도소매 / 서비스업' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleIndustrySelect(item.id as Industry)}
                    className="w-full min-h-[88px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-gray-200 rounded-3xl text-3xl font-black tracking-[-0.05em] text-left px-8 active:scale-[0.98] transition-transform text-[#0F172A]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* [Screen B: Step 2 - Details (Dynamic)] */}
          {currentStep === 'step2' && selectedIndustry === 'restaurant' && (
            <motion.div key="step2-rest" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <span className="text-[#0056FF] font-black text-xl tracking-tight mb-4 block">STEP 02</span>
              <h2 className="text-5xl sm:text-6xl font-black tracking-[-0.05em] mb-12 break-keep">주된 매장 운영 방식은 무엇인가요?</h2>
              <div className="flex flex-col gap-4">
                {['배달 비중이 높음', '소규모 홀 위주', '대형 홀 위주'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleDetailSelect(opt)}
                    className="w-full min-h-[88px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-gray-200 rounded-3xl text-2xl sm:text-3xl font-black tracking-[-0.05em] text-left px-8 active:scale-[0.98] transition-transform break-keep"
                  >
                    {opt === '소규모 홀 위주' ? '소규모 홀 위주 (직원 동선 짧음)' : opt === '대형 홀 위주' ? '대형 홀 위주 (테이블 많음)' : opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'step2' && selectedIndustry === 'cafe' && (
            <motion.div key="step2-cafe" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <span className="text-[#0056FF] font-black text-xl tracking-tight mb-4 block">STEP 02</span>
              <h2 className="text-5xl sm:text-6xl font-black tracking-[-0.05em] mb-12 break-keep">주문 결제 시 가장 고민되는 부분은?</h2>
              <div className="flex flex-col gap-4">
                {['바쁜 시간대 결제 대기줄', '공간이 좁아 큰 기기 부담'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleDetailSelect(opt)}
                    className="w-full min-h-[88px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-gray-200 rounded-3xl text-2xl sm:text-3xl font-black tracking-[-0.05em] text-left px-8 active:scale-[0.98] transition-transform break-keep"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* [Screen B: Step 3 - Result] */}
          {currentStep === 'result' && (
            <motion.div key="result" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-[#0056FF]">
                  <CheckCircle2 className="w-10 h-10" strokeWidth={3} />
                </div>
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em]">추천 구성 도출 완료</h2>
              </div>
              
              <div className="bg-[#0F172A] rounded-[40px] p-8 sm:p-12 mb-8 shadow-2xl">
                <span className="text-blue-400 font-bold tracking-widest text-sm mb-4 block">RECOMMENDED SETUP</span>
                <h3 className="text-3xl sm:text-4xl font-black text-white leading-snug tracking-[-0.05em] mb-6 break-keep">
                  {resultTitle}
                </h3>
                <p className="text-lg sm:text-xl text-gray-400 font-semibold leading-relaxed break-keep">
                  {resultDesc}
                </p>
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <p className="text-sm font-bold text-gray-500 mb-2">※ 기본 포함 사항</p>
                  <p className="text-base text-gray-300 font-medium">네이버 커넥트 단말기는 미니 키오스크 모드로도 완벽하게 활용 가능합니다.</p>
                </div>
              </div>

              {/* 추가 권장 서비스 */}
              <div className="bg-[#F8FAFC] border border-blue-100 rounded-3xl p-8 mb-12">
                <span className="text-[#0056FF] font-black text-lg tracking-tight mb-2 block">+ 추가하면 좋은 서비스</span>
                <h4 className="text-2xl font-black tracking-[-0.05em] mb-2 text-[#0F172A]">단골플러스 & 오늘얼마</h4>
                <p className="text-gray-500 font-semibold text-lg">가볍게 도입하여 포인트 관리(CRM)와 실시간 매출 관리를 한 번에 해결하세요.</p>
              </div>

              <button
                onClick={() => {
                   // 스크롤을 하단 채널 영역으로 유도하거나 완료 인지
                   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                className="w-full min-h-[80px] bg-[#0056FF] hover:bg-blue-700 text-white text-2xl font-black rounded-3xl active:scale-[0.98] transition-all"
              >
                확인 완료! (상담 대기 유지)
              </button>
              
              <button onClick={() => setCurrentStep('hero')} className="w-full py-6 mt-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">
                처음부터 다시하기
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* [Screen C: Process & Official Channels] - Only shows clearly after some interaction or scrolling */}
      <section className="max-w-3xl mx-auto px-6 mt-32 border-t border-gray-100 pt-32">
        <h2 className="text-5xl font-black tracking-[-0.05em] mb-20 text-[#0F172A]">도입 절차</h2>
        <div className="space-y-16 mb-32">
          {PROCESS.map((p) => (
            <div key={p.step} className="relative">
              <div className="absolute -top-10 -left-6 text-[120px] font-black text-gray-100/60 tracking-tighter leading-none select-none z-0">
                {p.step}
              </div>
              <div className="relative z-10 pl-6 border-l-4 border-[#0F172A]">
                <h3 className="text-3xl font-black tracking-[-0.05em] mb-4 text-[#0F172A]">{p.title}</h3>
                <p className="text-xl text-gray-500 font-semibold leading-relaxed break-keep">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-5xl font-black tracking-[-0.05em] mb-12 text-[#0F172A]">오케이포스<br/>공식 채널</h2>
        <div className="flex flex-col">
          {LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.url} 
              target="_blank" 
              rel="noreferrer"
              className="py-8 border-b border-gray-200 text-3xl font-black tracking-[-0.05em] text-[#0F172A] hover:text-[#0056FF] transition-colors flex items-center justify-between group"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-8 h-8 text-gray-300 group-hover:text-[#0056FF] transition-colors" />
            </a>
          ))}
        </div>
        <div className="mt-20 text-gray-400 font-bold tracking-tight">
          © OKPOS. All rights reserved.
        </div>
      </section>

    </div>
  );
}
