import React from 'react';

interface JitLogoProps {
  className?: string;
}

export const JitLogo: React.FC<JitLogoProps> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="10" fill="#1E3A8A" />
      <rect x="2" y="2" width="44" height="44" rx="8" stroke="#D97706" strokeWidth="1.5" strokeOpacity="0.85" />
      <path
        d="M14 15H34M24 15V33"
        stroke="#FBBF24"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M12 23.5C12 29.8513 17.3726 35 24 35C30.6274 35 36 29.8513 36 23.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="11" r="2.25" fill="#FBBF24" />
    </svg>
  );
};
