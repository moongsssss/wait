import React from 'react';

export default function Home() {
  return (
    <main className="bg-white text-[#1d1d1f] font-sans antialiased overflow-hidden selection:bg-[#007AFF] selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20 pb-32">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          <h2 className="text-[#007AFF] font-bold tracking-widest uppercase text-sm md:text-base mb-6">
            OKPOS Consulting
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] text-black">
            매장에 맞는 구성을<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">먼저 확인하세요.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#86868b] font-medium max-w-2xl mx-auto leading-relaxed mt-8">
            상담 전 핵심 내용을 미리 파악하시면,<br className="hidden md:block"/>
            매장 환경에 최적화된 안내를 더 빠르게 받으실 수 있습니다.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-16">
            <a href="#industries" className="w-full sm:w-auto px-10 py-5 bg-black text-white text-lg font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-xl shadow-black/10">
              내 매장 구성 찾기
            </a>
            <a href="#checklist" className="w-full sm:w-auto px-10 py-5 bg-[#f5f5f7] text-[#1d1d1f] text-lg font-semibold rounded-full hover:bg-[#e8e8ed] transition-colors duration-300">
              도입 전 체크리스트
            </a>
          </div>
        </div>
      </section>

      {/* 2. Industry Selector */}
      <section id="industries" className="py-32 md:py-48 px-6 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">어떤 업종을 준비하시나요?</h2>
            <p className="text-xl md:text-2xl text-[#86868b] font-medium">업종별 최적의 솔루션을 제안합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { id: 'restaurant', name: '음식점', desc: '테이블오더와 포스 연동', icon: '🍽️' },
              { id: 'cafe', name: '카페', desc: '빠른 결제와 진동벨 연동', icon: '☕' },
              { id: 'retail', name: '도소매', desc: '바코드 스캐너와 재고관리', icon: '🛍️' },
              { id: 'service', name: '서비스', desc: '예약 관리와 고객 포인트', icon: '💇' },
            ].map((item) => (
              <div key={item.id} className="group bg-white rounded-[32px] p-10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-pointer border border-transparent hover:border-gray-200">
                <div className="text-6xl mb-8 transform group-hover:-translate-y-3 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">{item.name}</h3>
                <p className="text-[#86868b] text-lg font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Solution Grid */}
      <section className="py-32 md:py-48 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">핵심 솔루션.</h2>
            <p className="text-xl md:text-2xl text-[#86868b] font-medium">매장 운영을 더 쉽고, 더 완벽하게.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f5f5f7] rounded-[48px] p-12 md:p-16 flex flex-col justify-between overflow-hidden relative group h-[500px] md:h-[600px]">
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">OKPOS</h3>
                <p className="text-xl md:text-2xl text-[#86868b] font-medium mb-8 leading-tight">안정적인 결제와<br />직관적인 매장 관리.</p>
                <span className="text-[#007AFF] font-semibold text-xl hover:underline cursor-pointer">자세히 알아보기 &gt;</span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-[80%] h-[60%] bg-white/60 rounded-tl-3xl border-t border-l border-white shadow-2xl backdrop-blur-md group-hover:scale-105 transition-transform duration-700 flex items-center justify-center text-gray-300 font-bold text-2xl">
                POS UI Placeholder
              </div>
            </div>

            <div className="bg-[#f5f5f7] rounded-[48px] p-12 md:p-16 flex flex-col justify-between overflow-hidden relative group h-[500px] md:h-[600px]">
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">OK Kiosk</h3>
                <p className="text-xl md:text-2xl text-[#86868b] font-medium mb-8 leading-tight">인건비 절감의 핵심.<br />빠르고 정확한 무인 주문.</p>
                <span className="text-[#007AFF] font-semibold text-xl hover:underline cursor-pointer">자세히 알아보기 &gt;</span>
              </div>
              <div className="absolute -bottom-10 right-10 w-[50%] h-[70%] bg-white/60 rounded-t-3xl border-t border-l border-r border-white shadow-2xl backdrop-blur-md group-hover:scale-105 transition-transform duration-700 flex items-center justify-center text-gray-300 font-bold text-xl text-center px-4">
                Kiosk UI<br/>Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Checklist */}
      <section id="checklist" className="py-32 md:py-48 px-6 bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-24 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">상담 전 체크리스트.</h2>
            <p className="text-xl md:text-2xl text-gray-400 font-medium">아래 항목을 미리 확인하시면 상담이 훨씬 수월해집니다.</p>
          </div>

          <div className="space-y-6">
            {[
              "매장의 평수와 층수는 어떻게 되나요?",
              "주로 결제가 일어나는 곳(카운터)의 위치가 정해졌나요?",
              "테이블오더나 진동벨 등 추가 연동 기기가 필요한가요?",
              "인터넷 랜선과 콘센트 설치가 완료되었나요?",
              "사업자 등록증이 발급된 상태인가요?",
            ].map((question, index) => (
              <div key={index} className="flex items-start gap-8 p-10 rounded-[32px] bg-[#1d1d1f] border border-[#333336] hover:border-gray-500 transition-colors duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 mt-1">
                  {index + 1}
                </div>
                <p className="text-2xl md:text-3xl font-medium tracking-tight text-gray-100 leading-tight">{question}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Process */}
      <section className="py-32 md:py-48 px-6 bg-white overflow-hidden">
         <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-32">도입 프로세스.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 relative">
              <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-1 bg-gray-100 -z-10 rounded-full"></div>
              {[
                { step: '01', title: '상담 신청', desc: '현재 페이지에서 내용을 확인하고 대기합니다.' },
                { step: '02', title: '맞춤 컨설팅', desc: '전문 상담원과 매장 환경에 맞는 구성을 논의합니다.' },
                { step: '03', title: '계약 및 일정', desc: '도입 장비를 확정하고 설치 일정을 조율합니다.' },
                { step: '04', title: '설치 및 교육', desc: '전문 기사가 방문하여 설치하고 사용법을 안내합니다.' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-black mb-10 border-[6px] border-[#f5f5f7] shadow-xl group-hover:border-[#007AFF] group-hover:text-[#007AFF] transition-all duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-[#86868b] text-lg font-medium leading-relaxed max-w-[220px]">{item.desc}</p>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-32 md:py-48 px-6 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-24 text-center">자주 묻는 질문.</h2>
          
          <div className="space-y-4">
            {[
              { q: "가입비나 설치비가 별도로 있나요?", a: "기본 설치비는 무료이며, 특수 환경의 경우 사전 안내 후 진행됩니다." },
              { q: "계약 기간은 어떻게 되나요?", a: "기본 약정 기간은 3년이며, 조건에 따라 유연하게 선택 가능합니다." },
              { q: "기존에 쓰던 장비와 호환이 되나요?", a: "대부분의 표준 장비와 호환되나, 정확한 확인을 위해 기기 모델명을 상담원에게 알려주세요." },
              { q: "A/S는 어떻게 진행되나요?", a: "전국 직영 A/S망을 통해 신속하게 대처하며, 원격 지원으로 즉각적인 문제 해결을 돕습니다." },
              { q: "위약금이 발생하나요?", a: "약정 기간 내 해지 시 위약금이 발생할 수 있으며, 자세한 사항은 계약 시 상세히 안내해 드립니다." },
            ].map((faq, index) => (
              <details key={index} className="group bg-white rounded-3xl [&_summary::-webkit-details-marker]:hidden border border-transparent hover:border-gray-200 transition-colors shadow-sm">
                <summary className="flex items-center justify-between p-10 text-2xl font-bold tracking-tight cursor-pointer outline-none text-gray-900">
                  {faq.q}
                  <span className="text-[#007AFF] text-4xl font-light group-open:rotate-45 transition-transform duration-300 flex-shrink-0 ml-4">+</span>
                </summary>
                <div className="px-10 pb-10 text-[#86868b] text-xl leading-relaxed font-medium mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="text-[#86868b] font-medium text-left">
            <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">OKPOS</h3>
            <p className="text-lg mb-2">상담 및 도입 문의: <span className="text-black font-bold">1588-0000</span></p>
            <p className="text-sm mt-4">© OKPOS. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="px-6 py-3 rounded-full bg-[#f5f5f7] text-gray-600 font-bold hover:bg-gray-200 hover:text-black transition-colors">공식몰</a>
            <a href="#" className="px-6 py-3 rounded-full bg-[#f5f5f7] text-gray-600 font-bold hover:bg-gray-200 hover:text-black transition-colors">유튜브</a>
            <a href="#" className="px-6 py-3 rounded-full bg-[#f5f5f7] text-gray-600 font-bold hover:bg-gray-200 hover:text-black transition-colors">블로그</a>
          </div>
        </div>
      </footer>
    </main>
  );
}