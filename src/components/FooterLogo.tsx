import React from 'react';

/**
 * National Daegu Meteorological Science Museum (국립대구기상과학관)
 * Official emblem and museum branding footer
 */
export const FooterLogo: React.FC = () => {
  return (
    <footer id="museum-footer" className="w-full mt-10 border-t border-indigo-900/50 bg-[#060818]/90 backdrop-blur-md pt-8 pb-10 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Museum Official Emblem & Title */}
        <div className="flex items-center gap-4">
          {/* Official Republic of Korea Government Taegeuk Emblem (Vector SVG) */}
          <div className="w-14 h-14 shrink-0 rounded-full bg-white p-1.5 flex items-center justify-center shadow-lg shadow-indigo-950/50">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              aria-label="대한민국 정부 태극 상징"
            >
              <g transform="rotate(-30 50 50)">
                {/* Red upper swirl */}
                <path
                  d="M 50,5 A 45,45 0 0,1 50,95 A 22.5,22.5 0 0,1 50,50 A 22.5,22.5 0 0,0 50,5 Z"
                  fill="#CD2E3A"
                />
                {/* Blue lower swirl */}
                <path
                  d="M 50,95 A 45,45 0 0,1 50,5 A 22.5,22.5 0 0,1 50,50 A 22.5,22.5 0 0,0 50,95 Z"
                  fill="#0047A0"
                />
              </g>
            </svg>
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Noto_Sans_KR']">
                국립대구기상과학관
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300">
                기상청 소속
              </span>
            </div>
            <span className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
              National Daegu Meteorological Science Museum
            </span>
          </div>
        </div>

        {/* Museum Info & Copyright */}
        <div className="text-xs text-center md:text-right text-slate-400 space-y-1">
          <p className="text-slate-300 font-medium">
            기상과학의 원리를 쉽고 재미있게 배우는 어린이 체험형 전시관
          </p>
          <p className="text-slate-500">
            대구광역시 동구 효동로 2길 45 (효목동) | 대표전화: 053-953-0365
          </p>
          <p className="text-slate-500 text-[11px]">
            © National Daegu Meteorological Science Museum. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
