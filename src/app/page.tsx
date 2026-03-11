"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronLeft, CheckSquare, Square, Download, AlertCircle, Info, Store, ShoppingBag, UtensilsCrossed, Coffee, Box, MapPin } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import html2canvas from 'html2canvas';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Data ---
type Step = 'hero' | 'step1' | 'stepSize' | 'step2A' | 'step2B' | 'step2C' | 'step3' | 'result';

interface Selections {
  type: string;
  typeLabel: string;
  size?: string;
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
  { step: '01', title: '상담 진행', desc: '매장 환경에 맞는 최적의 디바이스 제안' },
  { step: '02', title: '서류 수취', desc: '가맹점 등록에 필요한 필수 서류 수취' },
  { step: '03', title: '계약 진행', desc: '최적의 맞춤형 디바이스와 솔루션 계약 진행' },
  { step: '04', title: '카드 가맹접수', desc: '영업일 기준 3~5일 소요', highlight: true },
  { step: '05', title: '방문 설치', desc: '도입 완료' },
];

// --- Animations ---
const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [history, setHistory] = useState<Step[]>([]);
  const [selections, setSelections] = useState<Selections>({ type: '', typeLabel: '', hardware: [] });
  
  // 결과 분리 (기본 vs 추가)
  const [result, setResult] = useState({ 
    title: '', 
    basic: [] as string[], 
    additional: [] as string[],
    reason: '',
    summaryText: ''
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

  const handleStep1 = (type: string, label: string) => {
    setSelections(prev => ({ ...prev, type, typeLabel: label, size: undefined, operation: undefined, special: undefined, hardware: [] }));
    if (type === 'A') goToStep('stepSize'); 
    else if (type === 'B') calculateResult('B'); 
    else if (type === 'C') calculateResult('C'); 
    else if (type === 'D') goToStep('step2B'); 
    else if (type === 'E') calculateResult('E'); 
    else if (type === 'F') goToStep('step2C'); 
  };

  const handleStepSize = (size: string) => {
    setSelections(prev => ({ ...prev, size }));
    goToStep('step2A');
  }

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
    let basicItems = ['포스 1세트', '네이버 커넥트 단말기 (기본 제공)'];
    let additionalItems: string[] = [];
    let reasonText = '';
    
    let summaryArr = [selections.typeLabel];
    if (selections.size) summaryArr.push(selections.size);
    if (selections.operation) summaryArr.push(selections.operation);
    if (selections.special) summaryArr.push(selections.special);
    if (selections.hardware.length > 0) summaryArr.push('추가옵션 있음');
    const summaryText = summaryArr.filter(Boolean).join(' · ');

    if (flow === 'B') {
      additionalItems.push('배달매니저 (프로그램)', '주방프린터');
      reasonText = '배달 앱들을 일일이 확인할 필요 없이 배달매니저 하나로 통합하세요. 기본 제공되는 커넥트 단말기는 공간을 차지하지 않으면서 안정적인 결제를 지원합니다.';
    } else if (flow === 'C') {
      additionalItems.push('일반 키오스크', '또는 QR오더 키오스크 모드 (부착형 스티커)', '또는 네이버 커넥트 단말기 키오스크 모드');
      reasonText = '테이크아웃 매장은 회전율이 생명이므로 고객이 직접 주문하는 키오스크가 필수입니다. 일반 키오스크를 두기 부담스럽다면 QR오더 스티커나 커넥트 단말기를 활용해 좁은 매장에서도 효율적인 결제 환경을 구축할 수 있습니다.';
    } else if (flow === 'E') {
      basicItems = ['정밀 진단 후 맞춤 구성 안내'];
      reasonText = '무인 매장이나 팝업스토어는 환경에 따라 변수가 많습니다. 커넥트 단말기의 100% 활용 여부를 포함하여 전문 상담원이 정밀 진단을 진행합니다.';
    } else if (flow === 'F1') {
      basicItems = ['3인치 유선 카드단말기'];
      reasonText = '포스기 없이 빠르고 간편하게 영수증 출력이 가능한 가장 경제적이고 베이직한 결제 세팅입니다.';
    } else if (flow === 'F2') {
      basicItems = ['무선단말기 (블루투스형 OR 통신형)'];
      reasonText = '이동 결제에 필수적인 무선 장비입니다. 스마트폰과 블루투스로 연결하는 방식과, 통신료가 발생하지만 단독 개통해서 쓰는 통신형 모델 중 상황에 맞게 비교해 드립니다.';
    } else if (flow === 'complex') {
      if (selections.type === 'A') {
        if (selections.operation === '선불형') {
          additionalItems.push('일반 키오스크', '또는 QR오더 키오스크 모드 (스티커 부착형)', '또는 네이버 커넥트 단말기 키오스크 모드');
          reasonText = '바쁜 카운터 업무 분산을 위해 키오스크 도입을 추천합니다. 공간이나 비용이 부담스럽다면 스티커 부착형 QR오더를 키오스크로 활용하거나, 기본 제공되는 커넥트 단말기를 키오스크 모드로 즉시 전환하여 사용할 수 있습니다.';
        } else if (selections.operation === '후불형') {
          additionalItems.push('QR오더 (테이블오더 대체)', '오더포스 (직원용 주문기)');
          reasonText = '고가의 테이블오더 태블릿 대신, 고객 휴대폰을 활용하는 QR오더를 도입해 초기 비용을 대폭 절감하세요. 주문은 포스로 즉시 전송되어 누락 없는 후불 결제가 가능합니다.';
        }
        
        if (selections.size === '대형 매장 (테이블 15개 이상)' && selections.operation === '후불형') {
             reasonText += ' 특히 대형 매장의 경우 직원들의 이동 동선을 줄이기 위해 오더포스와 여러 대의 주방프린터(또는 KDS) 도입을 적극 검토해야 합니다.';
             if (!additionalItems.includes('주방프린터')) additionalItems.push('주방프린터 (복수 대수 권장)');
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
        if (!additionalItems.includes('주방프린터') && !additionalItems.includes('주방프린터 (복수 대수 권장)')) {
             additionalItems.push('주방프린터');
        }
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
      reason: reasonText,
      summaryText
    });
    
    goToStep('result');
  };

  const handleCapture = async () => {
    if (captureRef.current) {
      try {
        const canvas = await html2canvas(captureRef.current, { 
          scale: 2,
          backgroundColor: '#F8FAFC' // Softer background for capture
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "okpos_recommendation.png";
        link.click();
        alert("구성이 갤러리에 저장되었습니다. 상담 시 이미지를 보여주시면 더욱 빠른 안내가 가능합니다.");
      } catch (e) {
        console.error("Capture failed:", e);
        alert("화면 저장에 실패했습니다. 직접 캡처를 이용해주세요.");
      }
    }
  };

  // 1-3 Step Progress Indicator
  const renderProgress = (stepNum: number) => (
    <div className="flex items-center gap-2 mb-8">
       {[1, 2, 3].map((s) => (
         <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${s <= stepNum ? 'bg-[#0055FF]' : 'bg-gray-100'}`} />
       ))}
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#0055FF] selection:text-white flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="font-black text-2xl tracking-tighter text-black">OKPOS</div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 text-[#0055FF] rounded-full border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0055FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0055FF]"></span>
          </span>
          <span className="text-sm font-bold tracking-tight">상담 대기 중</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-8 flex flex-col relative">
        <div className="h-14 mb-2 flex items-center">
          {currentStep !== 'hero' && currentStep !== 'result' && (
            <button 
              onClick={goBack}
              className="flex items-center gap-1.5 text-gray-400 hover:text-black font-bold text-lg transition-colors active:scale-95 px-2 py-1 -ml-2 rounded-lg hover:bg-gray-50"
            >
              <ChevronLeft className="w-6 h-6" /> 이전 단계
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col relative">
          <AnimatePresence mode="wait">
            
            {/* HERO */}
            {currentStep === 'hero' && (
              <motion.div key="hero" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col h-full justify-center pb-20">
                {/* 도입 프로세스 요약 가이드 (추가됨) */}
                <div className="bg-[#F8FAFC] border border-blue-100 rounded-[2rem] p-6 sm:p-8 mb-12 shadow-sm">
                  <div className="flex items-center gap-2 mb-8">
                    <Info className="w-5 h-5 text-[#0055FF]" />
                    <span className="text-sm font-black tracking-widest text-[#0055FF] uppercase">진행 프로세스</span>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 relative">
                    {PROCESS.map((step, i) => (
                      <div key={i} className="flex flex-row lg:flex-col items-start lg:items-center gap-4 flex-1 relative z-10 group">
                        {/* Mobile Connector */}
                        {i < PROCESS.length - 1 && (
                          <div className="lg:hidden absolute top-[3rem] left-6 w-[2px] h-[calc(100%-1rem)] bg-blue-100 -z-10"></div>
                        )}
                        {/* Desktop Connector */}
                        {i < PROCESS.length - 1 && (
                          <div className="hidden lg:block absolute top-6 left-[60%] w-full h-[2px] bg-blue-100 -z-10"></div>
                        )}
                        
                        <div className="w-12 h-12 rounded-full bg-white border-[3px] border-[#0055FF] text-[#0055FF] flex items-center justify-center text-base font-black shrink-0 shadow-sm z-10">
                          {i + 1}
                        </div>
                        
                        <div className="flex flex-col lg:items-center pt-1 lg:pt-2 w-full">
                          <h4 className="text-lg font-black text-[#0F172A] mb-1.5 whitespace-nowrap">{step.title}</h4>
                          <p className={`text-sm font-bold leading-snug break-keep lg:text-center w-full max-w-[200px] lg:max-w-none ${step.highlight ? 'text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg inline-block border border-red-100' : 'text-gray-500'}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-start gap-2 text-gray-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[11px] sm:text-xs font-bold leading-relaxed break-keep">
                      신규상담 및 신규 설치는 평일 영업시간 내에 순차적으로 진행됩니다.
                    </p>
                  </div>
                </div>

                <div className="inline-block p-4 bg-[#F8FAFC] rounded-3xl w-max mb-8 border border-gray-100 shadow-sm">
                  <Store className="w-10 h-10 text-[#0055FF]" />
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.05em] leading-[1.1] mb-6 text-black break-keep">
                  매장에 맞는<br />
                  포스 구성을<br />
                  미리 찾아보세요.
                </h1>
                <p className="text-xl sm:text-2xl text-gray-500 font-semibold tracking-tight mb-16 leading-relaxed break-keep">
                  선택지에 답하는 것만으로<br />
                  가장 합리적인 구성을 1분 만에 도출합니다.
                </p>
                <button
                  onClick={() => goToStep('step1')}
                  className="w-full h-24 bg-[#0F172A] hover:bg-black text-white text-2xl sm:text-3xl font-black rounded-[2rem] active:scale-[0.98] transition-all flex items-center justify-between px-8 shadow-2xl shadow-black/10 group"
                >
                  <span>구성 찾기 시작</span>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ArrowRight className="w-6 h-6" strokeWidth={3} />
                  </div>
                </button>
              </motion.div>
            )}

            {/* STEP 1 */}
            {currentStep === 'step1' && (
              <motion.div key="step1" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(1)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12 break-keep text-black">어떤 형태의 매장인가요?</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'A', label: '일반 홀 운영 (식당/카페)', icon: UtensilsCrossed },
                    { id: 'B', label: '배달 전문 (홀 없음)', icon: Box },
                    { id: 'C', label: '100% 테이크아웃', icon: Coffee },
                    { id: 'D', label: '유통/도소매/서비스업', icon: ShoppingBag },
                    { id: 'E', label: '특수 (무인매장/팝업)', icon: Store },
                    { id: 'F', label: '단순 결제/이동형 (포스 불필요)', icon: MapPin },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleStep1(item.id, item.label)}
                      className="group w-full min-h-[96px] bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-xl sm:text-2xl font-black tracking-[-0.05em] text-left px-6 py-4 active:scale-[0.98] transition-all break-keep flex items-center gap-5 shadow-sm hover:shadow-md"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] flex items-center justify-center group-hover:bg-[#EFF6FF] transition-colors">
                        <item.icon className="w-7 h-7 text-gray-400 group-hover:text-[#0055FF]" />
                      </div>
                      <span className="text-[#0F172A]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2 - Size */}
            {currentStep === 'stepSize' && (
              <motion.div key="stepSize" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(2)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12 break-keep text-black">매장의 규모는 어느 정도인가요?</h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleStepSize('소형/중형 매장 (테이블 15개 미만)')}
                    className="w-full bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-left px-8 py-10 active:scale-[0.98] transition-all flex flex-col gap-3 shadow-sm hover:shadow-md"
                  >
                    <span className="text-3xl font-black tracking-tight text-black">소형/중형 매장</span>
                    <span className="text-lg text-gray-500 font-semibold">테이블 15개 미만으로 비교적 동선이 짧음</span>
                  </button>
                  <button
                    onClick={() => handleStepSize('대형 매장 (테이블 15개 이상)')}
                    className="w-full bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-left px-8 py-10 active:scale-[0.98] transition-all flex flex-col gap-3 shadow-sm hover:shadow-md"
                  >
                    <span className="text-3xl font-black tracking-tight text-black">대형 매장</span>
                    <span className="text-lg text-gray-500 font-semibold">테이블 15개 이상으로 직원 이동 동선이 김</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2A */}
            {currentStep === 'step2A' && (
              <motion.div key="step2A" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(2)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12 break-keep text-black">결제는 언제 이루어지나요?</h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleStep2A('선불형')}
                    className="w-full bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-left px-8 py-10 active:scale-[0.98] transition-all flex flex-col gap-3 shadow-sm hover:shadow-md"
                  >
                    <span className="text-3xl font-black tracking-tight text-black">선불형</span>
                    <span className="text-lg text-gray-500 font-semibold">고객이 카운터에서 주문과 동시에 결제</span>
                  </button>
                  <button
                    onClick={() => handleStep2A('후불형')}
                    className="w-full bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-left px-8 py-10 active:scale-[0.98] transition-all flex flex-col gap-3 shadow-sm hover:shadow-md"
                  >
                    <span className="text-3xl font-black tracking-tight text-black">후불형</span>
                    <span className="text-lg text-gray-500 font-semibold">고객이 식사를 마친 후 나갈 때 일괄 결제</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2B */}
            {currentStep === 'step2B' && (
              <motion.div key="step2B" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(2)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12 break-keep text-black">특수 운영 조건이 있나요?</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { id: '바코드', label: '상품 바코드 스캔 위주' },
                    { id: '저울', label: '저울 연동 필수 (정육/수산)' },
                    { id: 'PC연동', label: '기존 PC 프로그램 연동' },
                    { id: '이동결제', label: '이동 결제가 잦음 (출장/배달)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleStep2B(item.label)}
                      className="w-full min-h-[96px] bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-2xl font-black tracking-[-0.05em] text-left px-8 active:scale-[0.98] transition-all break-keep flex items-center shadow-sm hover:shadow-md text-[#0F172A]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2C */}
            {currentStep === 'step2C' && (
              <motion.div key="step2C" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(2)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12 break-keep text-black">주로 어디서 결제가 이루어지나요?</h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      setSelections(prev => ({ ...prev, special: '고정카운터 단독결제' }));
                      calculateResult('F1');
                    }}
                    className="w-full bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-left px-8 py-10 active:scale-[0.98] transition-all flex flex-col gap-3 shadow-sm hover:shadow-md"
                  >
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-black break-keep">매장 내 고정된 카운터</span>
                    <span className="text-base sm:text-lg text-gray-500 font-semibold break-keep">단순 결제와 영수증 출력만 필요함</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelections(prev => ({ ...prev, special: '무선/이동 결제' }));
                      calculateResult('F2');
                    }}
                    className="w-full bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-left px-8 py-10 active:scale-[0.98] transition-all flex flex-col gap-3 shadow-sm hover:shadow-md"
                  >
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-black break-keep">야외, 플리마켓, 배달 등</span>
                    <span className="text-base sm:text-lg text-gray-500 font-semibold break-keep">이동이 잦아 무선 결제가 필수임</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 - Hardware */}
            {currentStep === 'step3' && (
              <motion.div key="step3" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(3)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-4 break-keep text-black">추가 옵션을 골라주세요.</h2>
                <p className="text-xl text-gray-500 font-bold mb-10">해당 없으면 바로 넘어가세요.</p>
                
                <div className="flex flex-col gap-4 mb-12">
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
                          "w-full min-h-[104px] border-2 rounded-[2rem] text-left px-8 py-4 active:scale-[0.98] transition-all flex items-center gap-5 shadow-sm hover:shadow-md",
                          isSelected ? "bg-[#0F172A] border-[#0F172A] text-white" : "bg-white border-[#E2E8F0] hover:border-[#0055FF] text-[#0F172A]"
                        )}
                      >
                        {isSelected ? <CheckSquare className="w-8 h-8 text-[#0055FF] flex-shrink-0" /> : <Square className="w-8 h-8 text-gray-300 flex-shrink-0" />}
                        <span className="text-xl sm:text-2xl font-black tracking-tight break-keep">{hw.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => calculateResult('complex')}
                  className="w-full h-24 bg-[#0F172A] hover:bg-black text-white text-2xl font-black rounded-[2rem] active:scale-[0.98] transition-transform shadow-xl"
                >
                  조합 완료하고 결과 보기
                </button>
              </motion.div>
            )}

            {/* RESULT */}
            {currentStep === 'result' && (
              <motion.div key="result" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20 pt-8">
                
                <div ref={captureRef} className="bg-white rounded-[2.5rem] p-6 sm:p-10 mb-8 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                  {/* Decorative Background Element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                  
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 rounded-full bg-[#0055FF]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-[#0055FF]" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-black">분석 완료</h2>
                  </div>

                  {result.summaryText && (
                    <div className="mb-10 inline-flex items-start sm:items-center gap-2.5 bg-[#F8FAFC] px-5 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-gray-600 border border-[#E2E8F0] break-keep">
                      <Info className="w-5 h-5 flex-shrink-0 text-[#0055FF] mt-0.5 sm:mt-0" />
                      <span className="leading-snug">선택 조건: {result.summaryText}</span>
                    </div>
                  )}

                  <div className="mb-10">
                    <span className="text-[#0055FF] font-black text-sm mb-4 block border-b border-gray-100 pb-3 tracking-widest">기본 구성품</span>
                    <div className="flex flex-col gap-4">
                      {result.basic.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0F172A] flex-shrink-0 mt-2.5"></span>
                          <span className="text-2xl font-black text-[#0F172A] tracking-[-0.05em] leading-tight break-keep">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.additional.length > 0 && (
                    <div className="mb-10">
                      <span className="text-[#0055FF] font-black text-sm mb-4 block border-b border-gray-100 pb-3 tracking-widest">추가 구성품 및 서비스</span>
                      <div className="flex flex-col gap-4">
                        {result.additional.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] flex-shrink-0 mt-2.5"></span>
                            <span className="text-2xl font-black text-[#475569] tracking-[-0.05em] leading-tight break-keep">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0]">
                    <p className="text-base sm:text-lg text-[#334155] font-semibold leading-relaxed break-keep">
                      {result.reason}
                    </p>
                  </div>

                  <div className="mt-8 flex items-start gap-2.5 text-[#94A3B8] bg-gray-50/50 p-4 rounded-xl">
                     <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                     <p className="text-xs sm:text-sm font-semibold leading-relaxed break-keep">
                       본 구성은 참고용이며, 실제 상담 시 환경에 따라 최적화된 기기가 재안내될 수 있습니다.
                     </p>
                  </div>
                </div>

                {selections.type !== 'F' && (
                  <div className="bg-gradient-to-br from-blue-50 to-[#EFF6FF] border border-blue-100/50 rounded-[2.5rem] p-8 sm:p-10 mb-12 shadow-sm">
                    <span className="inline-block px-3 py-1 bg-[#0055FF]/10 text-[#0055FF] font-black text-xs rounded-lg mb-4 tracking-widest">추천 소프트웨어</span>
                    <h4 className="text-2xl sm:text-3xl font-black tracking-tight mb-3 text-[#0F172A]">단골플러스 & 오늘얼마</h4>
                    <p className="text-[#475569] font-medium text-lg leading-relaxed break-keep">
                      가볍게 도입하여 포인트 적립(CRM)과 실시간 모바일 매출 관리 환경을 구축하세요.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleCapture}
                    className="w-full h-24 bg-[#0055FF] hover:bg-blue-700 text-white text-xl sm:text-2xl font-black rounded-[2rem] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,85,255,0.25)]"
                  >
                    <Download className="w-7 h-7" />
                    결과 화면 캡처하고 상담하기
                  </button>
                  <button 
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setCurrentStep('hero');
                      setHistory([]);
                    }} 
                    className="w-full h-16 text-[#64748B] font-bold text-lg hover:text-[#0F172A] transition-colors"
                  >
                    조건 다시 선택하기
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] pt-24 pb-32 px-6 mt-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-16 text-[#0F172A]">도입 진행 절차</h2>
          <div className="flex flex-col gap-0 mb-32">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="flex gap-6 sm:gap-10 group">
                <div className="flex flex-col items-center">
                  <div className="text-4xl sm:text-5xl font-black text-[#0055FF] tracking-tighter shrink-0 py-2">
                    {p.step}
                  </div>
                  {i < PROCESS.length - 1 && (
                    <div className="w-[2px] flex-1 bg-gradient-to-b from-[#0055FF]/20 to-transparent min-h-[40px] my-2"></div>
                  )}
                </div>
                <div className="pt-4 pb-12">
                  <h3 className="text-2xl font-black tracking-tight mb-3 text-[#0F172A] flex items-center gap-3">
                    {p.title}
                    <div className="h-1 w-1 rounded-full bg-blue-200"></div>
                  </h3>
                  <div className={`inline-block ${p.highlight ? 'bg-red-50 border border-red-100 px-4 py-2 rounded-xl' : ''}`}>
                    <p className={`text-lg font-semibold leading-relaxed break-keep max-w-lg ${p.highlight ? 'text-red-600' : 'text-[#64748B]'}`}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-8 text-[#0F172A]">공식 채널</h2>
          <div className="flex flex-col bg-white rounded-[2rem] border border-[#E2E8F0] overflow-hidden shadow-sm">
            {LINKS.map((link, idx) => (
              <a 
                key={link.label} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer"
                className={`py-6 px-8 text-xl font-black tracking-tight text-[#334155] hover:text-[#0055FF] hover:bg-[#F8FAFC] transition-colors flex items-center justify-between ${idx !== LINKS.length - 1 ? 'border-b border-[#E2E8F0]' : ''}`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-6 h-6 text-[#94A3B8]" />
              </a>
            ))}
          </div>
          <div className="mt-16 text-[#94A3B8] font-bold text-center">
            © OKPOS. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
