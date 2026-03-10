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
  { label: '오케이포스 공식몰', url: 'https://www.okposmall.co.kr/' },
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
// 부드럽고 묵직한 애니메이션 적용 (튀는 현상 방지)
const fadeVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [history, setHistory] = useState<Step[]>([]);
  const [selections, setSelections] = useState<Selections>({ type: '', hardware: [] });
  const [result, setResult] = useState({ title: '', items: [] as string[], reason: '' });

  // --- Logic Engine ---
  const goToStep = (nextStep: Step) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    goToStep('step3'); // 하드웨어 다중선택
  };

  const handleStep2B = (special: string) => {
    setSelections(prev => ({ ...prev, special }));
    goToStep('step3'); // 하드웨어 다중선택
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

  const calculateResult = (flow: string) => {
    // "필수"가 아닌 "기본 제공"으로 뉘앙스 변경
    let baseItems = ['포스 1세트', '네이버 커넥트 단말기 (기본 제공)'];
    let reasonText = '';

    if (flow === 'B') {
      baseItems.push('배달매니저', '주방프린터');
      reasonText = '배달 앱들을 일일이 확인할 필요 없이 배달매니저 하나로 통합하세요. 기본 제공되는 커넥트 단말기는 공간을 차지하지 않으면서 안정적인 결제를 지원합니다.';
    } else if (flow === 'C') {
      baseItems.push('QR오더 (키오스크 모드)');
      reasonText = '비싼 키오스크 하드웨어 대신, QR오더를 키오스크 모드로 연동하세요. 좁은 매장에서도 고객이 직접 주문하고 결제하는 스마트한 환경이 구축됩니다.';
    } else if (flow === 'E') {
      baseItems = ['정밀 진단 후 맞춤 구성 안내'];
      reasonText = '무인 매장이나 팝업스토어는 환경에 따라 변수가 많습니다. 커넥트 단말기의 100% 활용을 포함하여 전문 상담원이 정밀 진단을 진행합니다.';
    } else if (flow === 'complex') {
      if (selections.type === 'A') {
        if (selections.operation === '선불형') {
          baseItems.push('키오스크 (또는 단말기 키오스크 모드)');
          reasonText = '바쁜 카운터 업무 분산을 위해 키오스크 도입을 추천합니다. 별도 기기가 부담스럽다면 기본 제공되는 커넥트 단말기를 키오스크 모드로 즉시 전환하여 사용할 수 있습니다.';
        } else if (selections.operation === '후불형') {
          baseItems.push('QR오더 (테이블오더 대체)', '오더포스');
          reasonText = '고가의 테이블오더 태블릿 대신, 고객 휴대폰을 활용하는 QR오더를 도입해 초기 비용을 대폭 절감하세요. 주문은 포스로 즉시 전송되어 누락 없는 후불 결제가 가능합니다.';
        }
      } else if (selections.type === 'D') {
        if (selections.special === '바코드') {
          baseItems = ['유통 전용 포스', '네이버 커넥트 단말기 (기본 제공)', '바코드 스캐너'];
          reasonText = '방대한 재고 관리와 빠른 바코드 스캔에 최적화된 세트입니다. 커넥트 단말기는 어떠한 유통 환경에서도 가장 빠르고 안정적인 승인을 보장합니다.';
        } else if (selections.special === '저울') {
          baseItems = ['유통 포스', '네이버 커넥트 단말기 (기본 제공)', '저울 연동 지원 모델', '바코드 스캐너'];
          reasonText = '중량당 가격 계산이 필수적인 환경에 맞춰 저울 연동이 검증된 모델로 구성됩니다.';
        } else if (selections.special === 'PC연동') {
          baseItems = ['베이직 포스', '네이버 커넥트 단말기 (PC 연동 모드)'];
          reasonText = '사용 중인 기존 PC 프로그램이 있다면, 커넥트 단말기를 PC와 직접 연동하여 이중 결제 작업 없이 한 번에 처리하세요.';
        } else if (selections.special === '이동결제') {
          baseItems = ['스마트폰 블루투스 단말기 OR 통신형 무선단말기'];
          reasonText = '이동 결제가 잦은 경우 휴대성을 극대화한 전용 단말기를 추천해 드립니다.';
        }
      }

      if (selections.hardware.includes('dual')) {
        baseItems.push('고객용 듀얼모니터');
        reasonText += ' 듀얼모니터를 통해 주문 내역을 투명하게 공유하여 신뢰도를 높이세요.';
      }
      if (selections.hardware.includes('printer')) {
        if (!baseItems.includes('주방프린터')) baseItems.push('주방프린터');
        reasonText += ' 주방프린터는 홀과 주방의 물리적 거리를 극복하는 필수 옵션입니다.';
      }
      if (selections.hardware.includes('kds')) {
        baseItems.push('KDS (주방 디스플레이)');
        reasonText += ' 종이 영수증 없는 KDS를 도입하여 스마트하고 깨끗한 주방 환경을 만드세요.';
      }
    }

    setResult({
      title: '사장님 매장에 완벽히 맞는 맞춤 구성입니다.',
      items: baseItems,
      reason: reasonText
    });
    
    goToStep('result');
  };

  return (
    <div className="min-h-[100dvh] bg-white text-black font-sans selection:bg-[#0055FF] selection:text-white flex flex-col">
      
      {/* Top Status Bar (Fixed, High Contrast) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-center">
        <div className="flex items-center gap-3 px-5 py-2.5 bg-[#F4F4F5] rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0055FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0055FF]"></span>
          </span>
          <span className="text-[15px] font-bold tracking-tight text-[#0055FF]">
            1688-4345 상담 연결 대기 중
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col relative">
        
        {/* Back Button Container (occupies fixed space so content doesn't jump) */}
        <div className="h-12 mb-4">
          {currentStep !== 'hero' && currentStep !== 'result' && (
            <button 
              onClick={goBack}
              className="flex items-center gap-1 text-gray-400 hover:text-black font-bold text-lg transition-colors active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" /> 이전
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col relative">
          <AnimatePresence mode="wait">
            
            {/* [Hero Screen] */}
            {currentStep === 'hero' && (
              <motion.div key="hero" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col h-full justify-center pb-20">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.05em] leading-[1.15] mb-8 text-black break-keep">
                  내 매장에 맞는<br />
                  포스 구성을<br />
                  미리 찾아보세요.
                </h1>
                <p className="text-xl sm:text-2xl text-gray-500 font-medium tracking-tight mb-16 leading-relaxed break-keep">
                  선택지에 답하는 것만으로<br />
                  가장 합리적인 구성을 도출합니다.
                </p>
                <button
                  onClick={() => goToStep('step1')}
                  className="w-full h-24 bg-[#0055FF] text-white text-2xl sm:text-3xl font-black rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-between px-8 shadow-[0_8px_30px_rgb(0,85,255,0.25)]"
                >
                  <span>구성 찾기 시작</span>
                  <ArrowRight className="w-8 h-8" strokeWidth={3} />
                </button>
              </motion.div>
            )}

            {/* [Step 1: Industry] */}
            {currentStep === 'step1' && (
              <motion.div key="step1" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                <span className="text-[#0055FF] font-black text-xl mb-3 block">STEP 1</span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12 break-keep text-black">어떤 형태의 매장인가요?</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'A', label: '일반 홀 운영 (식당/카페)' },
                    { id: 'B', label: '배달 전문 (홀 없음)' },
                    { id: 'C', label: '100% 테이크아웃' },
                    { id: 'D', label: '유통/도소매/서비스업' },
                    { id: 'E', label: '특수 (무인매장/팝업)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleStep1(item.id)}
                      className="w-full min-h-[88px] bg-[#F9FAFB] border border-[#E5E7EB] hover:border-black rounded-2xl text-2xl font-bold tracking-tight text-left px-6 py-4 active:bg-gray-100 transition-colors break-keep flex items-center"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* [Step 2A: F&B] */}
            {currentStep === 'step2A' && (
              <motion.div key="step2A" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                <span className="text-[#0055FF] font-black text-xl mb-3 block">STEP 2</span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12 break-keep text-black">결제는 언제 이루어지나요?</h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleStep2A('선불형')}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-black rounded-2xl text-left px-6 py-8 active:bg-gray-100 transition-colors flex flex-col gap-2"
                  >
                    <span className="text-3xl font-black tracking-tight text-black">선불형</span>
                    <span className="text-lg text-gray-500 font-medium">카운터에서 주문과 동시에 결제</span>
                  </button>
                  <button
                    onClick={() => handleStep2A('후불형')}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] hover:border-black rounded-2xl text-left px-6 py-8 active:bg-gray-100 transition-colors flex flex-col gap-2"
                  >
                    <span className="text-3xl font-black tracking-tight text-black">후불형</span>
                    <span className="text-lg text-gray-500 font-medium">식사 후 나갈 때 일괄 결제</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* [Step 2B: Retail/Service] */}
            {currentStep === 'step2B' && (
              <motion.div key="step2B" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                <span className="text-[#0055FF] font-black text-xl mb-3 block">STEP 2</span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12 break-keep text-black">특수 운영 조건이 있나요?</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { id: '바코드', label: '상품 바코드 스캔 위주' },
                    { id: '저울', label: '저울 연동 필수 (정육/수산)' },
                    { id: 'PC연동', label: '기존 PC 프로그램 연동' },
                    { id: '이동결제', label: '이동 결제가 잦음 (출장/배달)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleStep2B(item.id)}
                      className="w-full min-h-[88px] bg-[#F9FAFB] border border-[#E5E7EB] hover:border-black rounded-2xl text-2xl font-bold tracking-tight text-left px-6 py-4 active:bg-gray-100 transition-colors break-keep flex items-center"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* [Step 3: Hardware Options] */}
            {currentStep === 'step3' && (
              <motion.div key="step3" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                <span className="text-[#0055FF] font-black text-xl mb-3 block">STEP 3 (선택)</span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-4 break-keep text-black">추가 옵션을 골라주세요.</h2>
                <p className="text-xl text-gray-500 font-medium mb-10">해당 없으면 바로 넘어가세요.</p>
                
                <div className="flex flex-col gap-3 mb-12">
                  {[
                    { id: 'dual', label: '고객용 결제 화면이 필요함' },
                    { id: 'printer', label: '주방이 멀어 전표 분리가 필요함' },
                    { id: 'kds', label: '주방에 종이 대신 모니터를 둘 예정' },
                  ].map((hw) => {
                    const isSelected = selections.hardware.includes(hw.id);
                    return (
                      <button
                        key={hw.id}
                        onClick={() => toggleHardware(hw.id)}
                        className={cn(
                          "w-full min-h-[96px] border rounded-2xl text-left px-6 py-4 active:scale-[0.98] transition-all flex items-center gap-4",
                          isSelected ? "bg-black border-black text-white" : "bg-[#F9FAFB] border-[#E5E7EB] hover:border-black text-black"
                        )}
                      >
                        {isSelected ? <CheckSquare className="w-7 h-7 text-[#0055FF] flex-shrink-0" /> : <Square className="w-7 h-7 text-gray-400 flex-shrink-0" />}
                        <span className="text-xl sm:text-2xl font-bold tracking-tight break-keep">{hw.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => calculateResult('complex')}
                  className="w-full h-20 bg-black text-white text-2xl font-black rounded-2xl active:bg-gray-800 transition-colors"
                >
                  조합 완료
                </button>
              </motion.div>
            )}

            {/* [Result Screen] */}
            {currentStep === 'result' && (
              <motion.div key="result" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle2 className="w-10 h-10 text-[#0055FF]" strokeWidth={3} />
                  <h2 className="text-3xl font-black tracking-tight text-black">분석 완료</h2>
                </div>
                
                <h3 className="text-3xl sm:text-4xl font-black text-black mb-8 tracking-[-0.05em] break-keep leading-tight">
                  {result.title}
                </h3>
                
                {/* Result Card */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 mb-8">
                  <div className="flex flex-col gap-4 mb-8">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                        <span className="w-2 h-2 rounded-full bg-[#0055FF] flex-shrink-0"></span>
                        <span className="text-2xl font-black text-black tracking-[-0.05em]">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-lg text-gray-600 font-medium leading-relaxed break-keep">
                      {result.reason}
                    </p>
                  </div>
                </div>

                {/* Additional Recommendation */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 sm:p-10 mb-12">
                  <span className="text-[#0055FF] font-black text-lg mb-2 block">+ 강력 추천 소프트웨어</span>
                  <h4 className="text-2xl sm:text-3xl font-black tracking-tight mb-3 text-black">단골플러스 & 오늘얼마</h4>
                  <p className="text-gray-600 font-medium text-lg leading-relaxed break-keep">
                    가볍게 세팅하여 스마트한 포인트 적립(CRM)과 실시간 모바일 매출 관리 환경을 구축하세요.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                       window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }}
                    className="w-full h-20 bg-[#0055FF] hover:bg-blue-700 text-white text-2xl font-black rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,85,255,0.25)]"
                  >
                    이 구성으로 상담 진행하기
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentStep('hero');
                      setHistory([]);
                    }} 
                    className="w-full h-16 text-gray-500 font-bold text-lg hover:text-black transition-colors"
                  >
                    처음부터 다시하기
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Information Footer (Visible mainly after result or scroll) */}
      <footer className="bg-[#F9FAFB] border-t border-[#E5E7EB] pt-24 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black tracking-tight mb-16 text-black">도입 진행 절차</h2>
          <div className="flex flex-col gap-12 mb-32">
            {PROCESS.map((p) => (
              <div key={p.step} className="flex gap-6">
                <div className="text-5xl font-black text-gray-300 tracking-tighter shrink-0 w-16">
                  {p.step}
                </div>
                <div className="pt-1">
                  <h3 className="text-2xl font-black tracking-tight mb-2 text-black">{p.title}</h3>
                  <p className="text-lg text-gray-500 font-medium leading-relaxed break-keep">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-4xl font-black tracking-tight mb-8 text-black">공식 채널</h2>
          <div className="flex flex-col">
            {LINKS.map((link) => (
              <a 
                key={link.label} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer"
                className="py-6 border-b border-gray-200 text-2xl font-black tracking-tight text-gray-600 hover:text-[#0055FF] transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-6 h-6" />
              </a>
            ))}
          </div>
          <div className="mt-20 text-gray-400 font-bold">
            © OKPOS. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
