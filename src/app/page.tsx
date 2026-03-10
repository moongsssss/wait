"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronLeft, CheckSquare, Square } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Data ---
type Step = 'hero' | 'step1' | 'step2A' | 'step2B' | 'step3' | 'result';

interface Selections {
  type: string;
  operation?: string;
  special?: string;
  hardware: string[];
}

const LINKS = [
  { label: '공식몰', url: 'https://www.okposmall.co.kr/' },
  { label: '스마트스토어', url: 'https://smartstore.naver.com/tpay' },
  { label: '인스타그램', url: 'https://www.instagram.com/okpos_official/' },
  { label: '유튜브', url: 'https://www.youtube.com/@OKPOS_official' },
  { label: '블로그', url: 'https://blog.naver.com/okpos_official' },
];

const PROCESS = [
  { step: '01', title: '문의 접수', desc: '현재 대기 중이며 기초 환경을 파악합니다.' },
  { step: '02', title: '맞춤 제안', desc: '도출된 구성을 바탕으로 최적화된 견적을 안내합니다.' },
  { step: '03', title: '설치 완료', desc: '전국 직영망을 통해 전문 기사가 설치를 진행합니다.' },
];

// --- Animations ---
const slideVariants = {
  initial: { opacity: 0, x: 20, y: 10 },
  animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -20, y: -10, transition: { duration: 0.3 } }
};

export default function RecommendationEngine() {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [history, setHistory] = useState<Step[]>([]);
  const [selections, setSelections] = useState<Selections>({ type: '', hardware: [] });
  const [result, setResult] = useState({ title: '', items: [] as string[], reason: '' });

  // --- Logic Engine ---
  const goToStep = (nextStep: Step) => {
    setHistory(prev => [...prev, currentStep]);
    setCurrentStep(nextStep);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevStep = newHistory.pop()!;
    setHistory(newHistory);
    setCurrentStep(prevStep);
  };

  const handleStep1 = (type: string) => {
    setSelections(prev => ({ ...prev, type, operation: undefined, special: undefined, hardware: [] }));
    
    if (type === 'A') goToStep('step2A'); // 일반 홀
    else if (type === 'B') calculateResult('B'); // 배달 전문
    else if (type === 'C') calculateResult('C'); // 테이크아웃
    else if (type === 'D') goToStep('step2B'); // 유통/서비스
    else if (type === 'E') calculateResult('E'); // 특수 매장
  };

  const handleStep2A = (operation: string) => {
    setSelections(prev => ({ ...prev, operation }));
    goToStep('step3'); // 하드웨어 다중선택으로 이동
  };

  const handleStep2B = (special: string) => {
    setSelections(prev => ({ ...prev, special }));
    goToStep('step3'); // 하드웨어 다중선택으로 이동
  };

  const toggleHardware = (hw: string) => {
    setSelections(prev => {
      const exists = prev.hardware.includes(hw);
      return {
        ...prev,
        hardware: exists ? prev.hardware.filter(h => h !== hw) : [...prev.hardware, hw]
      };
    });
  };

  const finishHardwareSelection = () => {
    calculateResult('complex');
  };

  const calculateResult = (flow: string) => {
    let baseItems = ['포스 1세트', '네이버 커넥트 단말기'];
    let reasonText = '';

    if (flow === 'B') { // 배달 전문
      baseItems.push('배달매니저', '주방프린터');
      reasonText = '다중 플랫폼 앱 대신 배달매니저 하나로 통합 관리하고, 프린터로 동선을 최소화하세요.';
    } else if (flow === 'C') { // 테이크아웃
      baseItems.push('QR오더(키오스크 모드) OR 듀얼모니터');
      reasonText = '비좁은 공간에 최적화된 미니 키오스크 환경을 구축하여 회전율을 높이세요.';
    } else if (flow === 'E') { // 특수 매장
      baseItems = ['정밀 진단 후 맞춤 구성 안내'];
      reasonText = '무인 매장(셀프 계산대)이나 단기 팝업(이동형 단말기)은 환경에 따라 구성이 완전히 달라지므로 전문 상담원의 정밀 진단을 진행합니다.';
    } else if (flow === 'complex') { // Step 3까지 진행된 복합 로직
      // 1. 기본 장비 세팅
      if (selections.type === 'A') { // 요식업
        if (selections.operation === '선불형') {
          baseItems.push('키오스크');
          reasonText = '카운터 결제 집중을 막기 위해 키오스크를 도입하여 인건비를 절감하세요. ';
        } else if (selections.operation === '후불형') {
          baseItems.push('QR오더', '오더포스(직원용 주문기)');
          reasonText = '후불형 매장은 특성상 키오스크가 부적합합니다. 대신 테이블에 QR오더를 부착하여 주문 누락을 막으세요. ';
        }
      } else if (selections.type === 'D') { // 유통/서비스
        if (selections.special === '바코드') {
          baseItems = ['유통 전용 포스', '바코드 스캐너', '네이버 커넥트 단말기'];
          reasonText = '방대한 상품 관리와 빠른 바코드 스캔 결제에 최적화된 유통 전용 세트입니다. ';
        } else if (selections.special === '저울') {
          baseItems = ['유통 포스', '바코드 스캐너', '저울 연동 지원 모델(상담필수)', '네이버 커넥트 단말기'];
          reasonText = '중량에 따른 가격 계산이 필수이므로, 저울 연동이 완벽하게 지원되는 특수 모델로 구성됩니다. ';
        } else if (selections.special === 'PC연동') {
          baseItems = ['베이직 포스', 'PC 연동 결제 단말기'];
          reasonText = '사용 중이신 미용/예약 프로그램과의 호환성을 먼저 테스트한 후 PC 연동 단말기를 세팅합니다. ';
        } else if (selections.special === '이동결제') {
          baseItems = ['스마트폰 블루투스 단말기 OR 무선 통신형 단말기'];
          reasonText = '출장이나 외부 결제가 잦으시다면 유지비가 없는 블루투스형 또는 속도가 빠른 무선 통신형 중 유리한 것을 추천해 드립니다. ';
        }
      }

      // 2. 하드웨어 옵션 추가 (Step 3)
      if (selections.hardware.includes('dual')) {
        baseItems.push('듀얼모니터');
        reasonText += '또한 듀얼모니터를 통해 고객에게 신뢰감을 주고 결제 내역을 투명하게 안내할 수 있습니다.';
      }
      if (selections.hardware.includes('printer')) {
        if (!baseItems.includes('주방프린터')) baseItems.push('주방프린터');
        reasonText += ' 주방이나 다른 층으로 전표를 즉시 전송하여 직원 동선을 획기적으로 줄여줍니다.';
      }
      if (selections.hardware.includes('kds')) {
        baseItems.push('KDS (주방 디스플레이)');
        reasonText += ' 종이 영수증 분실 위험 없이 KDS 화면을 통해 정확하고 깨끗한 주방 환경을 만듭니다.';
      }
    }

    setResult({
      title: '사장님의 매장 조건에 완벽히 맞는 맞춤 구성입니다.',
      items: baseItems,
      reason: reasonText
    });
    
    // 결과 화면으로 이동 전 상태 정리
    setHistory(prev => [...prev, currentStep]);
    setCurrentStep('result');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#0056FF] selection:text-white flex flex-col">
      
      {/* Top Status Bar (Fixed) */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 py-5 px-6 flex justify-center shadow-sm">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#F8FAFC] border border-gray-200">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0056FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0056FF]"></span>
          </span>
          <span className="text-sm sm:text-base font-black tracking-tight text-[#0056FF]">
            1688-4345 상담 연결 대기 중입니다
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 pt-16 pb-32 flex flex-col justify-center min-h-[70vh]">
        
        {/* Back Button (Hidden on Hero and Result) */}
        {currentStep !== 'hero' && currentStep !== 'result' && (
           <button 
             onClick={goBack}
             className="flex items-center gap-2 text-gray-400 hover:text-[#0F172A] font-bold text-lg mb-10 transition-colors self-start"
           >
             <ChevronLeft className="w-6 h-6" /> 이전으로
           </button>
        )}

        <AnimatePresence mode="wait">
          
          {/* [Screen 1: Hero] */}
          {currentStep === 'hero' && (
            <motion.div key="hero" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.05em] leading-[1.1] mb-10 break-keep">
                매장에 가장<br />완벽한 포스 구성을<br />먼저 확인해보세요.
              </h1>
              <button
                onClick={() => goToStep('step1')}
                className="w-full min-h-[96px] bg-[#0056FF] hover:bg-blue-700 text-white text-3xl font-black rounded-3xl active:scale-[0.98] transition-all flex items-center justify-between px-10 shadow-2xl shadow-blue-500/20"
              >
                <span>내 매장 맞춤 구성 찾기</span>
                <ArrowRight className="w-10 h-10" strokeWidth={3} />
              </button>
            </motion.div>
          )}

          {/* [Screen 2: Step 1 - Industry Type] */}
          {currentStep === 'step1' && (
            <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <span className="text-[#0056FF] font-black text-2xl tracking-tight mb-4 block">STEP 01</span>
              <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.05em] mb-12 break-keep">어떤 형태의 매장을 준비 중이신가요?</h2>
              <div className="flex flex-col gap-4">
                {[
                  { id: 'A', label: '일반 홀 운영 매장 (식당/카페)' },
                  { id: 'B', label: '배달 전문 매장 (홀 없음)' },
                  { id: 'C', label: '100% 테이크아웃 매장' },
                  { id: 'D', label: '유통/도소매 및 일반 서비스업' },
                  { id: 'E', label: '특수 매장 (무인매장 / 팝업스토어)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleStep1(item.id)}
                    className="w-full min-h-[88px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border-2 border-transparent hover:border-[#0F172A] rounded-3xl text-2xl sm:text-3xl font-black tracking-[-0.05em] text-left px-8 active:scale-[0.98] transition-all text-[#0F172A] break-keep leading-tight flex items-center"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* [Screen 2: Step 2A - F&B Operation] */}
          {currentStep === 'step2A' && (
            <motion.div key="step2A" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <span className="text-[#0056FF] font-black text-2xl tracking-tight mb-4 block">STEP 02</span>
              <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.05em] mb-12 break-keep">주문과 결제가 주로 언제 이루어지나요?</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleStep2A('선불형')}
                  className="w-full min-h-[100px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border-2 border-transparent hover:border-[#0F172A] rounded-3xl text-left px-8 active:scale-[0.98] transition-all flex flex-col justify-center gap-2"
                >
                  <span className="text-3xl font-black tracking-[-0.05em] text-[#0F172A]">선불형</span>
                  <span className="text-lg text-gray-500 font-semibold">고객이 카운터에서 주문과 동시에 결제</span>
                </button>
                <button
                  onClick={() => handleStep2A('후불형')}
                  className="w-full min-h-[100px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border-2 border-transparent hover:border-[#0F172A] rounded-3xl text-left px-8 active:scale-[0.98] transition-all flex flex-col justify-center gap-2"
                >
                  <span className="text-3xl font-black tracking-[-0.05em] text-[#0F172A]">후불형</span>
                  <span className="text-lg text-gray-500 font-semibold">고객이 식사를 마친 후 나갈 때 일괄 결제</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* [Screen 2: Step 2B - Retail/Service Condition] */}
          {currentStep === 'step2B' && (
            <motion.div key="step2B" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <span className="text-[#0056FF] font-black text-2xl tracking-tight mb-4 block">STEP 02</span>
              <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.05em] mb-12 break-keep">운영에 필요한 특수 조건이 있으신가요?</h2>
              <div className="flex flex-col gap-4">
                {[
                  { id: '바코드', label: '상품 바코드 스캔 위주 (마트/의류)' },
                  { id: '저울', label: '저울 연동 필수 (정육/수산물)' },
                  { id: 'PC연동', label: '외부 PC 프로그램 연동 (미용실/골프)' },
                  { id: '이동결제', label: '이동 결제가 잦음 (출장/배달 직접 수행)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleStep2B(item.id)}
                    className="w-full min-h-[88px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border-2 border-transparent hover:border-[#0F172A] rounded-3xl text-2xl sm:text-3xl font-black tracking-[-0.05em] text-left px-8 active:scale-[0.98] transition-all text-[#0F172A] break-keep leading-tight flex items-center"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* [Screen 2: Step 3 - Hardware Multi-select] */}
          {currentStep === 'step3' && (
            <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <span className="text-[#0056FF] font-black text-2xl tracking-tight mb-4 block">STEP 03 (선택사항)</span>
              <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.05em] mb-4 break-keep">매장 구조상 필요한 옵션을<br/>모두 골라주세요.</h2>
              <p className="text-xl text-gray-500 font-semibold mb-10">없다면 바로 결과 보기를 눌러주세요.</p>
              
              <div className="flex flex-col gap-4 mb-12">
                {[
                  { id: 'dual', label: '고객에게 결제 금액을 보여줄 화면이 필요함' },
                  { id: 'printer', label: '주방이 멀거나 배달 전표 분리가 필요함' },
                  { id: 'kds', label: '주방에서 종이 없이 화면으로 주문을 보고 싶음' },
                ].map((hw) => {
                  const isSelected = selections.hardware.includes(hw.id);
                  return (
                    <button
                      key={hw.id}
                      onClick={() => toggleHardware(hw.id)}
                      className={cn(
                        "w-full min-h-[100px] border-2 rounded-3xl text-left px-8 active:scale-[0.98] transition-all flex items-center gap-6",
                        isSelected ? "bg-[#0F172A] border-[#0F172A] text-white" : "bg-[#F8FAFC] border-gray-200 hover:border-gray-400 text-[#0F172A]"
                      )}
                    >
                      {isSelected ? <CheckSquare className="w-8 h-8 text-[#0056FF] flex-shrink-0" /> : <Square className="w-8 h-8 text-gray-400 flex-shrink-0" />}
                      <span className="text-2xl font-black tracking-[-0.05em] leading-snug break-keep">{hw.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={finishHardwareSelection}
                className="w-full min-h-[96px] bg-[#0056FF] hover:bg-blue-700 text-white text-3xl font-black rounded-3xl active:scale-[0.98] transition-all"
              >
                조합 완료! 결과 보기
              </button>
            </motion.div>
          )}

          {/* [Screen 3: Result] */}
          {currentStep === 'result' && (
            <motion.div key="result" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <div className="flex items-center gap-5 mb-10">
                <CheckCircle2 className="w-16 h-16 text-[#0056FF]" strokeWidth={2.5} />
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] leading-tight">분석 완료</h2>
              </div>
              
              <h3 className="text-3xl font-black text-gray-400 mb-6 tracking-tight break-keep">{result.title}</h3>
              
              <div className="bg-[#0F172A] rounded-[40px] p-8 sm:p-12 mb-10 shadow-2xl">
                <div className="flex flex-col gap-4 mb-10">
                  {result.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                      <span className="w-2 h-2 rounded-full bg-[#0056FF] flex-shrink-0"></span>
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-[-0.05em] leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <p className="text-lg sm:text-xl text-gray-300 font-semibold leading-relaxed break-keep">
                    {result.reason}
                  </p>
                </div>
              </div>

              {/* 추가 권장 서비스 (고정) */}
              <div className="bg-[#F8FAFC] border border-[#0056FF]/20 rounded-[32px] p-8 sm:p-10 mb-16">
                <span className="text-[#0056FF] font-black text-xl tracking-tight mb-2 block">+ 도입을 추천하는 서비스</span>
                <h4 className="text-3xl font-black tracking-[-0.05em] mb-4 text-[#0F172A]">단골플러스 & 오늘얼마</h4>
                <p className="text-gray-600 font-semibold text-lg leading-relaxed break-keep">
                  가볍게 세팅하여 스마트한 포인트 관리(CRM)와 실시간 모바일 매출 관리 환경을 구축하세요.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                     window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                  className="w-full min-h-[96px] bg-[#0F172A] hover:bg-black text-white text-3xl font-black rounded-3xl active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                >
                  <span className="w-3 h-3 rounded-full bg-[#0056FF] animate-pulse"></span>
                  이 구성으로 상담 대기
                </button>
                <button 
                  onClick={() => {
                    setCurrentStep('hero');
                    setHistory([]);
                  }} 
                  className="w-full min-h-[80px] text-gray-400 font-bold text-xl hover:text-gray-600 transition-colors"
                >
                  조건 다시 선택하기
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* [Screen 3: Process & Official Links] (하단 고정 정보 영역) */}
      <section className="bg-[#F8FAFC] border-t border-gray-100 pt-32 pb-40 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-black tracking-[-0.05em] mb-24 text-[#0F172A]">도입 진행 절차</h2>
          <div className="flex flex-col gap-16 mb-40">
            {PROCESS.map((p) => (
              <div key={p.step} className="relative pl-6 sm:pl-10">
                <div className="absolute -left-4 -top-8 text-[100px] sm:text-[140px] font-black text-gray-200/50 tracking-tighter leading-none select-none z-0">
                  {p.step}
                </div>
                <div className="relative z-10 border-l-4 border-[#0F172A] pl-6 py-2">
                  <h3 className="text-3xl sm:text-4xl font-black tracking-[-0.05em] mb-4 text-[#0F172A]">{p.title}</h3>
                  <p className="text-xl sm:text-2xl text-gray-500 font-semibold leading-relaxed break-keep">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-5xl sm:text-7xl font-black tracking-[-0.05em] mb-12 text-[#0F172A]">오케이포스<br/>공식 채널</h2>
          <div className="flex flex-col gap-2">
            {LINKS.map((link) => (
              <a 
                key={link.label} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer"
                className="py-8 border-b border-gray-300 text-3xl sm:text-4xl font-black tracking-[-0.05em] text-[#0F172A] hover:text-[#0056FF] transition-colors flex items-center justify-between group"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-10 h-10 text-gray-300 group-hover:text-[#0056FF] transition-transform group-hover:translate-x-2" />
              </a>
            ))}
          </div>
          <div className="mt-24 text-gray-400 font-bold tracking-tight text-lg">
            © OKPOS. All rights reserved.
          </div>
        </div>
      </section>

    </div>
  );
}