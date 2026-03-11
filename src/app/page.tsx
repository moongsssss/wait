"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronLeft, CheckSquare, Square, Download, AlertCircle, Info, Store, ShoppingBag, UtensilsCrossed, Coffee, Box, MapPin, MonitorSmartphone, Smartphone, Building2, Share2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Data ---
type Step = 'hero' | 'step1' | 'step2A' | 'step2B' | 'step3' | 'result';

interface Selections {
  type: string;
  typeLabel: string;
  hardware: string[];
  kiosk?: string;
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

function FAQAccordion({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3 bg-white">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-[#0F172A] hover:bg-gray-50 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1 text-gray-600 text-sm sm:text-base leading-relaxed break-keep">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
    setSelections({ type, typeLabel: label, hardware: [] });
    if (type === 'A') {
      goToStep('step2A'); 
    } else {
      calculateResult(type); 
    }
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

  const handleStep3 = (kioskOpt: string) => {
    setSelections(prev => ({ ...prev, kiosk: kioskOpt }));
    calculateResult('complex', kioskOpt);
  };

  const calculateResult = (flow: string, kioskOpt?: string) => {
    let basicItems: string[] = [];
    let additionalItems: string[] = [];
    let reasonText = '';
    
    let summaryArr = [selections.typeLabel];
    
    if (flow === 'B') {
      basicItems = ['유선 단말기 단독 설치'];
      reasonText = '포스기 없이 단순 결제만 필요하거나, 기존에 사용 중인 PC 연동 프로그램(병원, 헬스장, 미용실 등)이 있는 환경에 가장 적합한 경제적인 구성입니다.';
    } else if (flow === 'C') {
      basicItems = ['무선 단말기 (블루투스 스와이프 OR 개통형)'];
      reasonText = '공간 제약이 있거나 이동 및 야외 결제가 필수적인 환경(배달, 푸드트럭, 플리마켓 등)에서 언제 어디서나 안정적인 결제를 지원합니다.';
    } else if (flow === 'complex') {
      // Step 1: A (포스 기반 통합 관리)
      
      // Upgrade receipt printer if 'backup' is selected
      if (selections.hardware.includes('backup')) {
        basicItems = ['포스기', '유선단말기 (영수증 프린터 및 결제 백업용)', '금전함', '카드리더기', '네이버 커넥트 단말기', '키보드 & 마우스'];
        reasonText += '인터넷이나 포스 고장 시에도 유선단말기를 통해 결제가 중단되지 않는 가장 안전한 환경이 세팅됩니다. ';
        summaryArr.push('결제 백업 강화');
      } else {
        basicItems = ['포스기', '영수증 프린터', '금전함', '카드리더기', '네이버 커넥트 단말기', '키보드 & 마우스'];
      }

      if (selections.hardware.includes('dual')) {
        additionalItems.push('포스 듀얼모니터 9.7인치');
        summaryArr.push('고객 확인용 화면');
      }
      if (selections.hardware.includes('barcode')) {
        additionalItems.push('바코드 스캐너 (건타입)');
        summaryArr.push('바코드 스캔');
      }
      if (selections.hardware.includes('printer')) {
        additionalItems.push('주방프린터');
        summaryArr.push('주방 주문서');
      }
      if (selections.hardware.includes('kds')) {
        additionalItems.push('주방 KDS');
        reasonText += '주방에 종이 영수증 대신 KDS를 도입하여 위생적이고 체계적인 조리 관리가 가능합니다. ';
        summaryArr.push('디지털 주방');
      }
      if (selections.hardware.includes('delivery')) {
        additionalItems.push('배달매니저 (프로그램)');
        reasonText += '배달 앱들을 하나로 통합 관리하는 배달매니저로 운영 효율을 극대화합니다. ';
        summaryArr.push('배달 관리');
      }
      if (selections.hardware.includes('taxrefund')) {
        additionalItems.push('택스리펀드 서비스 연동');
        summaryArr.push('외국인 면세');
      }
      if (selections.hardware.includes('orderpos')) {
        additionalItems.push('오더포스 (테이블형/벽걸이형)');
        reasonText += '직원들이 먼 거리에서도 즉시 주문을 입력할 수 있는 오더포스로 동선을 단축시킵니다. ';
        summaryArr.push('동선 최적화');
      }

      // Kiosk Options
      if (kioskOpt === 'kiosk') {
        additionalItems.push('전문 키오스크 기기');
        summaryArr.push('키오스크');
        reasonText += '선불 전용 결제 환경에 맞춰, 고객이 직접 직관적으로 주문하고 결제할 수 있는 전문 키오스크 기기를 함께 제안해 드립니다. ';
      } else if (kioskOpt === 'qr') {
        additionalItems.push('QR오더 시스템');
        summaryArr.push('QR오더');
        reasonText += '매장의 결제 방식(선불, 후불, 키오스크 모드)과 상관없이 모두 대응 가능한 만능 솔루션입니다. 고가의 기기 없이 테이블 스티커만으로 주문/결제를 자동화합니다. ';
      } else if (kioskOpt === 'budget') {
        additionalItems.push('네이버 커넥트 단말기 또는 QR오더 키오스크 모드');
        summaryArr.push('비용 절감형 셀프결제');
        reasonText += '기본 제공되는 네이버 커넥트 단말기를 키오스크 모드로 전환하거나 QR오더를 활용하여, 추가적인 기기 도입 비용 없이 셀프 주문 환경을 만듭니다. ';
      }
    }

    const summaryText = summaryArr.filter(Boolean).join(' · ');

    setResult({
      title: '사장님 매장에 가장 합리적인 맞춤 구성입니다.',
      basic: basicItems,
      additional: additionalItems,
      reason: reasonText || '선택하신 운영 조건에 맞춘 가장 효율적이고 안정적인 포스 시스템입니다.',
      summaryText
    });
    
    goToStep('result');
  };

  const handleCapture = async () => {
    if (captureRef.current) {
      try {
        const canvas = await html2canvas(captureRef.current, { 
          scale: 3, // Higher scale for PDF quality
          useCORS: true,
          backgroundColor: '#FFFFFF'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save("okpos_recommendation.pdf");
        
        alert("맞춤 구성 리포트가 PDF로 저장되었습니다. 상담 시 파일을 보여주시면 더욱 빠른 안내가 가능합니다.");
      } catch (e) {
        console.error("PDF generation failed:", e);
        alert("파일 저장에 실패했습니다. 직접 캡처를 이용해주세요.");
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '오케이포스 맞춤 구성',
          text: '내가 방금 찾아본 매장 맞춤 구성이야! 곧 전화가 오니까 같이 확인해보자.',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      alert("현재 브라우저에서는 공유 기능을 지원하지 않습니다. 링크를 복사해서 전달해주세요!");
    }
  };

  const getIconForDevice = (item: string) => {
    if (item.includes('단말기') || item.includes('스마트폰') || item.includes('QR')) return <Smartphone className="w-5 h-5 text-[#0F172A]" />;
    if (item.includes('포스') || item.includes('모니터') || item.includes('KDS') || item.includes('키오스크')) return <MonitorSmartphone className="w-5 h-5 text-[#0F172A]" />;
    if (item.includes('스캐너') || item.includes('금전함') || item.includes('리더기') || item.includes('마우스') || item.includes('프린터')) return <Box className="w-5 h-5 text-[#0F172A]" />;
    return <CheckCircle2 className="w-5 h-5 text-[#0055FF]" />;
  };

  // 1-4 Step Progress Indicator
  const renderProgress = (stepNum: number, maxSteps: number = 4) => (
    <div className="mb-8">
      <div className="text-sm font-black text-[#0055FF] mb-3 tracking-tight">
        1분이면 끝나요! ({stepNum} / {maxSteps} 단계)
      </div>
      <div className="flex items-center gap-2">
         {Array.from({ length: maxSteps }).map((_, idx) => {
           const s = idx + 1;
           return (
             <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${s <= stepNum ? 'bg-[#0055FF]' : 'bg-gray-100'}`} />
           );
         })}
      </div>
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
          <span className="text-sm font-bold tracking-tight">📞 1544-3640 전화 대기 중</span>
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
                {/* 도입 프로세스 요약 가이드 */}
                <div className="bg-[#F8FAFC] border border-blue-100 rounded-[2rem] p-6 sm:p-8 mb-12 shadow-sm">
                  <div className="flex items-center gap-2 mb-8">
                    <Info className="w-5 h-5 text-[#0055FF]" />
                    <span className="text-sm font-black tracking-widest text-[#0055FF] uppercase">진행 프로세스</span>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 relative">
                    {PROCESS.map((step, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-row lg:flex-col items-start lg:items-center gap-4 flex-1 relative z-10 group"
                      >
                        {/* Mobile Connector */}
                        {i < PROCESS.length - 1 && (
                          <div className="lg:hidden absolute top-[3rem] left-[1.4rem] w-[2px] h-[calc(100%-1rem)] bg-blue-50 -z-10 overflow-hidden">
                            <motion.div
                              initial={{ y: "-100%" }}
                              animate={{ y: "200%" }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "linear",
                              }}
                              className="w-full h-1/2 bg-gradient-to-b from-transparent via-[#0055FF] to-transparent opacity-50"
                            />
                          </div>
                        )}
                        {/* Desktop Connector */}
                        {i < PROCESS.length - 1 && (
                          <div className="hidden lg:block absolute top-6 left-[60%] w-full h-[2px] bg-blue-50 -z-10 overflow-hidden">
                            <motion.div
                              initial={{ x: "-100%" }}
                              animate={{ x: "200%" }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "linear",
                              }}
                              className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#0055FF] to-transparent opacity-50"
                            />
                          </div>
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
                      </motion.div>
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
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-[#0055FF] text-xs sm:text-sm font-black rounded-lg border border-blue-100 uppercase tracking-tighter">
                    Since 1995
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-400 tracking-tight">
                    누적 30만 가맹점이 선택한 No.1 포스
                  </span>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.05em] leading-[1.1] mb-6 text-black break-keep">
                  매장에 맞는<br />
                  포스 구성을<br />
                  미리 찾아보세요.
                </h1>
                <p className="text-xl sm:text-2xl text-gray-500 font-semibold tracking-tight mb-8 leading-relaxed break-keep">
                  선택지에 답하는 것만으로<br />
                  가장 합리적인 구성을 1분 만에 도출합니다.
                </p>
                
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-12 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-[#0055FF] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#0055FF] font-black text-lg tracking-tight mb-1">잠시만 기다려주세요!</p>
                    <p className="text-blue-800 font-bold text-sm sm:text-base leading-relaxed break-keep">
                      곧 <span className="underline decoration-2 underline-offset-4">1544-3640</span> 번호로 전문 상담원이 전화를 드릴 예정입니다. 잘 받아주시면 빠른 안내가 가능합니다.
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => goToStep('step1')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-24 bg-[#0F172A] hover:bg-black text-white text-2xl sm:text-3xl font-black rounded-[2rem] transition-all flex items-center justify-between px-8 shadow-2xl shadow-black/10 group mb-4 relative overflow-hidden"
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  />
                  
                  <span className="relative z-10">구성 찾기 시작</span>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors relative z-10">
                    <ArrowRight className="w-6 h-6" strokeWidth={3} />
                  </div>
                </motion.button>
                <button
                  onClick={() => {
                    setResult({
                      title: '전문 컨설턴트가 최적의 구성을 제안해 드립니다.',
                      basic: ['정밀 진단 후 맞춤 구성 안내'],
                      additional: [],
                      reason: '매장 환경이 복잡하거나 어떤 기기가 필요한지 잘 모르시더라도 걱정하지 마세요. 전문 상담원이 매장의 규모, 동선, 결제 방식을 꼼꼼히 파악하여 가장 합리적이고 완벽한 포스 시스템을 맞춤형으로 컨설팅해 드립니다.',
                      summaryText: '전문가 상담 요청'
                    });
                    goToStep('result');
                  }}
                  className="w-full h-16 bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] text-[#64748B] hover:text-[#0F172A] text-lg sm:text-xl font-bold rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  잘 모르겠어요, 상담 후 결정할래요
                </button>
              </motion.div>
            )}

            {/* STEP 1 */}
            {currentStep === 'step1' && (
              <motion.div key="step1" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(1, 4)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-4 break-keep text-black">어떤 형태의 매장을 운영하시나요?</h2>
                <p className="text-xl text-gray-500 font-bold mb-10">가장 비슷한 매장 환경을 골라주세요.</p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'A', label: '일반적인 식당 / 카페 / 마트', desc: '메뉴를 누르고 결제하는 포스기가 꼭 필요한 곳', icon: MonitorSmartphone },
                    { id: 'B', label: '단순 결제 카운터 / 병원 / 미용실', desc: '포스기 없이 카드 결제만 되거나, 기존 PC에 연결할 곳', icon: Building2 },
                    { id: 'C', label: '배달 전문 / 푸드트럭 / 플리마켓', desc: '야외나 이동하면서 선 없이 결제해야 하는 곳', icon: Smartphone },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleStep1(item.id, item.label)}
                      className="group w-full bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-left px-6 sm:px-8 py-6 active:scale-[0.98] transition-all break-keep flex items-center gap-5 shadow-sm hover:shadow-md"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] flex items-center justify-center group-hover:bg-[#EFF6FF] transition-colors shrink-0">
                        <item.icon className="w-7 h-7 text-gray-400 group-hover:text-[#0055FF]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] mb-1">{item.label}</span>
                        <span className="text-sm sm:text-base font-semibold text-gray-500">{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2-A - Hardware Options (Front) */}
            {currentStep === 'step2A' && (
              <motion.div key="step2A" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(2, 4)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-4 break-keep text-black">카운터와 결제 쪽에 필요한 기능이 있나요?</h2>
                <p className="text-xl text-gray-500 font-bold mb-10">해당 없으면 바로 다음으로 넘어가세요. (중복 선택 가능)</p>
                
                <div className="flex flex-col gap-3 mb-12">
                  {[
                    { id: 'dual', label: '고객이 주문/금액을 볼 수 있는 화면이 필요해요' },
                    { id: 'barcode', label: '바코드를 찍어서 상품을 팔아야 해요' },
                    { id: 'taxrefund', label: '외국인 관광객이 많이 와서 면세가 필요해요' },
                    { id: 'backup', label: '혹시 인터넷이 끊겨도 결제는 꼭 돼야 해요' },
                  ].map((hw) => {
                    const isSelected = selections.hardware.includes(hw.id);
                    return (
                      <button
                        key={hw.id}
                        onClick={() => toggleHardware(hw.id)}
                        className={cn(
                          "w-full min-h-[88px] border-2 rounded-2xl text-left px-6 py-4 active:scale-[0.98] transition-all flex items-center gap-4 shadow-sm hover:shadow-md",
                          isSelected ? "bg-[#0F172A] border-[#0F172A] text-white" : "bg-white border-[#E2E8F0] hover:border-[#0055FF] text-[#0F172A]"
                        )}
                      >
                        {isSelected ? <CheckSquare className="w-7 h-7 text-[#0055FF] flex-shrink-0" /> : <Square className="w-7 h-7 text-gray-300 flex-shrink-0" />}
                        <span className="text-lg sm:text-xl font-bold tracking-tight break-keep">{hw.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToStep('step2B')}
                  className="w-full h-24 bg-[#0F172A] hover:bg-black text-white text-2xl font-black rounded-[2rem] active:scale-[0.98] transition-transform shadow-xl flex items-center justify-between px-8"
                >
                  <span>다음 단계로</span>
                  <ArrowRight className="w-7 h-7" />
                </button>
              </motion.div>
            )}

            {/* STEP 2-B - Hardware Options (Back/Kitchen) */}
            {currentStep === 'step2B' && (
              <motion.div key="step2B" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(3, 4)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-4 break-keep text-black">주방이나 매장 운영에 필요한 기능이 있나요?</h2>
                <p className="text-xl text-gray-500 font-bold mb-10">해당 없으면 바로 다음으로 넘어가세요. (중복 선택 가능)</p>
                
                <div className="flex flex-col gap-3 mb-12">
                  {[
                    { id: 'printer', label: '주방이 멀어서 종이 주문서가 나와야 해요' },
                    { id: 'kds', label: '주방에서 종이 대신 모니터로 주문을 보고 싶어요' },
                    { id: 'delivery', label: '배달의민족, 요기요 등 배달 주문이 많아요' },
                    { id: 'orderpos', label: '직원들이 매장 곳곳에서 바로 주문을 넣어야 해요' },
                  ].map((hw) => {
                    const isSelected = selections.hardware.includes(hw.id);
                    return (
                      <button
                        key={hw.id}
                        onClick={() => toggleHardware(hw.id)}
                        className={cn(
                          "w-full min-h-[88px] border-2 rounded-2xl text-left px-6 py-4 active:scale-[0.98] transition-all flex items-center gap-4 shadow-sm hover:shadow-md",
                          isSelected ? "bg-[#0F172A] border-[#0F172A] text-white" : "bg-white border-[#E2E8F0] hover:border-[#0055FF] text-[#0F172A]"
                        )}
                      >
                        {isSelected ? <CheckSquare className="w-7 h-7 text-[#0055FF] flex-shrink-0" /> : <Square className="w-7 h-7 text-gray-300 flex-shrink-0" />}
                        <span className="text-lg sm:text-xl font-bold tracking-tight break-keep">{hw.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToStep('step3')}
                  className="w-full h-24 bg-[#0F172A] hover:bg-black text-white text-2xl font-black rounded-[2rem] active:scale-[0.98] transition-transform shadow-xl flex items-center justify-between px-8"
                >
                  <span>선택 완료</span>
                  <ArrowRight className="w-7 h-7" />
                </button>
              </motion.div>
            )}

            {/* STEP 3 - Self Order */}
            {currentStep === 'step3' && (
              <motion.div key="step3" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col pb-20">
                {renderProgress(4, 4)}
                <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12 break-keep text-black">손님이 직접 주문하고 결제하는 기능이 필요하신가요?</h2>
                
                <div className="flex flex-col gap-4">
                  {[
                    { id: 'kiosk', label: '네, 전용 키오스크 기기를 놓고 싶어요', desc: '입구나 카운터에 두는 선불 전용 무인 결제기' },
                    { id: 'qr', label: '네, 손님 스마트폰으로 주문하게 할래요 (QR오더)', desc: '선불/후불 모두 가능! 테이블 스티커로 주문부터 결제까지' },
                    { id: 'budget', label: '필요한데, 기기 비용은 아끼고 싶어요', desc: '기본 제공 단말기를 활용하거나 가성비 좋은 방식으로 세팅' },
                    { id: 'none', label: '아니요, 직원이 직접 주문을 받을게요', desc: '별도의 셀프 결제 시스템은 필요 없음' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleStep3(item.id)}
                      className="w-full bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] rounded-[2rem] text-left px-6 sm:px-8 py-6 active:scale-[0.98] transition-all flex flex-col gap-2 shadow-sm hover:shadow-md"
                    >
                      <span className="text-xl sm:text-2xl font-black tracking-tight text-black">{item.label}</span>
                      <span className="text-sm sm:text-base text-gray-500 font-semibold">{item.desc}</span>
                    </button>
                  ))}
                </div>
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
                    <span className="text-[#0055FF] font-black text-sm mb-4 block border-b border-gray-100 pb-3 tracking-widest">기본 구성</span>
                    <div className="flex flex-col gap-4">
                      {result.basic.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                             {getIconForDevice(item)}
                          </div>
                          <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-[-0.05em] leading-tight break-keep pt-0.5">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.additional.length > 0 && (
                    <div className="mb-10">
                      <span className="text-[#0055FF] font-black text-sm mb-4 block border-b border-gray-100 pb-3 tracking-widest">추가 솔루션 및 장비</span>
                      <div className="flex flex-col gap-4">
                        {result.additional.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                               <CheckCircle2 className="w-5 h-5 text-[#0055FF]" />
                            </div>
                            <span className="text-xl sm:text-2xl font-black text-[#475569] tracking-[-0.05em] leading-tight break-keep pt-0.5">{item}</span>
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

                {/* 추가 추천 서비스: 단골플러스 */}
                <div className="bg-gradient-to-br from-blue-50 to-[#EFF6FF] border border-blue-100/50 rounded-[2.5rem] p-8 sm:p-10 mb-6 shadow-sm">
                  <span className="inline-block px-3 py-1 bg-[#0055FF]/10 text-[#0055FF] font-black text-xs rounded-lg mb-4 tracking-widest">추천 소프트웨어</span>
                  <h4 className="text-2xl sm:text-3xl font-black tracking-tight mb-3 text-[#0F172A]">단골플러스</h4>
                  <p className="text-[#475569] font-medium text-lg leading-relaxed break-keep mb-0">
                    CRM과 포인트 관리를 가볍게 도입하여 재방문율을 높이는 환경을 구축하세요.
                  </p>
                </div>

                {/* 통신/보안 컨설팅 패키지 링크 */}
                <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-8 sm:p-10 mb-12 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-6 h-6 text-gray-400" />
                    <h4 className="text-xl font-black tracking-tight text-[#0F172A]">통신/보안 컨설팅 패키지</h4>
                  </div>
                  <p className="text-[#475569] font-semibold text-lg leading-relaxed break-keep mb-6">
                    인터넷과 CCTV도 오케이포스에서 한 번에 해결하세요.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a href="https://www.okposmall.co.kr/internet" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-6 py-4 rounded-2xl transition-colors font-bold text-[#334155]">
                      <span>인터넷 패키지 상담하기</span>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </a>
                    <a href="https://www.okposmall.co.kr/cctv" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-6 py-4 rounded-2xl transition-colors font-bold text-[#334155]">
                      <span>CCTV 패키지 상담하기</span>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </a>
                  </div>
                </div>
                
                {/* 미니 FAQ */}
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6 px-2">
                    <HelpCircle className="w-6 h-6 text-[#0055FF]" />
                    <h4 className="text-xl font-black tracking-tight text-[#0F172A]">사장님들이 많이 묻는 질문</h4>
                  </div>
                  <FAQAccordion title="설치는 보통 얼마나 걸리나요?">
                    기본 포스 세트 설치는 보통 <strong>1시간 전후</strong>로 소요됩니다. 다만, 추가 기기(대수)가 많아지거나 매장의 인터넷/배선 환경에 따라 시간이 추가될 수 있습니다.
                  </FAQAccordion>
                  <FAQAccordion title="중도 해지 시 위약금이 있나요?">
                    <strong>구매 장비는 별도의 위약금이 없습니다.</strong> 다만, 임대/렌탈 계약으로 진행하실 경우 계약 기간 내 해지 시 위약금이 발생할 수 있습니다. 자세한 내용은 상담 시 꼭 같이 문의해주세요!
                  </FAQAccordion>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleCapture}
                    className="w-full h-24 bg-[#0055FF] hover:bg-blue-700 text-white text-xl sm:text-2xl font-black rounded-[2rem] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,85,255,0.25)] px-6"
                  >
                    <Download className="w-7 h-7" />
                    <span className="break-keep">내 맞춤 구성 저장 완료! (상담 시 이 화면을 켜두세요)</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full h-16 bg-white border-2 border-[#E2E8F0] hover:border-[#0055FF] text-[#0F172A] text-lg font-bold rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    동업자 / 가족에게 결과 공유하기
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