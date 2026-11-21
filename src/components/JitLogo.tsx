import React, { useState } from 'react';

interface JitLogoProps {
  className?: string;
  customLogoUrl?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export const JitLogo: React.FC<JitLogoProps> = ({
  className = 'w-12 h-12',
  customLogoUrl = '',
  showWordmark = false,
  wordmarkClassName = 'text-slate-900',
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="inline-flex flex-col items-center select-none">
      {customLogoUrl && !imgError ? (
        <img
          src={customLogoUrl}
          alt="Jharna Institute of Technology (JIT) Logo"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`${className} object-contain`}
        />
      ) : (
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label="Jharna Institute of Technology (JIT) Official Logo"
        >
          {/* Top-left / Top crescent: Rich Green */}
          <path
            d="M42 74 C24 44, 34 8, 66 8 C75 8, 84 13, 90 21 C76 15, 58 18, 47 32 C39 43, 38 59, 42 74 Z"
            fill="#22863A"
          />

          {/* Top-right / Right crescent: Deep Navy Blue */}
          <path
            d="M46 42 C76 24, 112 34, 112 66 C112 75, 107 84, 99 90 C105 76, 102 58, 88 47 C77 39, 61 38, 46 42 Z"
            fill="#12336B"
          />

          {/* Bottom-right / Bottom crescent: Dark Olive Green / Brown */}
          <path
            d="M78 46 C96 76, 86 112, 54 112 C45 112, 36 107, 30 99 C44 105, 62 102, 73 88 C81 77, 82 61, 78 46 Z"
            fill="#3E4120"
          />

          {/* Bottom-left / Left crescent: Deep Royal Blue */}
          <path
            d="M74 78 C44 96, 8 86, 8 54 C8 45, 13 36, 21 30 C15 44, 18 62, 32 73 C43 81, 59 82, 74 78 Z"
            fill="#184E96"
          />

          {/* Center Red Serif "JIT" */}
          <text
            x="60"
            y="67"
            textAnchor="middle"
            fill="#C94A43"
            fontFamily="Georgia, 'Times New Roman', Times, serif"
            fontWeight="600"
            fontSize="24"
            letterSpacing="0.5"
          >
            JIT
          </text>
        </svg>
      )}

      {showWordmark && (
        <span
          className={`mt-1 text-[10px] sm:text-[11px] font-display font-extrabold tracking-wide uppercase text-center leading-tight ${wordmarkClassName}`}
        >
          JHARNA INSTITUTE OF TECHNOLOGY
        </span>
      )}
    </div>
  );
};
