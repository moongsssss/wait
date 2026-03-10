"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Data
const INDUSTRIES = [
  { id: 'restaurant', name: '음식점' },
  { id: 'cafe', name: '카페/베이커리' },
  { id: 'retail', name: '도소매' },
  { id: 'service', name: '서비스업' },
];

const PROCESS = [
  { step: '01', title: '문의 접수', desc: '현재 대기 중인 상태에서 기초 환경을 파악합니다.' },
  { step: '02', title: '환경 확인', desc: '제공해주신 정보를 바탕으로 매장에 필요한 구성을 점검합니다.' },
  { step: '03', title: '맞춤 제안', desc: '전문 상담원이 매장에 최적화된 기기와 솔루션을 제안합니다.' },
  { step: '04', title: '설치 및 교육', desc: '전문 기사가 방문하여 신속한 설치와 사용법 교육을 진행합니다.' },
];

const FAQS = [
  { q: "가입비나 설치비가 별도로 발생하나요?", a: "기본적인 설치비는 지원되며, 특수한 설치 환경의 경우 사전 고지 후 진행됩니다." },
  { q: "기존에 쓰던 포스기나 장비와 호환이 되나요?", a: "대부분의 표준 규격 장비와 호환이 가능하나, 정확한 확인을 위해 상담 시 보유하신 기기 모델을 알려주시면 상세히 안내해 드립니다." },
  { q: "사용 중 문제가 생기면 AS는 어떻게 되나요?", a: "전국 직영 인프라망을 통해 빠른 현장 출동이 가능하며, 24시간 원격 지원을 통해 즉각적인 문제 해결을 도와드립니다." },
];

const LINKS = [
  { label: '공식몰', url: 'https://www.okposmall.co.kr/' },
  { label: '스마트스토어', url: 'https://smartstore.naver.com/tpay' },
  { label: '인스타그램', url: 'https://www.instagram.com/okpos_official/' },
  { label: '유튜브', url: 'https://www.youtube.com/@OKPOS_official' },
  { label: '블로그', url: 'https://blog.naver.com/okpos_official' },
];

// Animation Variants
const slideVariants = {
  enter: { y: 20, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

export default function Home() {
  const [step, setStep] = useState(0); // 0: Hero, 1: Industry, 2: Q1, 3: Q2, 4: Complete
  const [answers, setAnswers] = useState({
    industry: '',
    status: '',
    feature: '',
  });

  const handleNext = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* Top Status Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex justify-center py-4">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gray-50 border border-gray-200">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0066FF]"></span>
          </span>
          <span className="text-sm font-bold tracking-tight text-[#0066FF]">
            1688-4345 상담 연결 대기 중입니다
          </span>
        </div>
      </div>

      {/* Main Interactive Viewport */}
      <section className="relative w-full max-w-2xl mx-auto px-6 py-12 min-h-[60vh] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-start w-full"
            >
              <h1 className="text-5xl sm:text-6xl font-black tracking-[-0.05em] leading-[1.1] mb-6">
                매장에 맞는<br />
                POS 구성을<br />
                먼저 확인해보세요
              </h1>
              <p className="text-xl sm:text-2xl text-gray-500 font-semibold tracking-tight mb-12 leading-snug">
                상담 전 필요한 기능을 선택해 두시면<br />
                더 빠르게 안내해 드립니다.
              </p>
              <button
                onClick={() => setStep(1)}
                className="w-full py-6 bg-[#0066FF] text-white text-2xl font-black rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                내 매장 맞춤 구성 찾기
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-10">어떤 매장을 운영하시나요?</h2>
              <div className="grid grid-cols-2 gap-4">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => handleNext('industry', ind.name)}
                    className="aspect-square bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-3xl flex flex-col items-center justify-center p-6 active:scale-95 transition-all text-center"
                  >
                    <span className="text-2xl sm:text-3xl font-black tracking-[-0.05em] text-[#111111]">{ind.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-10 leading-[1.15]">매장 운영 상태를<br/>알려주세요</h2>
              <div className="flex flex-col gap-4">
                {['신규 오픈 준비 중', '기존 매장 기기 교체'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleNext('status', status)}
                    className="w-full py-8 px-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-3xl text-2xl sm:text-3xl font-black tracking-[-0.05em] text-left active:scale-[0.98] transition-all"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-10 leading-[1.15]">어떤 솔루션 연동이<br/>필요하신가요?</h2>
              <div className="flex flex-col gap-4">
                {['POS만 필요합니다', '키오스크도 필요합니다', '배달 및 주방 연동이 필요합니다'].map((feature) => (
                  <button
                    key={feature}
                    onClick={() => handleNext('feature', feature)}
                    className="w-full py-8 px-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-3xl text-2xl sm:text-3xl font-black tracking-[-0.05em] text-left active:scale-[0.98] transition-all"
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-full py-12 text-center"
            >
              <div className="w-24 h-24 bg-blue-50 text-[#0066FF] rounded-full flex items-center justify-center mb-8">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-6">확인이 완료되었습니다.</h2>
              <p className="text-xl sm:text-2xl text-gray-500 font-semibold tracking-tight">
                전문 상담원이 맞춤 제안을<br />준비하고 있습니다.
              </p>
              <button
                onClick={() => setStep(0)}
                className="mt-12 text-lg font-bold text-gray-400 hover:text-[#111111] transition-colors"
              >
                다시 선택하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Process & FAQ Section */}
      <section className="bg-[#F9F9F9] py-24 sm:py-32 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto space-y-32">
          
          {/* Process */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-16">진행 절차</h2>
            <div className="space-y-12">
              {PROCESS.map((p) => (
                <div key={p.step} className="relative pl-8 sm:pl-12">
                  <div className="absolute left-0 top-[-20px] text-7xl sm:text-8xl font-black text-gray-200/50 tracking-tighter select-none">
                    {p.step}
                  </div>
                  <div className="relative z-10 pt-4">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-[-0.05em] mb-3">{p.title}</h3>
                    <p className="text-lg sm:text-xl text-gray-600 font-semibold leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12">자주 묻는 질문</h2>
            <div className="border-t-2 border-[#111111]">
              {FAQS.map((faq, idx) => (
                <details key={idx} className="group py-8 border-b border-gray-200 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex justify-between items-center outline-none">
                    <span className="text-xl sm:text-2xl font-black tracking-[-0.05em] pr-4">{faq.q}</span>
                    <ChevronDown className="w-8 h-8 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" strokeWidth={2.5} />
                  </summary>
                  <div className="mt-6 text-lg sm:text-xl text-gray-500 font-semibold leading-relaxed pr-8">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Global Footer & Official Links */}
      <footer className="bg-[#111111] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col">
          <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.05em] mb-12">오케이포스 공식 채널</h2>
          <div className="flex flex-col gap-2 mb-20">
            {LINKS.map((link) => (
              <a 
                key={link.label} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer"
                className="py-6 border-b border-gray-800 text-2xl sm:text-3xl font-black tracking-[-0.05em] hover:text-[#0066FF] hover:pl-4 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="text-gray-500 font-bold tracking-tight">
            © OKPOS. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
