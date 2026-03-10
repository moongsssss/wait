"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronLeft, CheckSquare, Square, Download, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import html2canvas from 'html2canvas';

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
const fadeVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [history, setHistory] = useState<Step[]>([]);
  const [selections, setSelections] = useState<Selections>({ type: '', hardware: [] });
  
  // 결과 분리 (기본 vs 추가)
  const [result, setResult] = useState({
    title: '', 
    basic: [] as string[], 
    additional: [] as string[],
    reason: '' 
  });

  const captureRef = useRef<HTMLDivElement>(null);

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
    if (type === 'A') goToStep('step2A'); 
    else if (type === 'B') calculateResult('B'); 
    else if (type === 'C') calculateResult('C'); 
    else if (type === 'D') goToStep('step2B'); 
    else if (type === 'E') calculateResult('E'); 
  };

  const handleStep2A = (operation: string) => {
    setSelections(prev => ({ ...prev, operation }));
    goToStep('step3'); 
  };

  const handleStep2B = (special: string) => {
    setSelections(prev => ({ ...prev, special }));
    goToStep('step3'); 
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
    // 모든 구성의 뼈대
    let basicItems = ['포스 1세트', '네이버 커넥트 단말기 (기본 제공)'];
    let additionalItems: string[] = [];
    let reasonText = '';

    if (flow === 'B') {
      additionalItems.push('배달매니저 (프로그램)', '주방프린터');
      reasonText = '배달 앱들을 일일이 확인할 필요 없이 배달매니저 하나로 통합하세요. 기본 제공되는 커넥트 단말기는 공간을 차지하지 않으면서 안정적인 결제를 지원합니다.';
    } else if (flow === 'C') {
      additionalItems.push('QR오더 키오스크 모드 (부착형 스티커)', '네이버 커넥트 단말기 키오스크 모드');
      reasonText = '비싼 대형 키오스크 하드웨어 대신, QR오더 스티커나 커넥트 단말기를 키오스크 모드로 연동하세요. 좁은 매장에서도 고객이 직접 주문하고 결제하는 환경이 구축됩니다.';
    } else if (flow === 'E') {
      basicItems = ['정밀 진단 후 맞춤 구성 안내'];
      reasonText = '무인 매장이나 팝업스토어는 환경에 따라 변수가 많습니다. 커넥트 단말기의 100% 활용 여부를 포함하여 전문 상담원이 정밀 진단을 진행합니다.';
    } else if (flow === 'complex') {
      if (selections.type === 'A') {
        if (selections.operation === '선불형') {
          additionalItems.push('일반 키오스크', '또는 네이버 커넥트 단말기 키오스크 모드');
          reasonText = '바쁜 카운터 업무 분산을 위해 키오스크 도입을 추천합니다. 일반 키오스크 기기가 부담스럽다면, 기본 제공되는 커넥트 단말기를 키오스크 모드로 즉시 전환하여 사용할 수 있습니다.';
        } else if (selections.operation === '후불형') {
          additionalItems.push('QR오더 (테이블오더 대체)', '오더포스 (직원용 주문기)');
          reasonText = '고가의 테이블오더 태블릿 대신, 고객 휴대폰을 활용하는 QR오더를 도입해 초기 비용을 대폭 절감하세요. 주문은 포스로 즉시 전송되어 누락 없는 후불 결제가 가능합니다.';
        }
      } else if (selections.type === 'D') {
        if (selections.special === '바코드') {
          additionalItems.push('유통 프로그램 별도 세팅', '바코드 스캐너');
          reasonText = '기본 포스 세트에 방대한 재고 관리를 위한 유통 프로그램을 세팅합니다. 커넥트 단말기는 어떠한 유통 환경에서도 가장 빠르고 안정적인 결제 승인을 보장합니다.';
        } else if (selections.special === '저울') {
          additionalItems.push('유통 프로그램 별도 세팅', '바코드 스캐너', '호환 저울 연동 세팅 안내');
          reasonText = '중량당 가격 계산이 필수적인 환경입니다. 당사 포스와 완벽히 연동되는 저울 모델을 별도로 안내 및 세팅해 드립니다. (저울 하드웨어 자체는 직접 판매하지 않습니다)';
        } else if (selections.special === 'PC연동') {
          additionalItems.push('기존 PC 연동 세팅');
          reasonText = '사용 중인 기존 PC 프로그램(미용, 예약 등)이 있다면, 커넥트 단말기를 해당 PC와 직접 연동하여 이중 결제 작업 없이 한 번에 처리하세요.';
        } else if (selections.special === '이동결제') {
          additionalItems.push('통신형 무선단말기 (또는 블루투스 단말기)');
          reasonText = '이동 결제가 잦은 경우, 포스 외에 휴대성을 극대화한 전용 무선 단말기를 추가 구성으로 추천해 드립니다.';
        }
      }

      if (selections.hardware.includes('dual')) {
        additionalItems.push('고객용 듀얼모니터');
        reasonText += ' 추가로 듀얼모니터를 통해 주문 내역을 투명하게 공유하여 신뢰도를 높이세요.';
      }
      if (selections.hardware.includes('printer')) {
        if (!additionalItems.includes('주방프린터')) additionalItems.push('주방프린터');
        reasonText += ' 주방프린터는 홀과 주방의 물리적 거리를 극복하는 필수 추가 옵션입니다.';
      }
      if (selections.hardware.includes('kds')) {
        additionalItems.push('KDS (주방 디스플레이)');
        reasonText += ' 종이 영수증 없는 KDS를 도입하여 스마트하고 깨끗한 주방 환경을 만드세요.';
      }
    }

    setResult({
      title: '사장님 매장에 가장 합리적인 맞춤 구성입니다.',
      basic: basicItems,
      additional: additionalItems,
      reason: reasonText
    });
    
    goToStep('result');
  };

  // --- Capture Function ---
  const handleCapture = async () => {
    if (captureRef.current) {
      try {
        const canvas = await html2canvas(captureRef.current, { 
          scale: 2,
          backgroundColor: '#F9FAFB'
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "okpos_recommendation.png";
        link.click();
        alert("구성이 이미지로 저장되었습니다.\n상담원에게 이 이미지를 보여주시면 더욱 빠른 안내가 가능합니다!");
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } catch (e) {
        console.error("Capture failed:", e);
        alert("화면 저장에 실패했습니다. 직접 스크린샷을 찍어주세요.");
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white text-black font-sans selection:bg-[#0055FF] selection:text-white flex flex-col">
      
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

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col relative">
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
                <span className="text-[#0055FF] font-black text-xl mb-3 block">STEP 3 (추가 선택)</span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-4 break-keep text-black">추가 옵션을 골라주세요.</h2>
                <p className="text-xl text-gray-500 font-medium mb-10">해당 없으면 바로 넘어가세요.</p>
                
                <div className="flex flex-col gap-3 mb-12">
                  {[ 
                    { id: 'dual', label: '고객용 결제 화면(듀얼모니터) 필요' },
                    { id: 'printer', label: '주방이 멀어 주방프린터 필요' },
                    { id: 'kds', label: '주방에 종이 대신 모니터(KDS) 필요' },
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
                
                {/* 캡처 대상 영역 (Result Card) */}
                <div 
                  ref={captureRef}
                  className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 mb-6"
                >
                  {/* 기본 세트 */}
                  <div className="mb-8">
                    <span className="text-[#0055FF] font-black text-sm mb-3 block border-b border-gray-200 pb-2">기본 구성품</span>
                    <div className="flex flex-col gap-3">
                      {result.basic.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-black flex-shrink-0 mt-2.5"></span>
                          <span className="text-2xl font-black text-black tracking-[-0.05em] leading-tight break-keep">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 추가 세트 */}
                  {result.additional.length > 0 && (
                    <div className="mb-8">
                      <span className="text-[#0055FF] font-black text-sm mb-3 block border-b border-gray-200 pb-2">추가 구성품 및 서비스</span>
                      <div className="flex flex-col gap-3">
                        {result.additional.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0 mt-2.5"></span>
                            <span className="text-2xl font-black text-gray-700 tracking-[-0.05em] leading-tight break-keep">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed break-keep">
                      {result.reason}
                    </p>
                  </div>

                  <div className="mt-6 flex items-start gap-2 text-gray-400">
                     <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                     <p className="text-xs font-medium leading-relaxed break-keep">
                       본 추천 구성은 참고용이며, 실제 상담 시 매장 환경에 따라 추천 안내가 변경될 수 있습니다.
                     </p>
                  </div>
                </div>

                {/* Additional Recommendation */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 sm:p-8 mb-12">
                  <span className="text-[#0055FF] font-black text-sm mb-2 block">+ 강력 추천 소프트웨어</span>
                  <h4 className="text-xl sm:text-2xl font-black tracking-tight mb-2 text-black">단골플러스 & 오늘얼마</h4>
                  <p className="text-gray-600 font-medium text-base leading-relaxed break-keep">
                    포인트 적립(CRM)과 실시간 모바일 매출 관리 환경을 구축하세요.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleCapture}
                    className="w-full h-20 bg-[#0055FF] hover:bg-blue-700 text-white text-2xl font-black rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,85,255,0.25)]"
                  >
                    <Download className="w-6 h-6" />
                    결과 화면 캡처하고 상담하기
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentStep('hero');
                      setHistory([]);
                    }} 
                    className="w-full h-16 text-gray-500 font-bold text-lg hover:text-black transition-colors"
                  >
                    조건 다시 선택하기
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

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